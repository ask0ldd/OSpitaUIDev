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
        const positivePromptNodeKey = this.findPositivePromptNodeKey()
        if(positivePromptNodeKey == null) return this
        if(this.#workflow[positivePromptNodeKey].inputs.text == null) return this
        const workflowCopy = {...this.#workflow}
        workflowCopy[positivePromptNodeKey].inputs.text = prompt
        this.#workflow = {...workflowCopy}
        return this
    }

    setResolution(width : number, height : number){
        const latentImageNodeKey = this.findLatentImageNodeKey()
        if(latentImageNodeKey == null) return this
        if(this.#workflow[latentImageNodeKey].inputs.width == null || this.#workflow[latentImageNodeKey].inputs.height == null) return this
        const workflowCopy = {...this.#workflow}
        workflowCopy[latentImageNodeKey].inputs.width = width
        workflowCopy[latentImageNodeKey].inputs.height = height
        this.#workflow = {...workflowCopy}
        return this
    }

    setNegativeKeywords(keywordsList : string){
        const negativePromptNodeKey = this.findNegativePromptNodeKey()
        if(negativePromptNodeKey == null) return this
        if(this.#workflow[negativePromptNodeKey].inputs.text == null) return this
        const workflowCopy = {...this.#workflow}
        workflowCopy[negativePromptNodeKey].inputs.text = keywordsList
        this.#workflow = {...workflowCopy}
        return this
    }

    #generateRandom32BitValue(): number {
        const randomValues = new Uint32Array(1)
        crypto.getRandomValues(randomValues)
        return randomValues[0]
    }

    setRandomSeed(){
        const kSamplerNodeKey = this.findKSamplerNodeKey()
        if(kSamplerNodeKey == null) return this
        if(this.#workflow[kSamplerNodeKey].inputs.seed == null) return this
        const workflowCopy = {...this.#workflow}
        workflowCopy[kSamplerNodeKey].inputs.seed = this.#generateRandom32BitValue()
        this.#workflow = {...workflowCopy}
        return this
    }

    setSeed(seed : number){
        const kSamplerNodeKey = this.findKSamplerNodeKey()
        if(kSamplerNodeKey == null) return this
        if(this.#workflow[kSamplerNodeKey].inputs.seed == null) return this
        const workflowCopy = {...this.#workflow}
        workflowCopy[kSamplerNodeKey].inputs.seed = seed
        this.#workflow = {...workflowCopy}
        return this
    }

    setBatchSize(size : number){
        const latentImageNodeKey = this.findLatentImageNodeKey()
        if(latentImageNodeKey == null) return this
        const workflowCopy = {...this.#workflow}
        workflowCopy[latentImageNodeKey].inputs.batch_size = size
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

    findKSamplerNodeKey() : string | undefined {
        for(const nodeKey in this.#workflow){
            if(typeof this.#workflow[nodeKey] === 'object' && this.#workflow[nodeKey].inputs.seed != null) {
                console.log(nodeKey)
                return nodeKey
            }
        }
        console.log("failed to find ksampler node")
        return undefined
    }

    findPositivePromptNodeKey() : string | undefined {
        const KSamplerNodeKey = this.findKSamplerNodeKey()
        if(KSamplerNodeKey == null) return undefined
        if(this.#workflow[KSamplerNodeKey].inputs.positive && Array.isArray(this.#workflow[KSamplerNodeKey].inputs.positive)) return this.#workflow[KSamplerNodeKey].inputs.positive[0] as string
        return undefined
    }

    findNegativePromptNodeKey() : string | undefined {
        const KSamplerNodeKey = this.findKSamplerNodeKey()
        if(KSamplerNodeKey == null) return undefined
        if(this.#workflow[KSamplerNodeKey].inputs.negative && Array.isArray(this.#workflow[KSamplerNodeKey].inputs.negative)) return this.#workflow[KSamplerNodeKey].inputs.negative[0] as string
        return undefined
    }
}

export default ComfyUIWorkflowBuilder