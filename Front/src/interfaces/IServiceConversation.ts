import { AIModel } from "../models/AIModel";
import { IConversation } from "./IConversation";

export interface IServiceConversation extends IConversation{
    model : AIModel
}