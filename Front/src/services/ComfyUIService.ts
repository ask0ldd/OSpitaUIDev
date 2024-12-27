/* eslint-disable @typescript-eslint/no-unused-vars */
import { IComfyWorkflow } from "../interfaces/IComfyWorkflow";
import { ExecutedMessage, ExecutingMessage, ExecutionErrorMessage, ProgressMessage, TWSMessage } from "../interfaces/TWSMessageType";

/* eslint-disable no-unused-private-class-members */
class ComfyUIService {
    readonly #name : string
    #serverAddress = "127.0.0.1:8188"
    #ws : WebSocket

    constructor(){
        this.#name = this.generateUniqueName()
        this.#ws = new WebSocket('ws://127.0.0.1:8188/ws?clientId=' + this.#name)

        this.#ws.onmessage = (event) => {
          const message = JSON.parse(event.data);
          this.handleWSMessage(message);
        }
        
        this.#ws.onerror = (error) => {
          console.error('WebSocket error:', error);
        }
        
        this.#ws.onclose = () => {
          console.log('Disconnected from ComfyUI WebSocket');
        }
    }

    handleWSMessage(message: TWSMessage) {
      switch (message.type) {
        case 'execution_start':
          console.log('Workflow execution started')
          break
        case 'executing':
          console.log('Executing node:', (message as ExecutingMessage).data.node)
          break
        case 'progress':
          console.log('Progress:', Math.round((message as ProgressMessage).data.value / (message as ProgressMessage).data.max * 100), '%')
          break
        case 'executed':
          console.log('Node executed:', (message as ExecutedMessage).data.node)
          break
        case 'execution_cached':
          console.log('Execution cached')
          break
        case 'execution_error':
          console.error('Execution error:', (message as ExecutionErrorMessage).data.exception_message)
          break
        case 'execution_complete':
          console.log('Workflow execution completed')
          break
      }
    }

    WSSendWorkflow(workflow: IComfyWorkflow) {
      const message = {
        type: 'execute',
        data: {
          prompt: workflow,
          client_id: this.#name /*generateClientId()*/
        }
      }
      this.#ws.send(JSON.stringify(message))
    }
    

    /*async fetchGeneratedImage(filename: string): Promise<Blob> {
      const response = await fetch(`http://localhost:8188/view?filename=${filename}`);
      if (!response.ok) {
        throw new Error('Failed to fetch image');
      }
      return await response.blob();
    }*/

    generateUniqueName(): string {
        const timestamp = Date.now().toString(36);
        const randomPart = Math.random().toString(36).substr(2);
        return `${timestamp}${randomPart}`;
    }

    async queuePrompt(workflow : IComfyWorkflow){
        // const socket = new WebSocket(`ws://http://${this.#serverAddress}/ws?clientId=${this.#name}`)
        /*const body = {
            prompt : {
                ...ComfyUIBaseWorkflow,
                "6" : {
                    ...ComfyUIBaseWorkflow[6],
                    inputs : {
                        ...ComfyUIBaseWorkflow[6].inputs,
                        text : prompt
                    }
                }
            }
        }*/
        const body = {client_id : this.#name, prompt : {...workflow}}

        const response = await fetch(`http://${this.#serverAddress}/prompt`, {
            method : 'POST',
            body : JSON.stringify(body),
            headers:{ 
                'Content-Type' : 'application/json', 
            }
        })
        if(response.ok) console.log(await response.text())
    }

    async getHistory(maxItems?: number) : Promise<HistoryObject | void>{
        const response = await fetch(`http://${this.#serverAddress}/history` + (maxItems ? '?maxItems=' + maxItems : ''))
        if(response.ok) return await response.json()
    }

    async viewImage({ filename, subfolder, type } : { filename: string, subfolder: string, type: string }) : Promise<string | void>{
        try{
            const response = await fetch(`http://${this.#serverAddress}/view?` + encodeURI(new URLSearchParams({ filename, subfolder, type }).toString()))
            const imageBlob = await response.blob()
            return new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    resolve(reader.result);
                } else {
                    reject(new Error('Failed to convert image to base64'));
                }
                };
                reader.onerror = reject;
                reader.readAsDataURL(imageBlob);
            });
        }catch(error){
            console.error("Error fetching image : ", error)
            return void 0
        }
    }

    async getPrompt(promptId : string) {
        fetch(`http://${this.#serverAddress}/history?` + promptId)
    }
}

export default ComfyUIService

// a nice hotel room looking like a 3d render with a haussmanian touch and red walls

interface PromptInput {
    seed: number;
    steps: number;
    cfg: number;
    sampler_name: string;
    scheduler: string;
    denoise: number;
    model: [string, number];
    positive: [string, number];
    negative: [string, number];
    latent_image: [string, number];
  }
  
  interface NodeInput {
    [key: string]: unknown;
  }
  
  interface Node {
    inputs: NodeInput;
    class_type: string;
    _meta: {
      title: string;
    };
  }
  
  interface PromptData {
    [key: string]: Node;
  }
  
  interface OutputImage {
    filename: string;
    subfolder: string;
    type: string;
  }
  
  interface Output {
    images: OutputImage[];
  }
  
  interface StatusMessage {
    prompt_id: string;
    timestamp: number;
    nodes?: string[];
  }
  
  interface Status {
    status_str: string;
    completed: boolean;
    messages: [string, StatusMessage][];
  }
  
  interface Meta {
    [key: string]: {
      node_id: string;
      display_node: string;
      parent_node: string | null;
      real_node_id: string;
    };
  }
  
  interface PromptEntry {
    prompt: [number, string, PromptData, object, string[]];
    outputs: {
      [key: string]: Output;
    };
    status: Status;
    meta: Meta;
  }
  
  interface HistoryObject {
    [key: string]: PromptEntry;
  }