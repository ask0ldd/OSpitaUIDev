import { AIModel, IBaseOllamaRequest } from "./AIModel"

export class AIVisionModel extends AIModel {
    async askImagesForAStreamedResponse(prompt : string, images : string[]) : Promise<ReadableStreamDefaultReader<Uint8Array>>{
        try {
            const response = await fetch("/ollama/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: this.#buildVisionRequest({prompt, images, stream : true}),
                signal: this.getSignal(),
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
}

interface IBaseVisionOllamaRequest extends IBaseOllamaRequest {
    images: string[]
}