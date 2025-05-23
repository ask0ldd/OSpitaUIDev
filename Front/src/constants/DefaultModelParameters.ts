const defaultModelParameters = {
    modelName : "llama3.1:8b", 
    systemPrompt : "You are an helpful assistant.", 
    temperature : 0.8, 
    mirostat : 0, 
    mirostat_eta : 0.1, 
    mirostat_tau : 5.0, 
    num_ctx : 2048,
    context : [],
    repeat_last_n : 64, 
    repeat_penalty : 1.1, 
    seed : 0,
    stop : ["\n", "user:", "AI assistant:"], 
    tfs_z : 1, 
    num_predict : 1024,
    top_k : 40,
    top_p : 0.9,
    status : "standard" as "standard" | "base" | "favorite",
    min_p : 0.0,
    num_keep : 5,
    typical_p : 0.7,
    presence_penalty : 1.5,
    frequency_penalty : 1.0,
    penalize_newline : true,
    numa : false,
    num_batch : 2,
    num_gpu : 1,
    main_gpu : 0,
    low_vram : false,
    vocab_only : false,
    use_mmap : true,
    use_mlock : false,
    num_thread : 8,
}

export default defaultModelParameters