import { useState, useRef } from "react"

export function useStreamingState(initialState: boolean = false) {
    const [isStreaming, _setIsStreaming] = useState<boolean>(initialState)
    const isStreamingRef = useRef(isStreaming)
  
    function setIsStreaming(value: boolean) {
      isStreamingRef.current = value
      _setIsStreaming(value)
    }
  
    return ({
      isStreaming,
      setIsStreaming,
      isStreamingRef
    })
}