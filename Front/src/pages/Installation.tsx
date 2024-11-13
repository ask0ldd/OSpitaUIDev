/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Select, { IOption } from "../components/CustomSelect/Select";
import useFetchModelsList from "../hooks/useFetchModelsList";
import '../style/Installation.css'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from "react";
import AgentService from "../services/API/AgentService";
import useFetchAgentsList from "../hooks/useFetchAgentsList";

export default function Installation(){

    const modelsList = useFetchModelsList("includes-embedding-models")
    const { AIAgentsList } = useFetchAgentsList()

    const [visibleSection, setVisibleSection] = useState(0)

    const [selectedStep2Model, setSelectedStep2Model] = useState("aya-expanse:8b")

    const navigate = useNavigate()

    const [selectedModels, setSelectedModels] = useState({complex : "", trivial : "", embedding : "nomic-embed-text:v1.5"})
    useEffect(() => {
        setSelectedModels({
            complex : AIAgentsList.find(agent => agent.getName() == "baseAssistant")?.getModelName() || modelsList[0], 
            trivial : AIAgentsList.find(agent => agent.getName() == "searchQueryOptimizer")?.getModelName() || modelsList[0], 
            embedding : "nomic-embed-text:v1.5"
        })
    }, [AIAgentsList])

    function handleSwitchComplexModel(option : IOption){
        setSelectedModels(prevModels => ({...prevModels, complex : option.value}))
    }

    function handleSwitchTrivialModel(option : IOption){
        setSelectedModels(prevModels => ({...prevModels, trivial : option.value}))
    }

    function handleSelectModelOnStep2(modelName : string){
        setSelectedStep2Model(modelName)
        setSelectedModels(currentModels => ({...currentModels, complex : modelName}))
    }

    async function handleSaveClick(e : React.MouseEvent){
        e.preventDefault();
        AgentService.updateAgentsConfig({advancedModel : selectedModels.complex, basicModel : selectedModels.trivial, embeddingModel : selectedModels.embedding})
        navigate('/chat')
    }

    async function handleSkipClick(e : React.MouseEvent){
        e.preventDefault();
        navigate('/chat')
    }

    async function handleNextClick(){
        setVisibleSection(currentSection => currentSection + 1)
    }

    return(
        <main className="selectPage">
            <div style={{textAlign:'left', marginTop:'2rem'}} className="container">
                {visibleSection == 0 && <h1>
                    Welcome to OSSPITA !
                </h1>}
                {visibleSection == 1 && <h1>
                    Step 2 on 4
                </h1>}
                {visibleSection == 2 && <h1>
                    Step 3 on 4
                </h1>}
                {visibleSection == 3 && <h1>
                    Step 4 on 4
                </h1>}
                {visibleSection == 0 && <section>
                    <h3 style={{textAlign:'left', opacity:'0.9'}}>Backend Installation</h3>
                    <p style={{textAlign:'left'}}>I - First, install our backend using the following commands :</p>
                    <div className="pullCommands">
                                &gt; cd back<br/>
                                &gt; npm install<br/>
                    </div>
                    <hr/>
                    <p style={{textAlign:'left', marginTop:'0.5rem'}}>II - Now run it by executing (from the back folder) :</p>
                    <div className="pullCommands">
                                &gt; node osspita.js<br/>
                                &gt; server should run on port 5174
                    </div>
                    <hr/>
                    <div style={{ marginTop:'1rem', width:'100%', display: 'flex', height:'40px', flexDirection:'row', columnGap:'0.75rem'}}>
                        <button className="skipButton purpleShadow" onClick={handleSkipClick}>skip</button>
                        <button className="purpleShadow" onClick={handleNextClick} style={{width:'25%', margin:'0'}}>next</button>
                    </div>
                </section>}
                {visibleSection == 1 && <section>
                    <h3 style={{textAlign:'left', opacity:'0.9'}}>Ollama Installation</h3>
                    <p style={{textAlign:'left'}}>I - Visit the official Ollama website :</p>
                    <div className="pullCommands">
                                <a href="https://ollama.com/download" target="_blank" rel="noopener noreferrer">https://ollama.com/download</a>
                    </div>
                    <hr/>
                    <p style={{textAlign:'left', marginTop:'1rem'}}>II - Install the version of the application matching your OS.</p>
                    <hr/>
                    <button className="purpleShadow" onClick={handleNextClick} style={{width:'33%', marginLeft:'auto', marginTop:'1rem'}}>next</button>
                </section>}
                {visibleSection == 2 && <section>
                    <h3 style={{textAlign:'left', opacity:'0.9'}}>Models Installation</h3>
                    <p>I - Click on the main model fitting your hardware :</p>
                    <table style={{marginTop:'0.25rem'}}>
                        <thead><tr><th>GPU VRAM</th><th>Model</th><th>Description</th><th>Link</th></tr></thead>
                        <tbody>
                            <tr className={selectedStep2Model == "llama3.2:3b" ? "modelRow active" : "modelRow"} onClick={() => handleSelectModelOnStep2("llama3.2:3b")}><td>4GB</td><td>Llama 3.2 3b</td><td>Fast (even on CPU) but limited</td><td><a target="_blank" href="https://ollama.com/library/llama3.2">Ollama page</a></td></tr>
                            <tr className={selectedStep2Model == "aya-expanse:8b" ? "modelRow active" : "modelRow"} onClick={() => handleSelectModelOnStep2("aya-expanse:8b")}><td>8GB</td><td>Aya Expanse 8b</td><td>Decent overall quality</td><td><a target="_blank" href="https://ollama.com/library/aya-expanse:8b">Ollama page</a></td></tr>
                            <tr className={selectedStep2Model == "mistral-nemo:12b" ? "modelRow active" : "modelRow"} onClick={() => handleSelectModelOnStep2("mistral-nemo:12b")}><td>12GB</td><td>Mistral Nemo 12b</td><td>Great for most tasks</td><td><a target="_blank" href="https://ollama.com/library/mistral-nemo">Ollama page</a></td></tr>
                        </tbody>
                    </table>
                    <hr/>
                    <p style={{marginTop:'0.25rem'}}>II - With Ollama installed, run those commands to pull the required models :</p>
                    <div className="pullCommands">
                        &gt; ollama pull llama3.2:3b<br/>
                        &gt; ollama pull nomic-embed-text<br/>
                        {selectedStep2Model == "mistral-nemo:12b" && <>&gt; ollama pull mistral-nemo</>}
                        {selectedStep2Model == "aya-expanse:8b" && <>&gt; ollama pull aya-expanse:8b</>}
                    </div>
                    <hr/>
                    <button className="purpleShadow" onClick={handleNextClick} style={{width:'33%', marginLeft:'auto', marginTop:'1rem'}}>next</button>
                </section>}
                {visibleSection == 3 && <section>
                    <h3 style={{textAlign:'left', opacity:'0.9'}}>Confirm your Selection</h3>
                    <p style={{marginBottom:'0.25rem'}}>I - The most complex tasks will be handled by this model you previously selected :</p>
                    <Select 
                        width="100%"
                        options={modelsList.map((model) => ({ label: model, value: model }))} 
                        defaultOption={modelsList.includes(selectedModels.complex) ? selectedModels.complex : modelsList[0]}
                        labelledBy="labelComplexModelName" 
                        id="complexModelName"
                        onValueChange={handleSwitchComplexModel}
                    />
                    <hr style={{marginTop:'1rem'}}/>
                    <p style={{marginTop:'0.5rem', marginBottom:'0.25rem'}}>II - The trivial tasks will be handled by this required model :</p>
                    <Select 
                        width="100%"
                        options={modelsList.map((model) => ({ label: model, value: model }))} 
                        defaultOption={modelsList.includes(selectedModels.trivial) ? selectedModels.trivial : modelsList[0]}
                        labelledBy="labelComplexModelName" 
                        id="complexModelName"
                        onValueChange={handleSwitchTrivialModel}
                    />
                    <hr/>
                    <p style={{marginTop:'0.5rem'}}><b>Important</b> : These choices are not definitive. The chat interface will let you select different models at any time.</p>
                    <hr style={{marginTop:'0.5rem'}}/>
                    <button className="purpleShadow" onClick={handleSaveClick} style={{width:'33%', marginLeft:'auto', marginTop:'1rem'}}>Save</button>
                </section>}
            </div>
        </main>
    )
}