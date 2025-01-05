import ImageGenLeftPanel from '../features/LeftPanel/ImageGenLeftPanel'
import ImageGenRightPanel from '../features/RightPanel/ImageGenRightPanel'
import '../style/Chat.css'
import '../style/ImageGen.css'


function ImageGen(){
    return(
        <div id="globalContainer" className="globalContainer">
            <ImageGenLeftPanel/>
            <main style={{position:'relative'}}>
                <div className='topIGContainer'>
                    <div className='topBar'>Follow our tutorial to install ComfyUI & the required tools</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    aaaa
                </div>
            </main>
            <ImageGenRightPanel/>
        </div>
    )
}

export default ImageGen