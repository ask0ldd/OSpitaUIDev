export interface IConversation {
    name : string
    history : IConversationElement[]
    lastAgentUsed : string 
    lastModelUsed : string // useful to determine the context format
    hidden? : boolean
    inferenceStats? : IInferenceStats
    images : string[]
}

export interface IInferenceStats {
    promptEvalDuration : number
    promptTokensEval : number
    inferenceDuration : number
    modelLoadingDuration : number
    wholeProcessDuration  : number
    tokensGenerated : number
}

export interface IConversationElement{
    question : string
    answer : IConversationAnswer
    date : string
    context : number[],
    sources : ISource[]
}

export interface IConversationAnswer{
    asMarkdown : string
    asHTML : string
}

export interface ISource{
    asMarkdown : string
    asHTML : string
}