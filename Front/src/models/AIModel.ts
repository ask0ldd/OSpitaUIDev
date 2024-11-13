/* eslint-disable no-unused-private-class-members */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ICompletionResponse } from "../interfaces/responses/ICompletionResponse"
import { IEmbeddingResponse } from "../interfaces/responses/IEmbeddingResponse"
import { IAIModelParams } from "../interfaces/params/IAIModelParams"

/**
 * @class AIModel
 * @description A class representing an AI model for generating text and embeddings.
 * @property {string} #modelName - The name of the AI model.
 * @property {boolean} #stream - Whether to stream the response or not.
 * @property {string} #systemPrompt - The system prompt for the AI model.
 * @property {number[]} #context - The context for the AI model.
 * @property {number} #contextSize - The size of the context for the AI model.
 */
export class AIModel{

    #modelName : string
    #systemPrompt : string
    #context : number[]
    #num_ctx : number
    #temperature : number
    #num_predict : number
    #abortController = new AbortController()
    #signal = this.#abortController.signal
    #mirostat : number
    #mirostat_eta : number
    #mirostat_tau : number
    #repeat_last_n : number
    #repeat_penalty : number
    #seed : number
    #stop : string
    #tfs_z : number
    #top_k : number
    #top_p : number
    #status : "standard" | "base" | "favorite"
    
    // add keep alive!!!!!
    // add format : json

    constructor({ 
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
        status = "standard",
    } : IAIModelParams){
        this.#modelName = modelName
        this.#systemPrompt = systemPrompt
        this.#context = context
        this.#num_ctx = num_ctx
        this.#num_predict = num_predict
        this.#temperature = temperature
        this.#mirostat = mirostat
        this.#mirostat_eta = mirostat_eta
        this.#mirostat_tau = mirostat_tau
        this.#repeat_last_n = repeat_last_n
        this.#repeat_penalty = repeat_penalty
        this.#seed = seed
        this.#stop = stop
        this.#tfs_z = tfs_z
        this.#top_k = top_k
        this.#top_p = top_p
        this.#status = status
    }

    /**
     * @async
     * @function ask
     * @param {string} prompt - The prompt for the AI model.
     * @returns {Promise<ICompletionResponse>} The response from the AI model.
     * @description Sends a request to the AI model with the given prompt and returns the response.
     */
    async ask(prompt : string) : Promise<ICompletionResponse> {
        try {
            const response = await fetch("/ollama/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: this.#buildRequest({prompt, stream : false}),
                signal: this.#signal,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json()
            
        } catch (error) {
            if (error instanceof Error) {
                // in case of manual request abortion
                if (error.name === "AbortError") {
                    console.error(error.message)
                    throw error
                }
                this.abortLastRequest()
                console.error(error.message)
                throw error
            }
            this.abortLastRequest()
            console.error(error)
            throw error
        }
    }

    async askForAStreamedResponse(prompt : string, images : string[] = []) : Promise<ReadableStreamDefaultReader<Uint8Array>>{
        try {
            const response = await fetch("/ollama/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                // ? querying an image : no image
                body:  (images.length && this.#modelName.includes("vision")) ? this.#buildVisionRequest({prompt, stream : true, images}) : this.#buildRequest({prompt, stream : true}),
                signal: this.#signal,
                // keepalive: true
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const reader = response.body?.getReader()
            if (!reader) {
                throw new Error("Failed to read response body.")
            }
            return reader

        } catch (error) {
            if (error instanceof Error) {
                // in case of manual request abortion
                if (error.name === "AbortError") {
                    console.error(error.message)
                    throw error
                }
                this.abortLastRequest()
                console.error(error.message)
                throw error
            }
            this.abortLastRequest()
            console.error(error)
            throw error
        }
    }

    /**
     * @async
     * @function embeddings
     * @param {string} sequence - The sequence for which to generate embeddings.
     * @returns {Promise<IEmbeddingResponse>} The embeddings for the given sequence.
     * @description Sends a request to generate embeddings for the given sequence and returns the embeddings.
     */
    async askEmbeddingsFor(sequence : string) : Promise<IEmbeddingResponse> {
        try {
            const response = await fetch("/ollama/api/embeddings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: this.#buildEmbeddingRequest(sequence),
                // signal: this.#signal,
                // keepalive: true
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return response.json()

        } catch (error) {
            if (error instanceof Error) {
                if (error.name === 'AbortError') {
                    throw new Error("Request was aborted.");
                } else {
                    throw new Error(`Failed to create embeddings : ${error.message}`);
                }
            }
            throw new Error("An unknown error occurred.");
        }
    }

    async tokenize(sequence : string) : Promise<number[]> {
        try {
            const response = await fetch("/ollama/api/tokenize", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: this.#buildTokenizeRequest(sequence),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return (await response.json())?.tokens

        } catch (error) {
            if (error instanceof Error) {
                if (error.name === 'AbortError') {
                    throw new Error("Request was aborted.");
                } else {
                    throw new Error(`Failed to tokenize : ${error.message}`);
                }
            }
            throw new Error("An unknown error occurred.");
        }
    }

    /**
     * @function setSystemPrompt
     * @param {string} prompt - The new system prompt for the AI model.
     * @description Sets the system prompt for the AI model.
     */
    setSystemPrompt(prompt : string) : this {
        this.#systemPrompt = prompt
        return this
    }

    /**
     * @function setModel
     * @param {string} modelName - The new name of the AI model.
     * @description Sets the name of the AI model.
     */
    setModel(modelName : string) : this {
        this.#modelName = modelName
        return this
    }

    /**
     * @function setContextSize
     * @param {number} value - The new size of the context for the AI model.
     * @description Sets the size of the context for the AI model.
     */
    setContext(context : number[]) : this {
        this.#context = [...context]
        return this
    }

    /**
     * @function setContextSize
     * @param {number} value - The new size of the context for the AI model.
     * @description Sets the size of the context for the AI model.
     */
    setContextSize(value : number) : this {
        if(value < 0) value = 0
        this.#num_ctx = value
        return this
    }

    /**
     * @function setTemperature
     * @param {number} value - The new temperature for the AI model.
     * @description Sets the temperature for the AI model.
     */
    setTemperature(value : number) : this {
        if(value > 1) value = 1
        if(value < 0) value = 0
        this.#temperature = value
        return this
    }

    setNumPredict(value : number){
        this.#num_predict = value
        return this
    }

    setSettings({ modelName = "llama3.1:8b", systemPrompt =  'You are a helpful assistant.', context = [], num_ctx = 2048, temperature = 0.8, num_predict = 1024 } : IAIModelParams){
        this.#modelName = modelName
        this.#systemPrompt = systemPrompt
        this.#context = context
        this.#num_ctx = num_ctx
        this.#num_predict = num_predict
        this.#temperature = temperature
    }

    setNumCtx(value: number) {
        this.#num_ctx = value;
        return this;
    }
     
    setMirostat(value: number) {
        this.#mirostat = value;
        return this;
    }
    
    setMirostatEta(value: number) {
        this.#mirostat_eta = value;
        return this;
    }
    
    setMirostatTau(value: number) {
        this.#mirostat_tau = value;
        return this;
    }
    
    setRepeatLastN(value: number) {
        this.#repeat_last_n = value;
        return this;
    }
    
    setRepeatPenalty(value: number) {
        this.#repeat_penalty = value;
        return this;
    }
    
    setSeed(value: number) {
        this.#seed = value;
        return this;
    }
    
    setStop(value: "AI assistant:") {
        this.#stop = value;
        return this;
    }
    
    setTfsZ(value: number) {
        this.#tfs_z = value;
        return this;
    }
    
    setTopK(value: number) {
        this.#top_k = value;
        return this;
    }
    
    setTopP(value: number) {
        this.#top_p = value;
        return this;
    }
    
    setStatus(value: "standard" | "base" | "favorite") {
        this.#status = value;
        return this;
    }    

    /**
     * @private
     * @function #buildRequest
     * @param {string} prompt - The prompt for the AI model.
     * @returns {string} The request body for the AI model.
     * @description Builds the request body for the AI model with the given prompt and other parameters.
     */
    #buildRequest({prompt, stream} : {prompt : string, stream : boolean}) : string {
        const baseRequest : IBaseOllamaRequest = {
            "model": this.#modelName,
            "stream": stream,
            "system": this.#systemPrompt,
            "prompt": prompt,
            "context" : [...this.#context],
        }
        const requestWithOptions = {...baseRequest, 
            "options": { 
                "num_ctx": this.#num_ctx,
                "temperature" : this.#temperature, 
                "num_predict" : this.#num_predict 
        }}
        return JSON.stringify(requestWithOptions)
    }

    #buildVisionRequest({prompt, images, stream} : {prompt : string, images : string[], stream : boolean}) : string {
        const baseRequest : IBaseVisionOllamaRequest = {
            "model": this.getModelName(),
            "stream": stream,
            "system": this.getSystemPrompt(),
            "prompt": prompt,
            "context" : [...this.getContext()],
            "images" : images,
        }
        const requestWithOptions = {...baseRequest, 
            "options": { 
                "num_ctx": this.getContextSize(),
                "temperature" : this.getTemperature(), 
                "num_predict" : this.getNumPredict()
        }}
        return JSON.stringify(requestWithOptions)
    }

    /**
     * @private
     * @function #buildEmbeddingRequest
     * @param {any} sequence - The sequence for which to generate embeddings.
     * @returns {string} The request body for generating embeddings.
     * @description Builds the request body for generating embeddings for the given sequence.
     */
    #buildEmbeddingRequest (sequence : unknown) : string {
        return JSON.stringify({
            "model": /*"nomic-embed-text" "mxbai-embed-large"*/ this.#modelName,
            "prompt": sequence,
            /*"stream": false,*/
        })
    }

    #buildTokenizeRequest (sequence : unknown) : string {
        console.log(this.#modelName)
        return JSON.stringify({
            "model": /*"mxbai-embed-large"*/ /*"nomic-embed-text"*/ this.#modelName,
            "prompt": sequence,
            /*"stream": false,*/
        })
    }

    // !!! should instead pass the controller to the conversation?!!! so that model can be easily switched
    abortLastRequest(){
        if(this.#abortController) this.#abortController.abort("Signal aborted.")
        // need to create a new abort controller and a new signal
        // or subsequent request will be aborted from the get go
        this.generateNewAbortControllerAndSignal()
    }

    generateNewAbortControllerAndSignal(){
        this.#abortController = new AbortController()
        this.#signal = this.#abortController.signal
    }

    getSystemPrompt() : string{
        return this.#systemPrompt
    }

    getTemperature() : number {
        return this.#temperature
    }

    getContextSize() : number {
        return this.#num_ctx
    }

    getModelName() : string {
        return this.#modelName
    }

    getNumPredict() : number {
        return this.#num_predict
    }
    
    getMirostat(): number {
        return this.#mirostat;
    }
    
    getMirostatEta(): number {
        return this.#mirostat_eta;
    }
    
    getMirostatTau(): number {
        return this.#mirostat_tau;
    }
    
    getRepeatLastN(): number {
        return this.#repeat_last_n;
    }
    
    getRepeatPenalty(): number {
        return this.#repeat_penalty;
    }
    
    getSeed(): number {
        return this.#seed;
    }
    
    getStop(): string {
        return this.#stop;
    }
    
    getTfsZ(): number {
        return this.#tfs_z;
    }
    
    getTopK(): number {
        return this.#top_k;
    }
    
    getTopP(): number {
        return this.#top_p;
    }

    getContext() : number[]{
        return this.#context
    }
    
    getStatus(): "standard" | "base" | "favorite" {
        return this.#status;
    }    

    getSignal() : AbortSignal{
        return this.#signal;
    }

    asString(){
        return JSON.stringify({
            model: this.#modelName,
            systemPrompt: this.#systemPrompt,
            context: this.#context,
            num_ctx: this.#num_ctx,
            temperature: this.#temperature,
            num_predict: this.#num_predict,
            mirostat: this.#mirostat,
            mirostat_eta: this.#mirostat_eta,
            mirostat_tau: this.#mirostat_tau,
            repeat_last_n: this.#repeat_last_n,
            repeat_penalty: this.#repeat_penalty,
            seed: this.#seed,
            stop: this.#stop,
            tfs_z: this.#tfs_z,
            top_k: this.#top_k,
            top_p: this.#top_p,
            status: this.#status
        })
    }
}

export interface IBaseOllamaRequest{
    model: string
    stream: boolean
    system: string
    prompt: string
    context : number[]
    options? : unknown
}

interface IBaseVisionOllamaRequest extends IBaseOllamaRequest {
    images: string[]
}