import { IConversationElement, IConversation } from "../interfaces/IConversation";

export class ConversationsRepository{

    static chatConversations : IConversation[] = [{name : "First Conversation", history : [], lastAgentUsed  : "", lastModelUsed : "", images : []}];

    static pushNewConversation(name : string, history : IConversationElement[], lastAgentUsed : string, lastModelUsed : string) : void {
        this.chatConversations.unshift({name, history, lastAgentUsed, lastModelUsed, images : []})
    }

    static getConversation(id : number) : IConversation {
        return this.chatConversations[id]
    }

    static getConversationHistory(id : number) : IConversationElement[]{
        return this.chatConversations[id].history
    }

    static getConversationName(id : number) : string{
        return this.chatConversations[id].name
    }

    static deleteConversation(id : number) : void{
        this.chatConversations.splice(id,1)
    }

    static updateConversationById(conversationId : number, conversation : IConversation) : void {
        this.chatConversations[conversationId] = conversation
    }

    static updateConversationHistoryById(id : number, history : IConversationElement[]) : void {
        this.chatConversations[id].history = history
    }

    static pushConversationElementToTargetConversation(id : number, element : IConversationElement) : void {
        this.chatConversations[id].history.push(element)
    }

    static setConversations(conversations : IConversation[]){
        this.chatConversations = conversations
    }

    static getConversations() : IConversation[]{
        return this.chatConversations;
    }

    static renameConversation(id : number, newName : string) : void {
        this.chatConversations[id] = {...this.getConversation(id), name : newName }
    }

    static getNumberOfConversations() : number {
        return this.chatConversations.length
    }

    static clearAll() : void {
        this.chatConversations = []
    }
}