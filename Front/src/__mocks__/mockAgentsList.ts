import IAgentResponse from "../interfaces/responses/IAgentResponse"

const mockAgentsList : IAgentResponse[] = [
    {
        id : 'a0000000001',
        name: "baseAssistant",
        model : "mistral-nemo:latest",
        systemPrompt : "You are an helpful assistant",
        mirostat: 0,
        mirostat_eta: 0.1,
        mirostat_tau: 5.0,
        num_ctx: 4096,
        repeat_last_n: 64,
        repeat_penalty: 1.1,
        temperature: 0.3,
        seed: 0,
        stop: ["AI assistant:"],
        tfs_z: 1,
        num_predict: 1024,
        top_k: 40,
        top_p: 0.9,
        type : "system",
        favorite : false,
        meta : {revision : 0, created : 0, version : 0},
        $loki  : 1,
        webSearchEconomy : false
    },
    {
        id : 'a0000000002',
        name: "helpfulAssistant",
        model : "mistral-nemo:latest",
        systemPrompt : "You are an helpful assistant 2",
        mirostat: 0,
        mirostat_eta: 0.1,
        mirostat_tau: 5.0,
        num_ctx: 4096,
        repeat_last_n: 64,
        repeat_penalty: 1.1,
        temperature: 0.3,
        seed: 0,
        stop: ["AI assistant:"],
        tfs_z: 1,
        num_predict: 1024,
        top_k: 40,
        top_p: 0.9,
        type : "system",
        favorite : false,
        meta : {revision : 0, created : 0, version : 0},
        $loki  : 2,
        webSearchEconomy : false
    },
    {
        id : 'a0000000003',
        name: "COTReflexionAgent",
        model : "mistral-nemo:latest",
        systemPrompt : "You are a COT reflexion agent",
        mirostat: 0,
        mirostat_eta: 0.1,
        mirostat_tau: 5.0,
        num_ctx: 8192,
        repeat_last_n: 64,
        repeat_penalty: 1.1,
        temperature: 0.3,
        seed: 0,
        stop: ["AI assistant:"],
        tfs_z: 1,
        num_predict: 4096,
        top_k: 40,
        top_p: 0.9,
        type : "system",
        favorite : false,
        meta : {revision : 0, created : 0, version : 0},
        $loki  : 3,
        webSearchEconomy : false
    },
    {
        id : 'a0000000004',
        name: "searchQueryOptimizer",
        model : "llama3.2:3b",
        systemPrompt : "A search query optimizer",
        mirostat: 0,
        mirostat_eta: 0.1,
        mirostat_tau: 5.0,
        num_ctx: 8192,
        repeat_last_n: 64,
        repeat_penalty: 1.1,
        temperature: 0.3,
        seed: 0,
        stop: ["AI assistant:"],
        tfs_z: 1,
        num_predict: 4096,
        top_k: 40,
        top_p: 0.9,
        type : "system",
        favorite : false,
        meta : {revision : 0, created : 0, version : 0},
        $loki  : 4,
        webSearchEconomy : false
    },
    {
        id : 'a0000000005',
        name: "COTTableGenerator",
        model : "llama3.2:3b",
        systemPrompt : "A search query optimizer",
        mirostat: 0,
        mirostat_eta: 0.1,
        mirostat_tau: 5.0,
        num_ctx: 8192,
        repeat_last_n: 64,
        repeat_penalty: 1.1,
        temperature: 0.3,
        seed: 0,
        stop: ["AI assistant:"],
        tfs_z: 1,
        num_predict: 4096,
        top_k: 40,
        top_p: 0.9,
        type : "system",
        favorite : false,
        meta : {revision : 0, created : 0, version : 0},
        $loki  : 4,
        webSearchEconomy : false
    },
]

export default mockAgentsList