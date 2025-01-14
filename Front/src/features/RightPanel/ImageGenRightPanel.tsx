import { useNavigate } from 'react-router-dom'
import RightMenu from './RightMenu'
import './RightPanel3.css'
import GalleryPanel from './GalleryPanel'

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
            {/*<article className='settingsFormContainer'>
                <label>Active Workflow</label>
            </article>*/}
            <GalleryPanel/>
        </aside>
    )
}

export default ImageGenRightPanel