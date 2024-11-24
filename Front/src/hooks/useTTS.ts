import { useRef, useEffect } from "react"
import { TTSService } from "../services/TTSService"

export function useTTS() {
    const TTS = useRef<TTSService>(new TTSService())

    useEffect(() => {
        let intervalId : NodeJS.Timeout
    
        if (TTS.current) {
            intervalId = setInterval(() => {
                TTS.current.pause()
                TTS.current.resume()
            }, 14000)
        }

        // Cleanup function
        return () => {
            if (intervalId) {
                clearInterval(intervalId)
            }
        }
    }, [])

    return TTS.current
}