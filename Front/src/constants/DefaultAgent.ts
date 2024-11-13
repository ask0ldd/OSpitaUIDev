export const defaultAgent =
{
    id : "",
    name: "helpfulAssistant",
    model : "mistral-nemo:latest",
    systemPrompt : "",
    mirostat: 0,
    mirostat_eta: 0.1,
    mirostat_tau: 5.0,
    num_ctx: 2048,
    repeat_last_n: 64,
    repeat_penalty: 1.1,
    temperature: 0.8,
    seed: 0,
    stop: "AI assistant:",
    tfs_z: 1,
    num_predict: 128,
    top_k: 40,
    top_p: 0.9,
    status : "standard"
}