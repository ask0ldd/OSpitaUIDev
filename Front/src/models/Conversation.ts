import { IConversationElement } from "../interfaces/IConversation"

export class Conversation{
    #name : string
    #history : IConversationElement[]

    constructor({name, history} : {name : string, history? : IConversationElement[]} = {name : "blank", history : []}){
        this.#name = name
        this.#history = history || []
    }

    getName(){
        return this.#name
    }

    getHistory(){
        return this.#history
    }

    getLastHistoryElement() : IConversationElement | undefined {
        if (this.#history.length > 0){
            return this.#history[this.#history.length -1]
        }
    }

    setName(name : string){
        this.#name = name
        return this
    }

    setHistory(history : IConversationElement[]){
        this.#history = history
        return this
    }

    pushHistoryElement(element : IConversationElement) {
        this.#history.push(element)
    }

    pushBlankHistoryElementBesideQuestion(question : string){
        this.pushHistoryElement({
            question : question,
            answer  : {asMarkdown : "", asHTML : ""},
            context : [],
            sources : [],
            date : new Date().toISOString(),
            images : []
        })
    }

    setContextForTheLastHistoryElement(context : number[]){
        const last = this.getLastHistoryElement()
        if(last?.context) last.context = context 
    }

    toJSON(){
        return { name : this.#name, history : [...this.#history] }
    }
}