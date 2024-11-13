/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-private-class-members */
import { IAIModelParams } from "../interfaces/params/IAIModelParams.js"
import { ICompletionResponse } from "../interfaces/responses/ICompletionResponse.js"
import { AIModel } from "./AIModel.js"

export class AIAgent extends AIModel {

    #id : string
    #name : string
    #type : 'system' | 'user_created'
    #favorite : boolean
    #webSearchEconomy: boolean = false
    #observers : AIAgent[] = []

    constructor({
        id,
        name, 
        modelName = "llama3.1:8b", 
        systemPrompt = "You are an helpful assistant.", 
        temperature = 0.8, 
        mirostat = 0, 
        mirostat_eta = 0.1, 
        mirostat_tau = 5.0, 
        num_ctx = 2048,
        context = [],
        repeat_last_n = 64, 
        repeat_penalty = 1.1, 
        seed = 0,
        stop = "AI assistant:", 
        tfs_z = 1, 
        num_predict = 1024,
        top_k = 40,
        top_p = 0.9,
        type = "user_created",
        favorite = false,
        webSearchEconomy = false,
    } : IAIModelParams & { id : string, name : string, type : "system" | "user_created", favorite : boolean, webSearchEconomy? : boolean })
    {
        super({
            modelName, 
            systemPrompt, 
            temperature,
            mirostat,
            mirostat_eta,
            mirostat_tau,
            context,
            num_ctx,
            repeat_last_n,
            repeat_penalty,
            seed,
            stop,
            tfs_z,
            num_predict,
            top_k,
            top_p,
        })
        this.#id = id
        this.#name = name
        this.#type = type
        this.#favorite = favorite
        this.#webSearchEconomy = webSearchEconomy
        return this
    }

    getId() : string {
        return this.#id
    }

    setName(name : string) : AIAgent {
        this.#name = name
        return this
    }

    getName() : string{
        return this.#name
    }

    getWebSearchEconomy() : boolean {
        return this.#webSearchEconomy
    }

    setWebSearchEconomy(webSearchEconomy: boolean) {
        this.#webSearchEconomy = webSearchEconomy
        return this
    }

    getType() : 'system' | 'user_created' {
        return this.#type
    }

    setType(type : string) {
        if(type!== 'system' && type!=='user_created') throw new Error('invalid type')
        this.#type = type
    }

    getFavorite() : boolean {
        return this.#favorite
    }

    setFavorite(favorite : boolean){
        this.#favorite = favorite
    }

    asString(){
        return JSON.stringify(
            {
                id : this.getId(),
                name : this.#name,
                model: this.getModelName(),
                modelName: this.getModelName(),
                systemPrompt: this.getSystemPrompt(),
                num_ctx: this.getContextSize(),
                temperature: this.getTemperature(),
                num_predict: this.getNumPredict(),
                mirostat: this.getMirostat(),
                mirostat_eta: this.getMirostatEta(),
                mirostat_tau: this.getMirostatTau(),
                repeat_last_n: this.getRepeatLastN(),
                repeat_penalty: this.getRepeatPenalty(),
                seed: this.getSeed(),
                stop: this.getStop(),
                tfs_z: this.getTfsZ(),
                top_k: this.getTopK(),
                top_p: this.getTopP(),
                type: this.getType(),
                favorite: this.getFavorite()
            }
        )
    }
    
    clone() : AIAgent{
        return new AIAgent({
            id : this.getId(),
            name : this.#name,
            modelName: this.getModelName(),
            systemPrompt: this.getSystemPrompt(),
            num_ctx: this.getContextSize(),
            temperature: this.getTemperature(),
            num_predict: this.getNumPredict(),
            mirostat: this.getMirostat(),
            mirostat_eta: this.getMirostatEta(),
            mirostat_tau: this.getMirostatTau(),
            repeat_last_n: this.getRepeatLastN(),
            repeat_penalty: this.getRepeatPenalty(),
            seed: this.getSeed(),
            stop: this.getStop(),
            tfs_z: this.getTfsZ(),
            top_k: this.getTopK(),
            top_p: this.getTopP(),
            type: this.getType(),
            favorite: this.getFavorite()
        })
    }

    // Observer methods
    async update(data : string) : Promise<ICompletionResponse> {
        const response = await this.ask(data)
        console.log(response.response)
        // if there is no observer listening to this agent
        if(this.#observers.length == 0) return response
        // if there is an observer
        return this.#observers[0].update(response.response)
    }

    addObserver(observer : AIAgent ) {
        this.#observers.push(observer);
    }

    notifyObservers(data : string) {
        this.#observers.forEach(observer => observer.update(data));
    }
}

// should be able to link a control agent

export interface IAIAgentParams{
    name : string
    model : AIModel
}

/*
Agent Attributes
Attribute	Description
Role	Defines the agent's function within the crew. It determines the kind of tasks the agent is best suited for.
Goal	The individual objective that the agent aims to achieve. It guides the agent's decision-making process.
Backstory	Provides context to the agent's role and goal, enriching the interaction and collaboration dynamics.
LLM (optional)	Represents the language model that will run the agent. It dynamically fetches the model name from the OPENAI_MODEL_NAME environment variable, defaulting to "gpt-4" if not specified.
Tools (optional)	Set of capabilities or functions that the agent can use to perform tasks. Expected to be instances of custom classes compatible with the agent's execution environment. Tools are initialized with a default value of an empty list.
Function Calling LLM (optional)	Specifies the language model that will handle the tool calling for this agent, overriding the crew function calling LLM if passed. Default is None.
Max Iter (optional)	The maximum number of iterations the agent can perform before being forced to give its best answer. Default is 25.
Max RPM (optional)	The maximum number of requests per minute the agent can perform to avoid rate limits. It's optional and can be left unspecified, with a default value of None.
max_execution_time (optional)	Maximum execution time for an agent to execute a task It's optional and can be left unspecified, with a default value of None, menaning no max execution time
Verbose (optional)	Setting this to True configures the internal logger to provide detailed execution logs, aiding in debugging and monitoring. Default is False.
Allow Delegation (optional)	Agents can delegate tasks or questions to one another, ensuring that each task is handled by the most suitable agent. Default is True.
Step Callback (optional)	A function that is called after each step of the agent. This can be used to log the agent's actions or to perform other operations. It will overwrite the crew step_callback.
Cache (optional)	Indicates if the agent should use a cache for tool usage. Default is True.
*/