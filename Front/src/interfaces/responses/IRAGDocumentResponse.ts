import { ILokiBaseInterface } from "./ILokiBaseInterface"
import { IRAGDocument } from "../IRAGDocument"

export interface IRAGDocumentResponse extends IRAGDocument, ILokiBaseInterface{
    id : number
    filename : string
    size : number
    selected : boolean
    similarity : number
}