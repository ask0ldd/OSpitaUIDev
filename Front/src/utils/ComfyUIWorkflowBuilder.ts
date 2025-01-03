/* eslint-disable no-unused-private-class-members */
import { ComfyUIBaseWorkflow } from "../constants/ComfyUIBaseWorkflow"
import { IComfyWorkflow } from "../interfaces/IComfyWorkflow"

class ComfyUIWorkflowBuilder {
    #workflow : IComfyWorkflow
    constructor(){
        this.#workflow = {...ComfyUIBaseWorkflow}
        this.setRandomSeed()
        return this
    }

    setPrompt(prompt : string){
        const workflowCopy = {...this.#workflow}
        workflowCopy[6].inputs.text = prompt
        this.#workflow = {...workflowCopy}
        return this
    }

    setResolution(width : number, height : number){
        const latentImageNode = this.findLatentImageNode()
        if(latentImageNode == null) return this
        const workflowCopy = {...this.#workflow}
        workflowCopy[latentImageNode].inputs.width = width
        workflowCopy[latentImageNode].inputs.height = height
        this.#workflow = {...workflowCopy}
        return this
    }

    setNegativeKeywords(keywordsList : string){
        const workflowCopy = {...this.#workflow}
        workflowCopy[7].inputs.text = keywordsList
        this.#workflow = {...workflowCopy}
        return this
    }

    #generateRandom32BitValue(): number {
        const randomValues = new Uint32Array(1)
        crypto.getRandomValues(randomValues)
        return randomValues[0]
    }

    setRandomSeed(){
        const workflowCopy = {...this.#workflow}
        workflowCopy[3].inputs.seed = this.#generateRandom32BitValue()
        this.#workflow = {...workflowCopy}
        return this
    }

    setSeed(seed : number){
        const workflowCopy = {...this.#workflow}
        workflowCopy[3].inputs.seed = seed
        this.#workflow = {...workflowCopy}
        return this
    }

    setBatchSize(size : number){
        const latentImageNode = this.findLatentImageNodeKey()
        if(latentImageNode == null) return this
        const workflowCopy = {...this.#workflow}
        workflowCopy[latentImageNode].inputs.batch_size = size
        this.#workflow = {...workflowCopy}
        return this
    }

    build(){
        return this.#workflow
    }

    findLatentImageNodeKey() : string | undefined {
        for(const nodeKey in this.#workflow){
            if(typeof this.#workflow[nodeKey] === 'object' && this.#workflow[nodeKey].inputs.batch_size != null) {
                console.log(nodeKey)
                return nodeKey
            }
        }
        console.log("failed to find latent image node")
        return undefined
    }

    findCheckpointNodeKey() : string | undefined {
        for(const nodeKey in this.#workflow){
            if(typeof this.#workflow[nodeKey] === 'object' && this.#workflow[nodeKey].inputs.ckpt_name != null) {
                console.log(nodeKey)
                return nodeKey
            }
        }
        console.log("failed to find checkpoint node")
        return undefined
    }
}

export default ComfyUIWorkflowBuilder