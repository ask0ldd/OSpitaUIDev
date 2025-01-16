import { useNavigate } from 'react-router-dom'
import RightMenu from './RightMenu'
import './RightPanel3.css'
import GalleryPanel from './GalleryPanel'
import { IImage } from '../../interfaces/IImage'

function ImageGenRightPanel({images} : {images : IImage[]}){

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
            <GalleryPanel images={images}/>
        </aside>
    )
}

export default ImageGenRightPanel