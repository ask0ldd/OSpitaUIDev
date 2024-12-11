/* eslint-disable no-unused-private-class-members */
/* eslint-disable @typescript-eslint/no-unused-vars */
import visionModelsClues from "../constants/VisionModelsClues";
import { IConversationElement, IInferenceStats } from "../interfaces/IConversation";
import IScrapedPage from "../interfaces/IScrapedPage";
import { AIAgent } from "../models/AIAgent";
import AICharacter from "../models/AICharacter";
import ScrapedPage from "../models/ScrapedPage";
import AnswerFormatingService from "./AnswerFormatingService";
import InferenceStatsFormatingService from "./InferenceStatsFormatingService";
export class ChatService{

    static #targetedRAGDocs : string[] = []

    static activeAgent : AIAgent | AICharacter = new AIAgent({id : 'a0000000001',
      name: "baseAssistant",
      modelName : "mistral-nemo:latest",
      systemPrompt : "You are an helpful assistant",
      mirostat: 0,
      mirostat_eta: 0.1,
      mirostat_tau: 5.0,
      num_ctx: 2048,
      repeat_last_n: 64,
      repeat_penalty: 1.1,
      temperature: 0.1,
      seed: 0,
      stop: ["AI assistant:"],
      tfs_z: 1,
      num_predict: 1024,
      top_k: 40,
      top_p: 0.9,
      type : "system",
      favorite : false
    })

    /*static FollowUpQuestionsGenerator : AIAgent = new AIAgent({
      id : 'a0000000008',
      name: "FollowUpQuestionsGenerator",
      modelName : "llama3.2:3b",
      systemPrompt : "You are an helpful assistant",
      mirostat: 0,
      mirostat_eta: 0.1,
      mirostat_tau: 5.0,
      num_ctx: 2048,
      repeat_last_n: 64,
      repeat_penalty: 1.1,
      temperature: 0.1,
      seed: 0,
      stop: "AI assistant:",
      tfs_z: 1,
      num_predict: 1024,
      top_k: 40,
      top_p: 0.9,
      type : "system",
      favorite : false
    })*/

    static stillInUseAgent = this.activeAgent

    // static FUPQuestionsGeneration = true

    static async askForFollowUpQuestions(question : string, context:number[] = []) : Promise<string>
    {
      try{
        if(this.activeAgent == null) throw new Error(`Agent is not available`)

        // if vision model, no follow up questions
        // if(this.FUPQuestionsGeneration == false) return Promise.resolve(JSON.stringify([]))

        this.activeAgent.setContext(context)
        const answer = await this.activeAgent.ask(question)
        return answer.response
      } catch (error){
        console.error("Failed to generate the follow up questions : " + error)
        throw error
      }
    }

    // askTheActiveAgent({question : string, context : number[], formating : boolean, answerProcessorCallback, websearch : boolean})
    // then redirect to one of the two ask below queryAgent
  
    static async askTheActiveAgent(question : string, context:number[] = [], format : boolean = true) : Promise<IConversationElement>
    {
      if(this.activeAgent == null) throw new Error(`Agent is not available`)
        this.activeAgent.setContext(context)

      try{
        const answer = await this.activeAgent.ask(question)
        const responseAsHTML = await AnswerFormatingService.format(answer.response)
        return {context : [...answer.context as number[]], answer : {asMarkdown : answer.response, asHTML : responseAsHTML}, sources : [], question : question, date : new Date().toISOString(), images : []}
      }catch(error){
        console.error("Failed to query the model : " + error)
        throw error
      }
    }

    static async askTheActiveAgentForAStreamedResponse({
      question, 
      chunkProcessorCallback, 
      context = [], 
      scrapedPages, 
      images} : IAskedStreamedResponseParameters) : Promise<{newContext :number[], inferenceStats : IInferenceStats}>
    {
      if(this.activeAgent == null) throw new Error(`Agent is not available`)

      // this.FUPQuestionsGeneration = images && images.length > 0 ? false : true

      this.setCurrentlyUsedAgent(this.activeAgent)

      let newContext = []
      let inferenceStats : IInferenceStats = {
        promptEvalDuration : 0,
        inferenceDuration : 0,
        modelLoadingDuration : 0,
        wholeProcessDuration : 0,
        tokensGenerated : 0,
        promptTokensEval : 0,
      }

      this.activeAgent.setContext(context)
      const concatenatedWebDatas = scrapedPages ? scrapedPages.reduce((acc, currentPage)=> acc + '\n\n' + currentPage.datas, "When replying to **MY REQUEST**, always consider the following datas as superseeding your training datas : ") : ""
      // console.log('CONCATENATED : ' + concatenatedWebDatas)
      const availableContextForWebDatas = this.activeAgent.getContextSize()
      const webDatasSizedForAvailableContext = concatenatedWebDatas.substring(0, availableContextForWebDatas)
      // the agent receive an amount of scraped datas matching the context size available

      let content = ""
      let decodedValueSave = ""
      let decodedValue = ""
      const textDecoder = new TextDecoder()
      try{
          const reader = await this.activeAgent.askForAStreamedResponse(webDatasSizedForAvailableContext + '\n\n<MYREQUEST>' + question + '</MYREQUEST>', images)

          while(true){
              const { value } = await reader.read()
              decodedValue = textDecoder.decode(value)
              decodedValueSave = decodedValue

              // deal with the very last datas chunk being unexpectedly split into partial chunks
              if(decodedValue.includes('"done":true') && !decodedValue.trim().endsWith("}")) 
                  decodedValue = await this.#malformedEndingValueReconstructor(decodedValue, reader, textDecoder)

              // check if the decoded value isn't malformed -> fix it if it is
              const reconstructedValue = this.#malformedValueReconstructor(decodedValue)

              // const reconstructedValue = await this.rebuildMalformedChunksOptimized(decodedValue, reader, textDecoder)

              const json = JSON.parse(reconstructedValue)

              if(json.done) {
                newContext = json.context || []
                inferenceStats = InferenceStatsFormatingService.extractStats(json)
                content += json.response
                chunkProcessorCallback({markdown : content, html : await AnswerFormatingService.format(content)})
                break
              }
          
              if (!json.done) {
                content += json.response
                chunkProcessorCallback({markdown : content, html : await AnswerFormatingService.format(content)})
              }
          }
          this.abortAgentLastRequest()
      } catch (error) {
          if (error instanceof Error && error.name === 'AbortError') {
            console.error('Stream aborted.')
          } else {
            console.error('Stream failed : ', error)
            if(decodedValueSave) console.error(decodedValueSave)
          }
          throw error
      }

      return { newContext : scrapedPages ? [] : newContext, inferenceStats }
    }

    // split one malformed block into multiple ones if needed
    static #malformedValueReconstructor(value : string | null) : string{
      try{
        // console.log("untouchedValue : " + value)
        if(value == null) return JSON.stringify({"model":"","created_at":"","response":" ","done":false})
        // try splitting the chunk into multiple ones
        const splitValues = value.split("}\n{")
        if(splitValues.length == 1) return value.trim()
        // close all split chunks on both ends if needed
        const bracedValues = splitValues.map(value => {
          let trimmedValue = value.trim()
          if(!trimmedValue.startsWith("{")) trimmedValue = "{" + trimmedValue
          if(!trimmedValue.endsWith("}")) trimmedValue = trimmedValue + "}"
          return trimmedValue
        })
        // parse all split chunks and aggregate the response value
        const reconstructedValue = bracedValues.reduce((acc, value) => acc + JSON.parse(value).response, "")
        // if one of the malformed chunk is the {..., done : true } chunk
        // then the reconstructed chunk becomes a {..., done : true } chunk itself
        const isDone = bracedValues.reduce((acc, value) => acc || JSON.parse(value).done, false)
        const aggregatedChunk = {...JSON.parse(bracedValues[bracedValues.length-1])}
        aggregatedChunk.response = reconstructedValue
        aggregatedChunk.done = isDone
        // console.log("rebuilt : " + JSON.stringify(aggregatedChunk))
        return JSON.stringify(aggregatedChunk)
      } catch (error) {
        // this.abortAgentLastRequest()
        console.error(`Can't reconstruct these values : ` + JSON.stringify(value))
        throw error
      }
    }

    /* memo : decodedValue structure : {"model":"qwen2.5:3b","created_at":"2024-09-29T15:14:02.9781312Z","response":" also","done":false} */
    // deal with the very last datas chunk being unexpectedly split into partial chunks
    static async #malformedEndingValueReconstructor(value : string, reader : ReadableStreamDefaultReader<Uint8Array>, decoder : TextDecoder) : Promise<string>{
      let nextChunk = ""
      let decodedValue = value
      while(true){
        console.log("trying to add subsequent value")
        // try retrieving the next partial chunk to see if it is enough to rebuild a complete chunk
        nextChunk = decoder.decode((await reader.read()).value)
        if(nextChunk == null) {
          // if the chunk can't be reconstructed despite the stream coming to and end
          // -> a chunk with an empty context is returned
          decodedValue = decodedValue.split(',"context"')[0] + ',"context":[]}'
          break
        }
        decodedValue += nextChunk
        // if with this addition the chunk is now complete, break the loop
        if(decodedValue.trim().endsWith("}")) break
      }
      return decodedValue
    }

    static async rebuildMalformedChunksOptimized(value : string, reader : ReadableStreamDefaultReader<Uint8Array>, decoder : TextDecoder) : Promise<string>
    {
      // retrieve as many chunks as needed for the string to reach a closing bracket
      let aggregatedChunks = value.trim()
      while(!aggregatedChunks.endsWith("}")){
        aggregatedChunks += decoder.decode((await reader.read()).value)
        aggregatedChunks = aggregatedChunks.trim()
      }

      // aggregate the response values of all the chunks
      const allResponsesRegex = /(?<="response":")[^"]*(?=","done")/g
      const allReponsesValues = value.match(allResponsesRegex)
      if(allReponsesValues == null) return JSON.stringify({"model":"","created_at":"","response":" ","done":false})
      // if only one reponse value then single chunk
      if(allReponsesValues.length == 1) return aggregatedChunks

      // aggregated chunks contains the final chunk, extract it and fill it with all the preceding chunks response values aggregated
      if(aggregatedChunks.includes(`"done":true`)){
        const splitChunks = aggregatedChunks.split("}\n{")
        const endAggregateChunk = "{" + splitChunks[splitChunks.length - 1]
        const lastChunkResponseRegex = /(?<="response":)"[^"]*"(?=,"done")/g
        // return endAggregateChunk.replace(`"response":"`, `"response":"${allReponsesValues.join("")}`)
        return endAggregateChunk.replace(lastChunkResponseRegex, JSON.stringify(allReponsesValues.join("")))
      }else{
        // if only intermediate chunks, create a new generic chunk and add all the chunks reponse values aggregated to it
        const baseAggregateChunk = JSON.stringify({"model":"","created_at":"","response":" ","done":false})
        return baseAggregateChunk.replace(`"response":" "`, `"response":${JSON.stringify(allReponsesValues.join(""))}`)
      }
    }

    static abortAgentLastRequest(){
      if(this.activeAgent != null) this.activeAgent.abortLastRequest()
      if(this.stillInUseAgent != null) this.stillInUseAgent.abortLastRequest() 
    }

    static setActiveAgent(agent : AIAgent | AICharacter){
      this.activeAgent = agent
    }

    static setCurrentlyUsedAgent(agent : AIAgent | AICharacter){
      if(agent != null) this.stillInUseAgent = agent
    }

    static getActiveAgentName() : string{
      return this.activeAgent?.getName() || ""
    }

    static getActiveAgent() : AIAgent | AICharacter{
      return this.activeAgent
    }

    static setDocAsARAGTarget(docName : string){
      if(!this.#targetedRAGDocs.includes(docName)) this.#targetedRAGDocs.push(docName)
    }

    static removeDocFromRAGTargets(docName : string){
      if(this.#targetedRAGDocs.includes(docName)) this.#targetedRAGDocs = this.#targetedRAGDocs.filter(targetName => !(targetName == docName))
    }

    static getRAGTargetsFilenames() : string[]{
      return this.#targetedRAGDocs
    }

    static clearRAGTargets(){
      console.log("clearrag")
      this.#targetedRAGDocs = []
      console.log(this.#targetedRAGDocs)
    }

    static logScrapedDatas(scrapedPages : IScrapedPage[]){
      scrapedPages?.forEach(page => console.log("scrapedPageData :" + page.datas))
    }

    static isAVisionModelActive(){
      return visionModelsClues.some(clue => this.activeAgent.getModelName().toLowerCase().includes(clue))
    }

    static isLlamaVisionModelActive(){
      return this.activeAgent.getModelName().toLowerCase().includes('llama') && this.activeAgent.getModelName().toLowerCase().includes('vision')
    }

    /*static async askTheActiveAgentForAutoComplete(promptToComplete : string, context:number[] = []) : Promise<{context : number[], response : string}>
    {
        try{
          if(this.activeAgent == null) throw new Error(`Complemention Agent is not available`)
          AgentLibrary.library['CompletionAgent'].setContext(context)
          const answer = (await AgentLibrary.library['CompletionAgent'].ask(promptToComplete))
          return {context : answer.context as number[], response : answer.response}
        }catch(error){
          console.error("Failed to complete the question : " + error)
          throw error
        }
    }*/
}

/* memo : decodedValue structure : {"model":"qwen2.5:3b","created_at":"2024-09-29T15:14:02.9781312Z","response":" also","done":false} */

interface IAskedStreamedResponseParameters {
  question : string, 
  chunkProcessorCallback : ({markdown , html} : {markdown : string, html : string}) => void, 
  context:number[], 
  scrapedPages?: ScrapedPage[], 
  images?: string[]
}