/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react"

function useKeyboardListener(textareaRef : React.RefObject<HTMLTextAreaElement>, handlePressEnterKey : (message : string) => Promise<void>, activeConversationId : number, currentContext : number[]){

    useEffect(() => {
        window.addEventListener('keydown', handleOnKeyDown)
        return () => {
            window.removeEventListener('keydown', handleOnKeyDown)
        }
    // need to remount the eventlistener each time activeConversationId is updated
    // or the activeConversationId inside handleSendMessageStreaming will keep it's initial mounting value
    // same for context
    }, [activeConversationId, currentContext]) 

    async function handleOnKeyDown(event : KeyboardEvent) : Promise<void>{
        // if(event.key === 'Tab' && autoCompletion.current) applyAutoCompleteOnTabPress(event)
        if(event.key === 'Enter' && !event.shiftKey && document.activeElement?.id == "mainTextArea") {
            event.preventDefault()
            if(textareaRef.current) await handlePressEnterKey(textareaRef.current.value)
        }
    }
}

export default useKeyboardListener