export default interface IAgent{
    id : string
    name : string
    model : string
    systemPrompt : string
    temperature : number
    webSearchEconomy : boolean
    mirostat: number
    mirostat_eta: number
    mirostat_tau: number
    num_ctx: number // maxContextLength
    repeat_last_n: number
    repeat_penalty: number
    seed: number
    stop: string[],
    tfs_z: number
    num_predict: number // maxTokensPerReply
    top_k: number
    top_p: number
    type : "system" | "user_created"
    favorite : boolean
}