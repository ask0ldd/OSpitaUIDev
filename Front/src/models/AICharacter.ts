/* eslint-disable @typescript-eslint/no-unused-vars */
import IAICharacterPartialParams from "../interfaces/params/IAICharacterPartialParams"
import { IAIModelParams } from "../interfaces/params/IAIModelParams"
import { AIModel } from "./AIModel"

class AICharacter extends AIModel implements IAICharacterPartialParams {
    name = ""
    coreIdentity = ""
    mbti = ""
    appearance = ""
    background = ""
    socialCircle = ""
    formativeExperiences = ""

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
        stop = ["\n", "user:", "AI assistant:"], 
        tfs_z = 1, 
        num_predict = 1024,
        top_k = 40,
        top_p = 0.9,
        status = "standard",
        min_p = 0.0,
        num_keep = 5,
        typical_p = 0.7,
        presence_penalty = 1.5,
        frequency_penalty = 1.0,
        penalize_newline = true,
        numa = false,
        num_batch = 2,
        num_gpu = 1,
        main_gpu = 0,
        low_vram = false,
        vocab_only = false,
        use_mmap = true,
        use_mlock = false,
        num_thread = 8,
        name = "",
        mbti = "",
        appearance = "",
        background = "",
        socialCircle = "",
        formativeExperiences = "",
        coreIdentity = "",
    } : IAIModelParams & IAICharacterPartialParams){
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
            min_p,
            num_keep,
            typical_p,
            presence_penalty,
            frequency_penalty,
            penalize_newline,
            numa,
            num_batch,
            num_gpu,
            main_gpu,
            low_vram,
            vocab_only,
            use_mmap,
            use_mlock,
            num_thread,
        })
        return this
        this.mbti = mbti
        this.background = background
        this.appearance = appearance
        this.socialCircle = socialCircle
        this.formativeExperiences = formativeExperiences
        this.coreIdentity = coreIdentity
        this.name = name
    }

    getMbtiCharacteristics(){
        return this.mbti
    }

    getName() : string{
        return this.name;
    }

    getBackground() : string{
        return this.background
    }

    getAppearance() : string{
        return this.appearance
    }

    getSocialCircle() : string{
        return this.socialCircle
    }

    getFormativeExperiences() : string{
        return this.formativeExperiences
    }

    getCoreIdentity() : string{
        return this.coreIdentity
    }


    clone() : AICharacter{
        return new AICharacter({
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
            min_p: this.getMinP(),
            num_keep: this.getNumKeep(),
            typical_p: this.getTypicalP(),
            presence_penalty: this.getPresencePenalty(),
            frequency_penalty: this.getFrequencyPenalty(),
            penalize_newline: this.getPenalizeNewline(),
            numa: this.getNuma(),
            num_batch: this.getNumBatch(),
            num_gpu: this.getNumGpu(),
            main_gpu: this.getMainGpu(),
            low_vram: this.getLowVram(),
            vocab_only: this.getVocabOnly(),
            use_mmap: this.getUseMmap(),
            use_mlock: this.getUseMlock(),
            num_thread: this.getNumThread(),
            name: this.getName(),
            mbti: this.getMbtiCharacteristics(),
            appearance: this.getAppearance(),
            background: this.getBackground(),
            socialCircle: this.getSocialCircle(),
            formativeExperiences: this.getFormativeExperiences(),
            coreIdentity: this.getCoreIdentity(),
        })
    }

}

export default AICharacter