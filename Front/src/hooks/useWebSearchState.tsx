import { useState, useRef } from "react"

export function useWebSearchState(){
    const [isWebSearchActivated, _setWebSearchActivated] = useState(false)
    const isWebSearchActivatedRef = useRef<boolean>(false)

    function setWebSearchActivated(value: boolean) {
        isWebSearchActivatedRef.current = value
        _setWebSearchActivated(value)
    }

    return ({isWebSearchActivated,isWebSearchActivatedRef, setWebSearchActivated})
}