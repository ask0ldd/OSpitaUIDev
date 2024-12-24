/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef } from "react"
import AINodesChain from "../../models/nodes/AINodesChain"
import { AIAgentNew } from "../../models/nodes/AIAgentNew"
import DocProcessorService from "../../services/DocProcessorService"

function SettingsPanel(){

    const firstLoad = useRef(true)

    useEffect(() => {
        if(firstLoad.current == false) return

        async function effect(){
            const agentWriter = new AIAgentNew({name : "agentWriter", modelName : 'llama3.2:3b', systemPrompt : 'write a 50 lines short story with this theme : '})
            const agentSummarizer = new AIAgentNew({name : "agentSummarizer", modelName : 'llama3.2:3b', systemPrompt : 'summarize the following story in 5 lines : '})
            agentWriter.addObserver(agentSummarizer)
            const agentsChain = new AINodesChain({startNode : agentWriter, endNode : agentSummarizer})
            const result = agentsChain.process("heroic fantasy")

            const text = `Allow miles wound place the leave had. To sitting subject no improve studied limited. Ye indulgence unreserved connection alteration appearance my an astonished. Up as seen sent make he they of. Her raising and himself pasture believe females. Fancy she stuff after aware merit small his. Charmed esteems luckily age out.`
            const sentences = DocProcessorService.sentencesSplitter(text)
            const embedSentences = []
            for(const sentence of sentences){
                const embedSentence = await DocProcessorService.getEmbeddingsForChunk(sentence)
                embedSentences.push(embedSentence)
            }
            const groupedSentences = sentences.reduce((acc : string[], sentence) => {
                acc.push(sentence)
                return acc
            }, [])
            console.log(JSON.stringify(groupedSentences))
        }

        effect()

        firstLoad.current = false
    }, [])

    return(
        <article className='comingSoonContainer'>
            <span className='comingSoon' style={{textAlign:'center', width:'100%'}}>
                Coming Soon
            </span>
        </article>
    )
}

export default SettingsPanel

/*const startingRequest = `name of random langage of programmation. strict rule : provide only the name.`
// initiate the agents line
const agentLine = new AIAgentsLine([
    new AIAgent({name : "agentLg1", modelName : 'llama3.2:3b'}),
    new AIAgent({name : "agentLg2", modelName : 'llama3.2:3b'}),
    new AIAgent({name : "agentLg3", modelName : 'llama3.2:3b'}),
    new AIAgent({name : "agentLg4", modelName : 'llama3.2:3b'}),
])
const agentRank = new AIAgent({name : "agentRank", modelName : 'llama3.2:3b'})
const agentLove = new AIAgent({name : "agentLove", modelName : 'llama3.2:3b'})
// add the next agent as a line observer
agentLine.addObserver(agentRank)
// define the action of the agent once the line has produced a result
agentRank.onUpdate(async function (this : AIAgent, state) {
    console.log(JSON.stringify(state))
    const response = await this.ask("only reply to the question. which langage listed here is prefered by the average user : " + state)
    return response.response
})
agentRank.addObserver(agentLove)
agentLove.onUpdate(async function (this : AIAgent, state) {
    console.log(JSON.stringify(state))
    const response = await this.ask("say that you love this langage : " + state)
    console.log(response.response)
})
// ask the line to act
agentLine.update(startingRequest) // executing the whole line*/