import RightMenu from "./RightMenu"

function RoleplayPanel({handleMenuItemClick, isStreaming} : IProps){
    return(<aside className="rightDrawer">
        <RightMenu handleMenuItemClick={handleMenuItemClick} isStreaming={isStreaming}/>
        <article className='roleplayContainer'>
            <h3 style={{margin:'2px 0 10px 0'}}>SPEAK WITH</h3>
        </article>
    </aside>)
}

export default RoleplayPanel

interface IProps{
    handleMenuItemClick : (item : string) => void
    isStreaming : boolean
}
