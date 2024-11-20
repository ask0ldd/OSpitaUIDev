/* eslint-disable @typescript-eslint/no-unused-vars */
import { ICompletionResponse } from "../interfaces/responses/ICompletionResponse";
import AgentService from "../services/API/AgentService";
import { AIAgent } from "./AIAgent";
import { Observer } from "./Observer";

export class ProgressTracker implements Observer {
    private results : ICompletionResponse[] = []
  
    update(response : ICompletionResponse): void {
      this.results.push(response)
      console.log("progressTrackerState : " + response.response)
    }

    reset(){
        this.results = []
    }
}

// chain of responsability design pattern
export default class AIAgentChain{

    private static agents: AIAgent[] = []

    static progressTracker = new ProgressTracker()

    /*static deleteAgent(index  : number){
        this.agents = [...this.agents.slice(0, index), ...this.agents.slice(index + 1)]
    }*/

    static updateAgentsList(agents : AIAgent[]){
        this.agents = agents;
    }

    static async refreshAgents(){
        const retrievedAgentsList = await new AgentService().getAll()
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

    static async process(query : string) : Promise<ICompletionResponse | undefined>{
        try{
            this.progressTracker.reset()
            console.log("starting chain process")
            const firstAgent = this.buildAgentsLinks(this.progressTracker)
            if(firstAgent == null) throw new Error("no agents available")
            return firstAgent.update(query)
        }catch(error){
            console.error(error)
            throw error
        }
    }

    // build the relationship between the agents part of the same chain
    static buildAgentsLinks(progressTracker ?: ProgressTracker) : AIAgent | undefined{
        if(this.agents.length == 0) return undefined
        this.agents.forEach((agent, index)=>{
            if (index < this.agents.length -1){
                agent.addObserver(this.agents[index + 1])
                // add a progress tracker registering each step result
                if(progressTracker != null) agent.addObserver(this.progressTracker)
            }  
        })
        return this.agents[0]
    }

    static abortProcess() : void {
        this.agents.forEach(agent => agent.abortLastRequest())
    }
}