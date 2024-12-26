import { ComfyUIBaseWorkflow } from "../constants/ComfyUIBaseWorkflow";

/* eslint-disable no-unused-private-class-members */
class ComfyUIService {
    readonly #name : string
    #serverAddress = "127.0.0.1:8188"

    constructor(){
        this.#name = this.generateUniqueName()
    }

    generateUniqueName(): string {
        const timestamp = Date.now().toString(36);
        const randomPart = Math.random().toString(36).substr(2);
        return `${timestamp}${randomPart}`;
    }

    async queuePrompt(){
        // const socket = new WebSocket(`ws://http://${this.#serverAddress}/ws?clientId=${this.#name}`)
        const body = {
            prompt : ComfyUIBaseWorkflow
        }
        const response = await fetch(`http://${this.#serverAddress}/prompt`, {
            method : 'POST',
            body : JSON.stringify(body),
            headers:{ 
                'Content-Type' : 'application/json', 
            }
        })
        if(response.ok) console.log(await response.text())
    }
}

export default ComfyUIService

// a nice hotel room looking like a 3d render with a haussmanian touch and red walls