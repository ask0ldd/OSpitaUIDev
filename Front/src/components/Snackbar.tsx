import { useEffect, useState } from 'react'
import '../style/Snackbar.css'

export default function Snackbar({mode} : {mode: "agent" | "chain" | "web" | "rag"}){

    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        if (mode) {
            setIsVisible(true)
            const timeoutId = setTimeout(() => {
                setIsVisible(false)
            }, 1500)
            return () => clearTimeout(timeoutId)
        }
    }, [mode])

    return(
        <div className='snackbar' style={{ display: isVisible ? 'flex' : 'none'/*, top : window.scrollY+2+'px' */}}>
            {{
                'agent' : <>Default Mode Active</>,
                'chain' : <>Agent Chaining Mode Active</>,
                'web' : <>Web Search Mode Active</>,
                'rag' : <>RAG Mode Active</>,
            } [mode]}
        </div>
    )
}