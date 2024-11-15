/* eslint-disable @typescript-eslint/no-unused-vars */
import './LeftPanel3.css'
import ollama from '../../assets/Ollama3.png'
import DocumentsSlot from './DocumentsSlot'
import { ConversationsSlot } from './ConversationsSlot'
import { PromptsSlot } from './PromptsSlot'
import React, { useState } from 'react'
import { IConversation } from '../../interfaces/IConversation'
import { TAction } from '../../hooks/useActiveConversationReducer'
import ImagesSlot from './ImagesSlot'

// export default function LeftPanel({activeConversation, setActiveConversation, setModalStatus, selectedPromptRef} : IProps){
const LeftPanel = React.memo(({isWebSearchActivated, setWebSearchActivated, activeConversationId, activeConversationStateRef, setActiveConversationId, dispatch, memoizedSetModalStatus, selectedPromptNameRef} : IProps) => {

    // useEffect(() => {console.log("left panel render")})

    /*const [conversationsSlotRefreshKey, setConversationsSlotRefreshKey] = useState(0)

    function refreshConversationsSlot(){
        setConversationsSlotRefreshKey(conversationsSlotRefreshKey + 1)
    }

    useEffect(() => {
        refreshConversationsSlot()
    }, [activeConversationStateRef])*/

    const [activeSlot, setActiveSlot] = useState<"documents" | "images">("documents")

    return(
        <aside className="leftDrawer">
            <figure style={{cursor:'pointer'}} onClick={() => location.reload()}><span>OSSPITA FOR</span> <img src={ollama}/></figure>
            <ConversationsSlot activeConversationId={activeConversationId} setActiveConversationId={setActiveConversationId} dispatch={dispatch}/>
            <DocumentsSlot active={activeSlot == "documents"} isWebSearchActivated={isWebSearchActivated} setWebSearchActivated={setWebSearchActivated} memoizedSetModalStatus={memoizedSetModalStatus}/>
            {/*<ImagesSlot active={false}/>*/}
            <PromptsSlot selectedPromptNameRef={selectedPromptNameRef} memoizedSetModalStatus={memoizedSetModalStatus}/>
        </aside>
    )
}, (prevProps, nextProps) => {
    return prevProps.activeConversationId === nextProps.activeConversationId && prevProps.activeConversationStateRef.current === nextProps.activeConversationStateRef.current && prevProps.isWebSearchActivated === nextProps.isWebSearchActivated;
})

export default LeftPanel

interface IProps{
    activeConversationId : number
    setActiveConversationId : ({value} : {value : number}) => void
    dispatch : React.Dispatch<TAction>
    memoizedSetModalStatus : ({visibility, contentId} : {visibility : boolean, contentId : string}) => void
    selectedPromptNameRef : React.MutableRefObject<string>
    activeConversationStateRef: React.MutableRefObject<IConversation>
    isWebSearchActivated : boolean
    setWebSearchActivated: (value: boolean) => void
}