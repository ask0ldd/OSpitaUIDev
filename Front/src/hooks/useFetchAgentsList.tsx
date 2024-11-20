import { useEffect, useState } from "react";
import { AIAgent } from "../models/AIAgent";
import AgentService from "../services/API/AgentService";

function useFetchAgentsList(){
    const [AIAgentsList, setAIAgentsList] = useState<AIAgent[]>([])
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const agentService = new AgentService()

    useEffect(() => {
        async function fetchAgentsList () {
            const retrievedAgentsList = await agentService.getAll()
            if(retrievedAgentsList == null) return setAIAgentsList([])
            const AIAgents = retrievedAgentsList.map((agent) => new AIAgent({...agent, modelName : agent.model}))
            if(JSON.stringify(AIAgents.map(agent => agent.asString())) == JSON.stringify(AIAgentsList.map(agent => agent.asString()))) return
            setAIAgentsList([...AIAgents])
            // set the first agent in DB as the active agent only if the agent currently active is the default one
            // if(ChatService.getActiveAgent().getId() == "a0000000001") ChatService.setActiveAgent(AIAgents[0])
        }
        fetchAgentsList()
    }, [refreshTrigger]);

    const triggerAIAgentsListRefresh = () => {
        setRefreshTrigger(prev => prev + 1)
    }

    return { AIAgentsList, setAIAgentsList, triggerAIAgentsListRefresh };
}

export default useFetchAgentsList