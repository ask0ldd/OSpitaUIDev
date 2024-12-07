import { IConversationWithId } from "../interfaces/IConversation";

const mockConversationsList : IConversationWithId[] =
    [
        {
            $loki : 1,
            name : "2nd Conversation",
            history : [],
            lastAgentUsed : "mockAgent",
            lastModelUsed : "mockModel",
        },
        {
            $loki : 2,
            name : "3rd Conversation",
            history : [],
            lastAgentUsed : "mockAgent",
            lastModelUsed : "mockModel",
        },
        {
            $loki : 3,
            name : "4th Conversation",
            history : [],
            lastAgentUsed : "mockAgent",
            lastModelUsed : "mockModel",
        },
    ]

export default mockConversationsList