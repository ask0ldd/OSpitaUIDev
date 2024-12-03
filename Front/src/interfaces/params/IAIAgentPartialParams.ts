interface IAIAgentPartialParams{
    id : string
    name : string
    type : "system" | "user_created"
    favorite : boolean
    targetFilesNames?: string[]
    webSearchEconomy? : boolean
}

export default IAIAgentPartialParams