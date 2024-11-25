/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react"
import { AIAgent } from "../../models/AIAgent"
import Select, { IOption } from "../CustomSelect/Select"
import AIAgentChain from "../../models/AIAgentChain"

export function FormSelectChainAgent({memoizedSetModalStatus, AIAgentsList} : IProps){

    const [targetAgent, setTargetAgent] = useState<AIAgent>(AIAgentsList[0])

    const [chainAgents, setChainAgents] = useState<AIAgent[]>(AIAgentChain.getAgentsList())

    const [activeAgentId, setActiveAgentId] = useState<number>(0)

    function handleCancelClick(e: React.MouseEvent<HTMLButtonElement>){
        e.preventDefault()
        memoizedSetModalStatus({visibility : false})
    }

    function handleSwitchChainAgent(option : IOption){
        setTargetAgent(AIAgentsList.filter(agent => agent.getName() == option.value)[0].clone())
    }

    function handleNextAgentClick(e: React.MouseEvent<HTMLButtonElement>){
        e.preventDefault()
        setActiveAgentId(agentId => {
            if(agentId == chainAgents.length - 1) return 0
            return agentId + 1
        })
    }

    return(
        <div className="chainModalMainContainer">
            <div className="chainContainer">
                <div className="yourQuery">Your Query</div>
                {chainAgents.map((agent, index) => (
                    <>
                        <svg width="20" height="30" viewBox="0 0 20 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M19.6023 20.4902L10.9602 29.5816C10.4299 30.1395 9.57009 30.1395 9.03977 29.5816L0.397739 20.4902C-0.13258 19.9323 -0.13258 19.0278 0.397739 18.4699C0.928058 17.912 1.78787 17.912 2.31819 18.4699L8.64203 25.1226L8.64204 -4.96474e-07L11.358 -3.77757e-07L11.358 25.1226L17.6818 18.4699C18.2121 17.912 19.0719 17.912 19.6023 18.4699C20.1326 19.0278 20.1326 19.9323 19.6023 20.4902Z" fill="#5CC9B9"/>
                        </svg>
                        {index == activeAgentId ? <div className="chainLink active">{agent.getName()}</div> : <div className="chainLink">{agent.getName()}</div>}
                    </>
                ))}
            </div>
            <div className="agentSelectContainer">
                <Select 
                    width="100%"
                    options={AIAgentsList.filter(agent => agent.getType() != "system" || agent.getName().includes("COTTableGenerator"))
                        .map((agent) => ({ label: agent.getName() + (agent.getType() == 'system' ? ` [ Core ]`: ""), value: agent.getName() }))} 
                    defaultOption={AIAgentsList.filter(agent => agent.getType() != "system" || agent.getName().includes("COTTableGenerator"))[activeAgentId].getName()}
                    id={"targetAgent"}
                    onValueChange={handleSwitchChainAgent}
                />
                <textarea rows={22} readOnly value={AIAgentsList.filter(agent => agent.getType() != "system" || agent.getName().includes("COTTableGenerator"))[activeAgentId].getSystemPrompt()}/>
                <button style={{width:'50%', marginLeft:'auto'}} onClick={handleNextAgentClick} className="cancelButton purpleShadow">Next</button>
            </div>
        </div>
    )
}

interface IProps{
    memoizedSetModalStatus : ({visibility, contentId} : {visibility : boolean, contentId? : string}) => void
    AIAgentsList : AIAgent[]
}