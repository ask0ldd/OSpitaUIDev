export interface IConversation {
    /*id : number*/
    name : string
    history : IConversationElement[]
    lastAgentUsed : string 
    lastModelUsed : string // useful to determine the context format
    hidden? : boolean
    inferenceStats? : IInferenceStats
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
    context : number[]
    sources : ISource[]
    images : string[]
}

export interface IConversationAnswer{
    asMarkdown : string
    asHTML : string
}

export interface ISource{
    asMarkdown : string
    asHTML : string
}

export interface IConversationWithId extends IConversation {
    $loki: number
}