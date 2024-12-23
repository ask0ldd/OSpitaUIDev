/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef } from "react"
import { AIAgent } from "../../models/AIAgent"
import AIAgentsLine from "../../models/AIAgentsLine"

function SettingsPanel(){

    const firstLoad = useRef(true)

    useEffect(() => {
        if(firstLoad.current == false) return
        const startingRequest = `name of random langage of programmation. strict rule : provide only the name.`
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
        agentLine.update(startingRequest) // executing the whole line
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