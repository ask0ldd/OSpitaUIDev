import { AIAgent } from "./AIAgent";
import { ProgressTracker } from "./AIAgentChain";
import { Observer } from "./Observer";

class Mediator implements Observer{
    #requiredNodesIds : string[] = []
    #observers : (AIAgent | ProgressTracker)[] = []
    #state : {[requiredNode : string] : unknown} = {}

    constructor({requiredNodesIds} : {requiredNodesIds : string[]}){
        this.#requiredNodesIds = requiredNodesIds
    }

    addSource(nodeId : string){
        if(!this.#requiredNodesIds.includes(nodeId)) this.#requiredNodesIds.push(nodeId)
    }

    update({sourceNode, data} : {sourceNode : string, data : unknown}) : void {
        if(this.#requiredNodesIds.includes(sourceNode)) this.#state = {...this.#state, [sourceNode] : data}
        if(this.allKeyExist()) this.notifyObservers()
    }

    addObserver(observer : AIAgent | ProgressTracker ) {
        this.#observers.push(observer);
    }

    notifyObservers() {
        for(const observer of this.#observers){
            if(observer instanceof AIAgent) return observer.update(this.#state)
        }
        return undefined
    }

    allKeyExist() : boolean {
        return this.#requiredNodesIds.every(id => id in this.#state)
    }
}

export default Mediator