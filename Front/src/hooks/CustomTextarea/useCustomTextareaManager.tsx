import { useState, useRef } from "react"
import { ImperativeHandle } from "../../components/CustomTextarea"

export default function useCustomTextareaManager(){

    // Textarea Value Management
    // Maintains the current value of the textarea at the component level
    const [textareaValue, _setTextareaValue] = useState("")
    const textareaValueRef = useRef<string>("")

    // Textarea Focus Control
    // Ref forwarded to the textarea to access its focus method
    // Utilized when a user selects one of the three suggestions
    const customTextareaRef = useRef<ImperativeHandle>(null)

    function setTextareaValue(value: string) {
        textareaValueRef.current = value
        _setTextareaValue(value)
    }

    return {textareaValue, setTextareaValue, customTextareaRef, textareaValueRef}
}