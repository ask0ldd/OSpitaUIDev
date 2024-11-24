import { useState, useRef, useCallback } from "react"

export function useWebSearchState(){
    const [isWebSearchActivated, _setWebSearchActivated] = useState(false)
    const isWebSearchActivatedRef = useRef<boolean>(false)

    const setWebSearchActivated = useCallback((value: boolean) => {
        isWebSearchActivatedRef.current = value
        _setWebSearchActivated(value)
    }, [])

    return ({isWebSearchActivated,isWebSearchActivatedRef, setWebSearchActivated})
}