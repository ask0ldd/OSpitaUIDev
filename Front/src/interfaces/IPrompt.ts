export default interface IPrompt {
    id? : string
    name : string
    prompts : {version : number, text : string, createdAt : string} []
    currentVersion : number
}
// {"name":"defaultAssistantPrompt","prompt":"You are an helpful assistant.","meta":{"revision":0,"created":1727917753940,"version":0},"$loki":2}