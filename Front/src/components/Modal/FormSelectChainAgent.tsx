/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react"
import { AIAgent } from "../../models/AIAgent"
import Select, { IOption } from "../CustomSelect/Select"

export function FormSelectChainAgent({memoizedSetModalStatus, AIAgentsList} : IProps){

    const [targetAgent, setTargetAgent] = useState<AIAgent>(AIAgentsList[0])

    function handleCancelClick(e: React.MouseEvent<HTMLButtonElement>){
        e.preventDefault()
        memoizedSetModalStatus({visibility : false})
    }

    function handleSwitchChainAgent(option : IOption){
        setTargetAgent(AIAgentsList.filter(agent => agent.getName() == option.value)[0].clone())
    }

    return(
        <div>
            <Select 
                width="100%"
                options={AIAgentsList.map((agent) => ({ label: agent.getName() + (agent.getType() == 'system' ? ` [ Core ]`: ""), value: agent.getName() }))} 
                defaultOption={targetAgent.getName()}
                id={"targetAgent"}
                onValueChange={handleSwitchChainAgent}
            />
            <textarea>
                {targetAgent.getSystemPrompt()}
            </textarea>
            <button style={{width:'50%', marginLeft:'auto'}} onClick={handleCancelClick} className="cancelButton purpleShadow">Next</button>
        </div>
    )
}

interface IProps{
    memoizedSetModalStatus : ({visibility, contentId} : {visibility : boolean, contentId? : string}) => void
    AIAgentsList : AIAgent[]
}