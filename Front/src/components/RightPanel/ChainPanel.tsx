import { AIAgent } from "../../models/AIAgent";
import Select, { IOption } from "../CustomSelect/Select";
import RightMenu from "./RightMenu";

function ChainPanel({handleMenuItemClick, AIAgentsList,  currentChain, setCurrentChain} : IProps){
    function handleSwitchChainAgent(option : IOption, id : string){
        setCurrentChain(chain => chain.map(link => link.selectId == id ? {selectId : link.selectId , agentName : option.value} : link))
    }

    function handleDeleteChainAgent(index : number){
        // deleting the agent & updating the selectId for each remaining agent !!! improve?!!!
        setCurrentChain(chain => [...chain.slice(0, index), ...chain.slice(index + 1)].map((link, index) => ({...link, selectId : "chainAgent" + index})))
    }

    return (<aside className="rightDrawer">
        <RightMenu handleMenuItemClick={handleMenuItemClick}/>
        <article className='chainContainer'>
            <h3>CURRENT CHAIN</h3>
            <p>NB : Each Agent will process its predecessor's response using its own System Prompt. Finally, the last response will be displayed.</p>
            <div style={{width:'100%', height:'1px', borderBottom:'1px dashed #35353599', marginBottom:'1.25rem'}}></div>
            <div className="yourQuery">Your Query</div>
            <svg width="20" height="30" viewBox="0 0 20 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M19.6023 20.4902L10.9602 29.5816C10.4299 30.1395 9.57009 30.1395 9.03977 29.5816L0.397739 20.4902C-0.13258 19.9323 -0.13258 19.0278 0.397739 18.4699C0.928058 17.912 1.78787 17.912 2.31819 18.4699L8.64203 25.1226L8.64204 -4.96474e-07L11.358 -3.77757e-07L11.358 25.1226L17.6818 18.4699C18.2121 17.912 19.0719 17.912 19.6023 18.4699C20.1326 19.0278 20.1326 19.9323 19.6023 20.4902Z" fill="#5CC9B9"/>
            </svg>
            {currentChain.map((link, index) => (<div key={"agentArrowGroup"+index} style={{display:'flex', flexDirection:'column', width:'100%', alignItems:'center'}}>
                <div className="chainSelectDeleteContainer">
                    <Select 
                        width="100%"
                        options={AIAgentsList.map((agent) => ({ label: agent.getName() + (agent.getType() == 'system' ? ` [ Core ]`: ""), value: agent.getName() }))} 
                        defaultOption={link.agentName}
                        id={"chainAgent" + index}
                        onValueChange={handleSwitchChainAgent}
                    />
                    <button className='purpleShadow' onClick={() => handleDeleteChainAgent(index)}>
                        <svg style={{transform:'rotateZ(45deg) scale(1.2)'}} width="14" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="#ffffff" d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/></svg>
                    </button>
                </div>
                <svg width="20" height="30" viewBox="0 0 20 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M19.6023 20.4902L10.9602 29.5816C10.4299 30.1395 9.57009 30.1395 9.03977 29.5816L0.397739 20.4902C-0.13258 19.9323 -0.13258 19.0278 0.397739 18.4699C0.928058 17.912 1.78787 17.912 2.31819 18.4699L8.64203 25.1226L8.64204 -4.96474e-07L11.358 -3.77757e-07L11.358 25.1226L17.6818 18.4699C18.2121 17.912 19.0719 17.912 19.6023 18.4699C20.1326 19.0278 20.1326 19.9323 19.6023 20.4902Z" fill="#5CC9B9"/>
                </svg>
            </div>))}
            <button className='purpleShadow' onClick={() => setCurrentChain(chain => [...chain, {selectId : "chainAgent" + chain.length, agentName : "baseAssistant"}])}>+ Add Agent</button>
        </article>
    </aside>)
}

export default ChainPanel

interface IProps{
    handleMenuItemClick : (item : string) => void
    AIAgentsList : AIAgent[]
    currentChain : {selectId : string, agentName : string}[]
    setCurrentChain : React.Dispatch<React.SetStateAction<{selectId : string, agentName : string}[]>>
}
