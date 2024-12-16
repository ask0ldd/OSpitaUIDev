/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from "react";
import { AIAgent } from "../../models/AIAgent";
import Select, { IOption } from "../CustomSelect/Select";
import './FormAgentSettings.css'
import useFetchModelsList from "../../hooks/useFetchModelsList.ts";
import IFormStructure from "../../interfaces/IAgentFormStructure";
import picots from '../../assets/sliderpicots.png'
import { ChatService } from "../../services/ChatService";
import useFetchAgentsList from "../../hooks/useFetchAgentsList.ts";
import { useServices } from "../../hooks/useServices.ts";

export default function FormAgentSettings({memoizedSetModalStatus, role, triggerAIAgentsListRefresh} : IProps){

    const modelList = useFetchModelsList()
    const currentAgent = useRef<AIAgent | null>(null)

    const  { agentService } = useServices()

    const { AIAgentsList } = useFetchAgentsList()

    const [webSearchEconomy, setWebSearchEconomy] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        async function retrieveAgent(agentName : string) {
            const agentDatas = await agentService.getAgentByName(agentName)
            if(agentDatas) currentAgent.current = new AIAgent({...agentDatas, modelName : agentDatas.model})
            const baseForm : IFormStructure = {
                agentName: role == "edit" && currentAgent.current ? currentAgent.current.getName() : "",
                modelName: role == "edit" && currentAgent.current ? currentAgent.current.getModelName() : (modelList[0] != null ? modelList[0] :  ""),
                systemPrompt: role == "edit" && currentAgent.current ? currentAgent.current.getSystemPrompt().replace(/\t/g,'') : "",
                temperature: role == "edit" && currentAgent.current ? currentAgent.current.getTemperature() : 0.8,
                maxContextLength: role == "edit" && currentAgent.current ? currentAgent.current.getContextSize() : 2048,
                maxTokensPerReply: role == "edit" && currentAgent.current ? currentAgent.current.getNumPredict() : 1024,
                topP: role == "edit" && currentAgent.current ? currentAgent.current.getTopP() : 0.9,
                topK: role == "edit" && currentAgent.current ? currentAgent.current.getTopK() : 40,
                repeatPenalty: role == "edit" && currentAgent.current ? currentAgent.current.getRepeatPenalty() : 1.1,
                seed: role == "edit" && currentAgent.current ? currentAgent.current.getSeed() : 0,
                repeatLastN: role == "edit" && currentAgent.current ? currentAgent.current.getRepeatLastN() : 64,
                tfsZ: role == "edit" && currentAgent.current ? currentAgent.current.getTfsZ() : 1,
                webSearchEconomy: false,
            }
            setFormValues({...baseForm})
        }

        retrieveAgent(ChatService.getActiveAgent().getName())
    }, [])

    const [formValues, setFormValues] = useState<IFormStructure>({
        agentName : "",
        modelName : "",
        systemPrompt : "",
        temperature : 0.8,
        maxContextLength : 2048,
        maxTokensPerReply : 1024,
        webSearchEconomy : false,
        topP : 0.9,
        topK : 40,
        repeatPenalty : 1.1,
        seed : 0,
        repeatLastN : 64,
        tfsZ : 1,
    })

    const [activeOptionsSet, setActiveOptionsSet] = useState(0)

    // const startAgentName = useRef<string>(role == "edit" && currentAgent.current ? currentAgent.current.getName() : "")

    useEffect(() => {
        if (role == "create") {
            setFormValues(prevValues => ({...prevValues, modelName : modelList[0]}))
        }
    }, [modelList])

    function handleSwitchModel(option : IOption){
        setFormValues(currentFormValues => ({...currentFormValues, modelName: option.value}))
    }

    function handleCancelClick(e: React.MouseEvent<HTMLButtonElement>){
        e.preventDefault()
        memoizedSetModalStatus({visibility : false})
    }

    function handleSwitchOptionsSetClick(e: React.MouseEvent<HTMLButtonElement>){
        e.preventDefault()
        e.stopPropagation()
        if(formValues.agentName == "") return setError("Agent name is required.")
        if(formValues.systemPrompt == "") return setError("System prompt is missing.")
        setActiveOptionsSet(activeOptionsSet == 0 ? 1 : 0)
    }

    async function handleDeleteClick(e: React.MouseEvent<HTMLButtonElement>){
        e.preventDefault()
        await agentService.deleteAgent(ChatService.getActiveAgent().getName())
        triggerAIAgentsListRefresh()
        ChatService.setActiveAgent(AIAgentsList[0])
        memoizedSetModalStatus({visibility : false})
    }

    async function handleSaveClick(e: React.MouseEvent<HTMLButtonElement>){
        e.preventDefault()
        if(!isFormValid()) return
        const newAgent = new AIAgent({
            id : role == "edit" && currentAgent.current ? currentAgent.current.getId() : "", 
            modelName: formValues.modelName, 
            name : formValues.agentName, 
            type : role == "edit" ? (ChatService.getActiveAgent() as AIAgent).getType() : "user_created", 
            favorite : false
        })
        .setContextSize(formValues.maxContextLength)
        .setNumPredict(formValues.maxTokensPerReply)
        .setSystemPrompt(formValues.systemPrompt)
        .setTemperature(formValues.temperature)
        .setSeed(formValues.seed || 0)
        .setTopP(formValues.topP || 0.9)
        .setTfsZ(formValues.tfsZ || 1)
        .setTopK(formValues.topK || 40)
        .setRepeatLastN(formValues.repeatLastN || 64)
        .setRepeatPenalty(formValues.repeatPenalty || 1.1)

        let response
        if(role == "create") response = await agentService.save(newAgent)
        if(role == "edit") {
            if(!currentAgent.current) return
            const agent = await agentService.getAgentByName(currentAgent.current.getName())
            console.log(JSON.stringify(agent))
            response = await agentService.updateById(newAgent)
        }
        
        // if any error saving or updating the model -> the modal stays open & the active agent is not updated
        if(response != null) return setError(response)
        
        triggerAIAgentsListRefresh()
        ChatService.setActiveAgent(newAgent)
    
        // if(setForceRightPanelRefresh) setForceRightPanelRefresh(prev => prev + 1)
            
        memoizedSetModalStatus({visibility : false})
    }

    function isFormValid(){
        const {agentName, modelName, systemPrompt, temperature, maxContextLength, maxTokensPerReply } = formValues
        setError("")
        if(!agentName || agentName == "") { 
            setError("Agent name is required.")
            return false
        }
        if(!modelName || modelName == "" || !modelList.includes(modelName)) {
            setError("The selected model doesn't exists.")
            return false
        }
        if(!systemPrompt || systemPrompt == "") { 
            setError("System prompt is missing.")
            return false
        }
        if(!temperature || temperature < 0 || temperature > 2) { 
            setError("Temperature must be > 0 and <= 2.")
            return false
        }
        if(!maxContextLength || maxContextLength < 1024 || maxContextLength > 8388608) { 
            setError("Context length must be >= 1024 and < 8388609.")
            return false
        }
        if(!maxTokensPerReply || maxTokensPerReply < 1 || maxTokensPerReply > 128000) { 
            setError("Max tokens must be >= 1 and < 128000.")
            return false
        }
        return true
    }

    return (
        <form className="agentForm" onSubmit={() => false}>
            <div className="labelErrorContainer">
                <label id="labelAgentName" style={{marginTop:0}} className="formLabel">Agent Name</label>
                {(error != "" && error.includes("Agent name")) && <span className="errorMessage">{error}</span>}
            </div>
            <div/>
            <label style={{marginTop:0}} id="labelModelName" className="formLabel">Model</label>

            <div className="agentInputNDeleteContainer">
                <input
                    aria-labelledby="labelAgentName"
                    style={error != "" && error.includes("Agent name") ? {borderColor: 'hsla(337, 89%, 28%, 0.733)'} : {}}
                    type="text"
                    className="formInput" 
                    spellCheck="false"
                    value={formValues.agentName}
                    onChange={(e) => setFormValues(formValues => ({...formValues, agentName : e.target?.value}))}
                />
                {(ChatService.getActiveAgent() as AIAgent).getType() != 'system' && 
                    <button onClick={handleDeleteClick} className="deleteAgentButton purpleShadow">
                        <span style={{transform:'translateY(1px)'}}>Delete </span>
                        <svg width="16" viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg">
                            <path fill="#ffffff" d="M188 40H152V28C152 20.5739 149.05 13.452 143.799 8.20101C138.548 2.94999 131.426 0 124 0H76C68.5739 0 61.452 2.94999 56.201 8.20101C50.95 13.452 48 20.5739 48 28V40H12C8.8174 40 5.76516 41.2643 3.51472 43.5147C1.26428 45.7652 0 48.8174 0 52C0 55.1826 1.26428 58.2348 3.51472 60.4853C5.76516 62.7357 8.8174 64 12 64H16V200C16 205.304 18.1071 210.391 21.8579 214.142C25.6086 217.893 30.6957 220 36 220H164C169.304 220 174.391 217.893 178.142 214.142C181.893 210.391 184 205.304 184 200V64H188C191.183 64 194.235 62.7357 196.485 60.4853C198.736 58.2348 200 55.1826 200 52C200 48.8174 198.736 45.7652 196.485 43.5147C194.235 41.2643 191.183 40 188 40ZM72 28C72 26.9391 72.4214 25.9217 73.1716 25.1716C73.9217 24.4214 74.9391 24 76 24H124C125.061 24 126.078 24.4214 126.828 25.1716C127.579 25.9217 128 26.9391 128 28V40H72V28ZM160 196H40V64H160V196ZM88 96V160C88 163.183 86.7357 166.235 84.4853 168.485C82.2348 170.736 79.1826 172 76 172C72.8174 172 69.7652 170.736 67.5147 168.485C65.2643 166.235 64 163.183 64 160V96C64 92.8174 65.2643 89.7652 67.5147 87.5147C69.7652 85.2643 72.8174 84 76 84C79.1826 84 82.2348 85.2643 84.4853 87.5147C86.7357 89.7652 88 92.8174 88 96ZM136 96V160C136 163.183 134.736 166.235 132.485 168.485C130.235 170.736 127.183 172 124 172C120.817 172 117.765 170.736 115.515 168.485C113.264 166.235 112 163.183 112 160V96C112 92.8174 113.264 89.7652 115.515 87.5147C117.765 85.2643 120.817 84 124 84C127.183 84 130.235 85.2643 132.485 87.5147C134.736 89.7652 136 92.8174 136 96Z"/>
                        </svg>
                    </button>
                }
            </div>
            <div/>
            <Select 
                width="100%"
                options={modelList.map((model) => ({ label: model, value: model }))} 
                defaultOption={formValues.modelName}
                labelledBy="labelModelName" 
                id="settingsSelectAgent"
                onValueChange={handleSwitchModel}
            />

            { activeOptionsSet == 0 && <section style={{gridArea:'set1'}} className="settingsSet1">  
                
                <div style={{gridArea:'label3', margin : '1.5rem 0 0.85rem 0'}} className="labelErrorContainer">
                    <label id="labelSystemPrompt" className="formLabel" style={{margin:0}}>System Prompt</label>
                    {(error != "" && error.includes("System prompt")) && <span className="errorMessage">System Prompt is missing</span>}
                </div>
                <textarea
                    style={error != "" && error.includes("System prompt") ? {outlineColor: 'hsla(337, 89%, 28%, 0.733)', gridArea:'textarea'} : {gridArea:'textarea'}}
                    aria-labelledby="labelSystemPrompt"
                    spellCheck="false"
                    className="formTextarea" 
                    rows={12} 
                    value={formValues.systemPrompt}
                    onChange={(e) => setFormValues(formValues => ({...formValues, systemPrompt : e.target?.value}))}
                />

                <label id="labelTemperature" className="formLabel">Temperature</label>
                <div/>
                <label id="labelMaxTokensPerReply" className="formLabel">Max Tokens Per Reply</label>

                <div className="inputNSliderContainer">
                    <input
                    aria-labelledby="labelTemperature"
                    className="formInput"
                    spellCheck="false"
                    type="number"
                    step="0.01" min="0.01" max="1" 
                    value={formValues.temperature}
                    onChange={(e) => setFormValues(formValues => ({...formValues, temperature : e.target.value === '' ? 0 : parseFloat(e.target.value)}))}
                    />
                    <div style={{display:'flex', flex: '1 1 100%', height:'100%'}}>
                        <div className="sliderbarContainer">
                            <div className="sliderTrack">
                                <div className="slider" style={{marginLeft:'180px'}}>
                                    <img src={picots} alt="picots" className="sliderPicots"/>
                                </div>
                            </div>
                            <div style={{display:'flex', justifyContent:'space-between', lineHeight:'12px', marginTop:'10px', fontSize:'14px'}}>
                                <span>Temperature</span><span>{formValues.temperature}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div/>
                <div className="inputNSliderContainer">
                    <input 
                        aria-labelledby="labelMaxTokensPerReply"
                        spellCheck="false"
                        type="number"
                        className="formInput"
                        value={formValues.maxTokensPerReply}
                        onChange={(e) => setFormValues(formValues => ({...formValues, maxTokensPerReply : e.target.value === '' ? 0 : parseInt(e.target.value)}))}
                    />
                    <div style={{display:'flex', flex: '1 1 100%', height:'100%'}}>
                        <div className="sliderbarContainer">
                            <div className="sliderTrack">
                                <div className="slider" style={{marginLeft:'110px'}}>
                                    <img src={picots} alt="picots" className="sliderPicots"/>
                                </div>
                            </div>
                            <div style={{display:'flex', justifyContent:'space-between', lineHeight:'12px', marginTop:'10px', fontSize:'14px'}}>
                                <span>Max Tokens</span><span>{formValues.maxTokensPerReply}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <label id="labelMaxContextLength" className="formLabel">Max Context Length</label>
                <div/>
                <label id="labelWebSearch" className="formLabel">Web Search</label>

                <div className="inputNSliderContainer">
                    <input
                        aria-labelledby="labelMaxContextLength" 
                        spellCheck="false" 
                        type="number"
                        step="1" min="0" max="1000000" 
                        className="formInput"
                        value={formValues.maxContextLength}
                        onChange={(e) => setFormValues(formValues => ({...formValues, maxContextLength : e.target.value === '' ? 0 : parseInt(e.target.value)}))}
                    />
                    <div style={{display:'flex', flex: '1 1 100%', height:'100%'}}>
                        <div className="sliderbarContainer">
                            <div className="sliderTrack">
                                <div className="slider" style={{marginLeft:'50px'}}>
                                    <img src={picots} alt="picots" className="sliderPicots"/>
                                </div>
                            </div>
                            <div style={{display:'flex', justifyContent:'space-between', lineHeight:'12px', marginTop:'10px', fontSize:'14px'}}>
                                <span>Context Length</span><span>{formValues.maxContextLength}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div/>
                <div className='webSearchContainer'>
                    <span>Context Economy (Far slower)</span>
                    <div className='switchContainer' onClick={() => setWebSearchEconomy(webSearchEconomy => !webSearchEconomy)}>
                        <div className={webSearchEconomy ? 'switch active' : 'switch'}></div>
                    </div>
                    <span>Processing Speed</span>
                </div>

            </section> }

            {/*<div onClick={() => setActiveOptionsSet(activeOptionsSet == 0 ? 1 : 0)} className="advancedBar" style={{gridArea: 'advancedBar'}}>
                <div style={{display:'flex', textAlign:'left', width:'100%'}}>
                    <span>Advanced Options</span>
                    <svg style={{marginLeft:'auto'}} width="26px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 8L12.2278 14.7343C12.108 14.8739 11.892 14.8739 11.7722 14.7343L6 8" fill="none" stroke="#373737" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                </div>
            </div>*/}

            { activeOptionsSet == 1 && <hr style={{gridArea : 'baseBar', marginTop:'2rem', marginBottom:'0.5rem', border:'none', borderBottom:'1px dashed #37373766'}}/>}

            { activeOptionsSet == 1 && <section style={{gridArea:'set2'}} className="settingsSet2">
                <label id="labelTopP" className="formLabel" style={{margin : '1rem 0 0.85rem 0'}}>Top-P</label>
                <div/>
                <label id="labelTopK" className="formLabel" style={{margin : '1rem 0 0.85rem 0'}}>Top-K</label>

                <div className="inputNSliderContainer">
                    <input
                    aria-labelledby="labelTopP"
                    className="formInput"
                    spellCheck="false"
                    type="number"
                    step="0.01" min="0.01" max="1" 
                    value={formValues.topP}
                    onChange={(e) => setFormValues(formValues => ({...formValues, topP : e.target.value === '' ? 0 : parseFloat(e.target.value)}))}
                    />
                    <div style={{display:'flex', flex: '1 1 100%', height:'100%'}}>
                        <div className="sliderbarContainer">
                            <div className="sliderTrack">
                                <div className="slider" style={{marginLeft:'180px'}}>
                                    <img src={picots} alt="picots" className="sliderPicots"/>
                                </div>
                            </div>
                            <div style={{display:'flex', justifyContent:'space-between', lineHeight:'12px', marginTop:'10px', fontSize:'14px'}}>
                                <span>Top-P</span><span>{formValues.topP}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div/>
                <div className="inputNSliderContainer">
                    <input 
                        aria-labelledby="labelTopK"
                        spellCheck="false"
                        type="number"
                        className="formInput"
                        value={formValues.topK}
                        step="1" min="1" max="200" 
                        onChange={(e) => setFormValues(formValues => ({...formValues, topK : e.target.value === '' ? 0 : parseInt(e.target.value)}))}
                    />
                    <div style={{display:'flex', flex: '1 1 100%', height:'100%'}}>
                        <div className="sliderbarContainer">
                            <div className="sliderTrack">
                                <div className="slider" style={{marginLeft:'80px'}}>
                                    <img src={picots} alt="picots" className="sliderPicots"/>
                                </div>
                            </div>
                            <div style={{display:'flex', justifyContent:'space-between', lineHeight:'12px', marginTop:'10px', fontSize:'14px'}}>
                                <span>Top-K</span><span>{formValues.topK}</span>
                            </div>
                        </div>
                    </div>
                </div>


                <label id="labelRepeatPenalty" className="formLabel">Repeat Penalty</label>
                <div/>
                <label id="labelSeed" className="formLabel">Seed</label>

                <div className="inputNSliderContainer">
                    <input
                    aria-labelledby="labelRepeatPenalty"
                    className="formInput"
                    spellCheck="false"
                    type="number"
                    step="1" min="0" max="256" 
                    value={formValues.repeatPenalty}
                    onChange={(e) => setFormValues(formValues => ({...formValues, repeatPenalty : e.target.value === '' ? 0 : parseInt(e.target.value)}))}
                    />
                    <div style={{display:'flex', flex: '1 1 100%', height:'100%'}}>
                        <div className="sliderbarContainer">
                            <div className="sliderTrack">
                                <div className="slider" style={{marginLeft:'180px'}}>
                                    <img src={picots} alt="picots" className="sliderPicots"/>
                                </div>
                            </div>
                            <div style={{display:'flex', justifyContent:'space-between', lineHeight:'12px', marginTop:'10px', fontSize:'14px'}}>
                                <span>Repeat Penalty</span><span>{formValues.repeatPenalty}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div/>
                <div className="inputNSliderContainer">
                    <input 
                        aria-labelledby="labelSeed"
                        spellCheck="false"
                        type="number"
                        className="formInput"
                        value={formValues.seed}
                        step="1" min="1" max="200" 
                        onChange={(e) => setFormValues(formValues => ({...formValues, seed : e.target.value === '' ? 0 : parseInt(e.target.value)}))}
                    />
                    <div style={{display:'flex', flex: '1 1 100%', height:'100%'}}>
                        <div className="sliderbarContainer">
                            <div className="sliderTrack">
                                <div className="slider" style={{marginLeft:'0px'}}>
                                    <img src={picots} alt="picots" className="sliderPicots"/>
                                </div>
                            </div>
                            <div style={{display:'flex', justifyContent:'space-between', lineHeight:'12px', marginTop:'10px', fontSize:'14px'}}>
                                <span>Seed</span><span>{formValues.seed}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <label id="labelRepeatLastN" className="formLabel">Repeat Last N</label>
                <div/>
                <label id="labelTfsZ" className="formLabel">Tfs Z</label>

                <div className="inputNSliderContainer">
                    <input
                    aria-labelledby="labelRepeatLastN"
                    className="formInput"
                    spellCheck="false"
                    type="number"
                    step="1" min="-1" max="512" 
                    value={formValues.repeatLastN}
                    onChange={(e) => setFormValues(formValues => ({...formValues, repeatLastN : e.target.value === '' ? 0 : parseInt(e.target.value)}))}
                    />
                    <div style={{display:'flex', flex: '1 1 100%', height:'100%'}}>
                        <div className="sliderbarContainer">
                            <div className="sliderTrack">
                                <div className="slider" style={{marginLeft:'60px'}}>
                                    <img src={picots} alt="picots" className="sliderPicots"/>
                                </div>
                            </div>
                            <div style={{display:'flex', justifyContent:'space-between', lineHeight:'12px', marginTop:'10px', fontSize:'14px'}}>
                                <span>Repeat Last N</span><span>{formValues.repeatLastN}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div/>
                <div className="inputNSliderContainer">
                    <input 
                        aria-labelledby="labelTfsZ"
                        spellCheck="false"
                        type="number"
                        className="formInput"
                        value={formValues.tfsZ}
                        step="0.1" min="1" max="2" 
                        onChange={(e) => setFormValues(formValues => ({...formValues, tfsZ : e.target.value === '' ? 0 : parseFloat(e.target.value)}))}
                    />
                    <div style={{display:'flex', flex: '1 1 100%', height:'100%'}}>
                        <div className="sliderbarContainer">
                            <div className="sliderTrack">
                                <div className="slider" style={{marginLeft:'0px'}}>
                                    <img src={picots} alt="picots" className="sliderPicots"/>
                                </div>
                            </div>
                            <div style={{display:'flex', justifyContent:'space-between', lineHeight:'12px', marginTop:'10px', fontSize:'14px'}}>
                                <span>Tfs Z</span><span>{formValues.tfsZ}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>}

            <hr style={{gridArea : 'advancedBar', marginTop:'2rem', marginBottom:'0.5rem', border:'none', borderBottom:'1px dashed #37373766'}}/>

            <div style={{gridArea:'y', display:'flex', columnGap:'12px', marginTop:'1.5rem'}}>
                <button className="cancelButton purpleShadow" style={{width:'calc(50% - 6px)'}} onClick={handleCancelClick}>Cancel</button>
            </div>

            <div style={{gridArea:'z', display:'flex', columnGap:'12px', marginTop:'1.5rem'}}>
                { (role == "create" && activeOptionsSet == 0) && <button style={{width:'50%', marginLeft:'auto'}} onClick={handleSwitchOptionsSetClick} className="cancelButton purpleShadow">Next</button>}
                { (role == "create" && activeOptionsSet == 1) && <button style={{width:'50%', marginLeft:'auto'}} onClick={handleSaveClick} className="saveButton purpleShadow">Save</button>}
                { role == "edit" && <button onClick={handleSwitchOptionsSetClick} className="cancelButton purpleShadow">More Settings</button>}
                { role == "edit" && <button onClick={handleSaveClick} className="saveButton purpleShadow">Save</button>}
            </div>
        </form>
    )
}

interface IProps{
    // currentAgent? : AIAgent
    memoizedSetModalStatus : ({visibility, contentId} : {visibility : boolean, contentId? : string}) => void
    triggerAIAgentsListRefresh : () => void
    role : "edit" | "create"
}


/*const emptyForm : IFormStructure = {
    agentName: "",
    modelName: "",
    systemPrompt: "",
    temperature: 0.1,
    maxContextLength: 2048,
    maxTokensPerReply: 0,
    webSearch: false,
}*/