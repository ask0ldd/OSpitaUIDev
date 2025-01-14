/* eslint-disable @typescript-eslint/no-unused-vars */
import './LeftPanel3.css'
import './ImageGenLeftPanel.css'
import ollama from '../../assets/Ollama3.png'
import ComfyWorkflowsSlot from './ComfyWorkflowsSlot'
import ComfyPromptsSlot from './ComfyPromptsSlot'

function ImageGenLeftPanel() {

    return(
        <aside className="leftDrawer">
            <figure style={{cursor:'pointer'}} onClick={() => location.reload()}><span>OSSPITA FOR</span> <img src={ollama}/></figure>
            <ComfyWorkflowsSlot/>
            <ComfyPromptsSlot/>
        </aside>
    )
}

export default ImageGenLeftPanel