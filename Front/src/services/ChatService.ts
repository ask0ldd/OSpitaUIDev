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

/**
 * Service for managing chat interactions with AI agents and characters.
 * Handles question answering, follow-up generation, streaming responses, and RAG document targeting.
 */
export class ChatService{

    private readonly answerFormatingService : AnswerFormatingService
    private readonly inferenceStatsFormatingService :InferenceStatsFormatingService

    constructor(
      answerFormatingService : AnswerFormatingService, 
      inferenceStatsFormatingService : InferenceStatsFormatingService,
    ){
      this.answerFormatingService = answerFormatingService
      this.inferenceStatsFormatingService = inferenceStatsFormatingService
    }

    #targetedRAGDocs : string[] = []

    activeAgent : AIAgent | AICharacter = new AIAgent({id : 'a0000000001',
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

    stillInUseAgent = this.activeAgent

    // static FUPQuestionsGeneration = true

    /**
     * Asks the active agent for follow-up questions.
     * @param {string} question - The question to ask.
     * @param {number[]} [context=[]] - Optional context tokens.
     * @returns {Promise<string>} The follow-up questions as a string.
     * @throws {Error} If the agent is not available or the query fails.
     */
    async askForFollowUpQuestions(question : string, context:number[] = []) : Promise<string>
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
  
    /**
   * Asks the active agent a question and returns a formatted response.
   * @param {string} question - The user's question.
   * @param {number[]} [context=[]] - Optional context tokens.
   * @param {boolean} [format=true] - Whether to format the answer.
   * @returns {Promise<IConversationElement>} The conversation element containing the answer.
   * @throws {Error} If the agent is not available or the query fails.
   */
    async askTheActiveAgent(question : string, context:number[] = [], format : boolean = true) : Promise<IConversationElement>
    {
      if(this.activeAgent == null) throw new Error(`Agent is not available`)
        this.activeAgent.setContext(context)

      try{
        const answer = await this.activeAgent.ask(question)
        const responseAsHTML = await this.answerFormatingService.format(answer.response)
        return {context : [...answer.context as number[]], answer : {asMarkdown : answer.response, asHTML : responseAsHTML}, sources : [], question : question, date : new Date().toISOString(), images : []}
      }catch(error){
        console.error("Failed to query the model : " + error)
        throw error
      }
    }

    /**
     * Asks the active agent for a streamed response.
     * @param {IAskedStreamedResponseParameters} params - Parameters for the streamed response.
     * @returns {Promise<{newContext: number[], inferenceStats: IInferenceStats}>} The new context and inference stats.
     * @throws {Error} If the agent is not available or the stream fails.
     */
    async askTheActiveAgentForAStreamedResponse({
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
        const availableContextForWebDatas = this.activeAgent.getContextSize()
        const webDatasSizedForAvailableContext = concatenatedWebDatas.substring(0, availableContextForWebDatas)
        // the agent receive an amount of scraped datas matching the context size available

        let content = ""
        try{
            const reader = await this.activeAgent.askForAStreamedResponse(webDatasSizedForAvailableContext + '\n\n<MYREQUEST>' + question + '</MYREQUEST>', images)

            while(true){
                const { value } = await reader.read()
                if(!value) break
                const json = JSON.parse(value)

                if(json.done) {
                    newContext = json.context || []
                    inferenceStats = this.inferenceStatsFormatingService.extractStats(json)
                    content += json.response
                    chunkProcessorCallback({markdown : content, html : await this.answerFormatingService.format(content)})
                    break
                }
            
                if (!json.done) {
                    content += json.response
                    chunkProcessorCallback({markdown : content, html : await this.answerFormatingService.format(content)})
                }
            }
            this.abortAgentLastRequest()
        } catch (error) {
            if (error instanceof Error && error.name === 'AbortError') {
                console.error('Stream aborted.')
            } else {
                console.error('Stream failed : ', error)
                // if(decodedValueSave) console.error(decodedValueSave)
            }
            throw error
        }

        return { newContext : scrapedPages ? [] : newContext, inferenceStats }
    }

    /*static async rebuildMalformedChunksOptimized(value : string, reader : ReadableStreamDefaultReader<Uint8Array>, decoder : TextDecoder) : Promise<string>
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
    }*/

    /**
     * Aborts the last request made by the agent.
     * @returns {void}
     */
    abortAgentLastRequest() : void{
      if(this.activeAgent != null) this.activeAgent.abortLastRequest()
      if(this.stillInUseAgent != null) this.stillInUseAgent.abortLastRequest() 
    }

    /**
     * Sets the active agent.
     * @param {AIAgent | AICharacter} agent - The agent to set as active.
     * @returns {void}
     */
    setActiveAgent(agent : AIAgent | AICharacter):void{
      this.activeAgent = agent
    }

    /**
     * Sets the currently used agent (for tracking).
     * @param {AIAgent | AICharacter} agent - The agent to mark as currently used.
     * @returns {void}
     */
    setCurrentlyUsedAgent(agent : AIAgent | AICharacter): void{
      if(agent != null) this.stillInUseAgent = agent
    }

    /**
     * Gets the name of the active agent.
     * @returns {string} The active agent's name.
     */
    getActiveAgentName() : string{
      return this.activeAgent?.getName() || ""
    }

    /**
     * Gets the active agent instance.
     * @returns {AIAgent | AICharacter} The active agent.
     */
    getActiveAgent() : AIAgent | AICharacter{
      return this.activeAgent
    }

    /**
     * Adds a document as a RAG (Retrieval-Augmented Generation) target.
     * @param {string} docName - The document name to add.
     * @returns {void}
     */
    setDocAsARAGTarget(docName : string): void{
      if(!this.#targetedRAGDocs.includes(docName)) this.#targetedRAGDocs.push(docName)
    }

    /**
     * Removes a document from RAG targets.
     * @param {string} docName - The document name to remove.
     * @returns {void}
     */
    removeDocFromRAGTargets(docName : string): void{
      if(this.#targetedRAGDocs.includes(docName)) this.#targetedRAGDocs = this.#targetedRAGDocs.filter(targetName => !(targetName == docName))
    }

    /**
     * Gets filenames of all RAG target documents.
     * @returns {string[]} The list of RAG target document filenames.
     */
    getRAGTargetsFilenames() : string[]{
      return this.#targetedRAGDocs
    }

    /**
     * Clears all RAG target documents.
     * @returns {void}
     */
    clearRAGTargets(): void{
      console.log("clearrag")
      this.#targetedRAGDocs = []
      console.log(this.#targetedRAGDocs)
    }

    /**
     * Logs the data from scraped pages.
     * @param {IScrapedPage[]} scrapedPages - The scraped pages to log.
     * @returns {void}
     */
    logScrapedDatas(scrapedPages : IScrapedPage[]): void{
      scrapedPages?.forEach(page => console.log("scrapedPageData :" + page.datas))
    }

    /**
     * Checks if the active agent is a vision model.
     * @returns {boolean} True if a vision model is active; otherwise, false.
     */
    isAVisionModelActive(): boolean{
      return visionModelsClues.some(clue => this.activeAgent.getModelName().toLowerCase().includes(clue))
    }

    /**
     * Checks if the active agent is a Llama vision model.
     * @returns {boolean} True if a Llama vision model is active; otherwise, false.
     */
    isLlamaVisionModelActive(): boolean{
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