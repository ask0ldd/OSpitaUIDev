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
    tfs_z?: number
    top_k?: number
    top_p?: number
    status?: "standard" | "base" | "favorite"
    num_keep?: number
    min_p?: number
    typical_p?: number
    presence_penalty?: number
    frequency_penalty?: number
    penalize_newline?: boolean
    stop?: string[],
    numa?: boolean
    num_batch?: number
    num_gpu?: number
    main_gpu?: number
    low_vram?: boolean
    vocab_only?: boolean
    use_mmap?: boolean
    use_mlock?: boolean
    num_thread?: number
}