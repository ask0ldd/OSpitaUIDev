export interface IAIModelParams{
    modelName: string
    systemPrompt?: string
    context?: number[]
    num_ctx?: number
    temperature?: number
    num_predict?: number
    mirostat?: number
    mirostat_eta?: number
    mirostat_tau?: number
    repeat_last_n?: number
    repeat_penalty?: number
    seed?: number
    stop?: string,
    tfs_z?: number
    top_k?: number
    top_p?: number
    status?: "standard" | "base" | "favorite"
}