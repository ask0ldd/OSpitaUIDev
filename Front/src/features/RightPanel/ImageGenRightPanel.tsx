import { useNavigate } from 'react-router-dom'
import RightMenu from './RightMenu'
import './RightPanel3.css'

function ImageGenRightPanel(){

    const navigate = useNavigate()

    function handleMenuItemClick(item : string){
        if(item === "agent" || item === "chain" || item === "settings" || item === "roleplay") {
            navigate('/chat')
        }
    }

    return(
        <aside className="rightDrawer">
            <RightMenu handleMenuItemClick={handleMenuItemClick} isStreaming={false}/>
            <article className='settingsFormContainer'>
                <label>Active Workflow</label>
            </article>
        </aside>
    )
}

export default ImageGenRightPanel