import { useCallback, useEffect, useState } from "react";
import { AIAgent } from "../models/AIAgent";
import AgentService from "../services/API/AgentService";

function useFetchAgentsList(){
    const [AIAgentsList, setAIAgentsList] = useState<AIAgent[]>([])
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const agentService = new AgentService()

    const fetchAgentsList = useCallback(async () => {
        try {
            const retrievedAgentsList = await agentService.getAll()
            if (!retrievedAgentsList) {
                setAIAgentsList([])
                return
            }
        
            const AIAgents = retrievedAgentsList.map(
                (agent) => new AIAgent({ ...agent, modelName: agent.model })
            )
        
            const newAgentsString = JSON.stringify(AIAgents.map(agent => agent.asString()))
            const currentAgentsString = JSON.stringify(AIAgentsList.map(agent => agent.asString()))
        
            if (newAgentsString == currentAgentsString) return
            setAIAgentsList(AIAgents)
    
            /*Uncomment if needed:
            if (ChatService.getActiveAgent().getId() === "a0000000001") {
              ChatService.setActiveAgent(AIAgents[0]);
            }*/
        } catch (error) {
            console.error('Error fetching agents list:', error);
        }
    }, [AIAgentsList]);

    useEffect(() => { fetchAgentsList() }, [refreshTrigger])

    const triggerAIAgentsListRefresh = useCallback(() => {
        setRefreshTrigger(prev => prev + 1)
    }, [])

    return { AIAgentsList, setAIAgentsList, triggerAIAgentsListRefresh };
}

export default useFetchAgentsList