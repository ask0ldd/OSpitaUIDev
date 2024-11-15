/* eslint-disable @typescript-eslint/no-unused-vars */
import { ICompletionResponse } from "../interfaces/responses/ICompletionResponse";
import AgentService from "../services/API/AgentService";
import { AIAgent } from "./AIAgent";

// chain of responsability design pattern
export default class AIAgentChain{

    private static agents: AIAgent[] = [];

    /*static deleteAgent(index  : number){
        this.agents = [...this.agents.slice(0, index), ...this.agents.slice(index + 1)]
    }*/

    static updateAgentsList(agents : AIAgent[]){
        this.agents = agents;
    }

    static async refreshAgents(){
        const retrievedAgentsList = await AgentService.getAll()
        if(retrievedAgentsList == null) return this.agents = []
        const newAgents = this.agents.map(agent => {
            let updatedAgentJSON = retrievedAgentsList.find(retrievedAgent => retrievedAgent.name == agent.getName())
            if(updatedAgentJSON == null) updatedAgentJSON = retrievedAgentsList[0]
            return new AIAgent({...updatedAgentJSON, modelName : updatedAgentJSON.model})
        })
        this.agents = [...newAgents.filter(agent => agent != null)]
    }

    static getAgentsList() : AIAgent[]{
        return this.agents;
    }

    static getLastAgent() : AIAgent{
        return this.agents[this.agents.length - 1]
    }

    static empty(){
        this.agents = []
    }

    static isEmpty(){
        return this.agents.length === 0
    }

    static async process(query : string) : Promise<ICompletionResponse>{
        try{
            console.log("starting chain process")
            this.buildLinks()
            const result = await this.agents[0].update(query)
            // console.log(result)
            return result
        }catch(error){
            console.error(error)
            throw error
        }
    }

    static buildLinks(){
        if(this.agents.length == 0) return
        this.agents.forEach((agent, index)=>{
            if (index < this.agents.length -1){
                agent.addObserver(this.agents[index + 1])
            }  
        })
    }

    static abortProcess() : void {
        this.agents.forEach(agent => agent.abortLastRequest())
    }
}