/* eslint-disable @typescript-eslint/no-unused-vars */
import { ICompletionResponse } from "../interfaces/responses/ICompletionResponse";
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
        console.log("starting chain process")
        this.buildLinks()
        const result = await this.agents[0].update(query)
        // console.log(result)
        return result
    }

    static buildLinks(){
        if(this.agents.length == 0) return
        this.agents.forEach((agent, index)=>{
            if (index < this.agents.length -1){
                agent.addObserver(this.agents[index + 1])
            }  
        })
    }
}