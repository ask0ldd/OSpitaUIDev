/* eslint-disable react-hooks/exhaustive-deps */
/* c8 ignore start */
import { useState, useEffect, useCallback, useRef } from "react"

function useModalManager({initialVisibility, initialModalContentId} : IModalObject) {

    const [modalVisibility, setModalVisibility] = useState<boolean>(initialVisibility)
    const [modalContentId, setModalContentId] = useState<string>(initialModalContentId)

    // show an error modal with errorMessageRef as a message
    const errorMessageRef = useRef("")
    const showErrorModal = useCallback((errorMessage : string) =>{
        errorMessageRef.current = errorMessage
        setModalContentId("error")
        setModalVisibility(true)
    }, [])

    // Memoized function to update modal status
    // Prevents unnecessary re-renders
    const memoizedSetModalStatus = useCallback(({visibility, contentId} : {visibility : boolean, contentId? : string}) => {
        setModalVisibility(visibility)
        if(contentId) setModalContentId(contentId)
    }, [])

    useEffect(() => {
  
        function keyboardListener(e : KeyboardEvent){
            if(e.code == "Escape" && modalVisibility) {
                e.preventDefault(); 
                e.stopPropagation(); 
                setModalVisibility(false)
            }
            if (e.key === 'Enter' && modalVisibility) {
                e.preventDefault();
            }
        }

        window.addEventListener('keydown', keyboardListener)

        // clean up to avoid having two listeners active => since useEffect is triggered twice in strict mode
        return () => {
            window.removeEventListener('keydown', keyboardListener)
        }

    }, [modalVisibility, setModalVisibility])

    useEffect(() => {

        if(modalVisibility) {
            scrollLock(true)
        } else { 
            scrollLock(false)
        }

    }, [modalVisibility])

    return { modalVisibility, setModalVisibility, modalContentId, setModalContentId, memoizedSetModalStatus, showErrorModal, errorMessageRef }
}

export default useModalManager

interface IModalObject{
    initialVisibility : boolean
    initialModalContentId : string
}

function scrollLock(bool : boolean)
{
    if(bool === true)
    {
        const scrollTop = window.scrollY || document.documentElement.scrollTop
        const scrollLeft = window.scrollX || document.documentElement.scrollLeft
        window.onscroll = () => {
            window.scrollTo(scrollLeft, scrollTop)
        }
    }else{
        window.onscroll = () => {}
    }
}