/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, MutableRefObject } from 'react'
import { /*IFormGroup,*/ IOption } from '../Select'

export function useKeyboardHandler(
    id : string,
    /*formGroupState : {
        get : () => IFormGroup
        set : (state : IFormGroup) => void, 
        fieldAccessor? : string
    },*/
    options : Array<IOption>, 
    activeOptionRef : MutableRefObject<IOption>, 
    isListboxExpandedRef : MutableRefObject<boolean>,
    // fn updating the formgroup state
    setActiveOption : (option : IOption) => void,
    setListboxAsExpanded : (bool : boolean) => void
)
{
    useEffect(() => {
  
        function keyboardListener(e : KeyboardEvent){
            
            // out of focus
            if(e.code == "Escape" && isListboxExpanded()) {closeSelectOptions(e)}

            // when the right custom select is in focus
            if(document.activeElement?.id == id){
                if(e.code == "Enter" || e.code == "NumpadEnter" || e.code == "Space") {
                    if(!isListboxExpanded()) {
                        openSelectOptions(e)
                    } else {
                        closeSelectOptions(e)
                    }
                }
                if(e.code == "ArrowUp") {
                    if(!isListboxExpanded()) setListboxAsExpanded(true)
                    setPrevOptionActive(e)
                }
                if(e.code == "ArrowDown") {
                    if(!isListboxExpanded()) setListboxAsExpanded(true)
                    setNextOptionActive(e)
                }
                if(e.code == "Home") {
                    if(!isListboxExpanded()) setListboxAsExpanded(true)
                    setFirstOptionActive(e)
                }
                if(e.code == "End") {
                    if(!isListboxExpanded()) setListboxAsExpanded(true)
                    setLastOptionActive(e)
                }
                if(e.code == "PageUp" && isListboxExpanded()) {
                    setMinusTenOptionActive(e)
                }
                if(e.code == "PageDown" && isListboxExpanded()) {
                    setPlusTenOptionActive(e)
                }

                // Pression a-z | 0-9 => valid options rotation
                if(isCharacterFastSelectable(e.key)) {
                    if(!isListboxExpanded()) setListboxAsExpanded(true)
                    // extracts the options starting with the pressed letter
                    const optionsStartingWithPressedLetter = [...options].filter(option => option.value[0].toLowerCase() === e.key.toLowerCase() )
                    if(optionsStartingWithPressedLetter?.length) {
                        // find the index of the activeOption within this subarray
                        const indexActiveOption = [...optionsStartingWithPressedLetter].reduce((accu, option, index) => option.value === activeOptionRef.current.value ? accu = index : accu, -1)
                        // index = -1 => the activeOption isn't part of this subarray => the first option of the subarray becomes the active option
                        // index >= 0 < subarray.length-1 => the activeOption is part of this subarray => the next following option becomes the active option
                        // index = subarray.length-1 => rotate back at the start of the subarray => the first option of the subarray becomes the active option
                        if(indexActiveOption === -1 || indexActiveOption === optionsStartingWithPressedLetter.length-1) return setActiveOption(optionsStartingWithPressedLetter[0])
                        return setActiveOption(optionsStartingWithPressedLetter[indexActiveOption+1])
                    }
                }
            }
        }

        window.addEventListener('keydown', keyboardListener)

        // soutenance : clean up to avoid having two listeners active => since useEffect is triggered twice in strict mode
        return () => {
            window.removeEventListener('keydown', keyboardListener)
        }

    }, [/*formGroupState*/]) // n/a : each time formGroupState is changing, the event listener is remounted with formstate new value => without that accessing formstate return a blank stale state

    function setFirstOptionActive(e : KeyboardEvent){
        e.preventDefault()
        setActiveOption(options[0])
    }

    function setLastOptionActive(e : KeyboardEvent){
        e.preventDefault()
        setActiveOption(options[options.length-1])
    }

    function setMinusTenOptionActive(e : KeyboardEvent){
        e.preventDefault()
        const activeOptionIndex = getActiveOptionIndex(activeOptionRef)
        if(options[activeOptionIndex - 10] != null) return setActiveOption(options[activeOptionIndex - 10])
        setFirstOptionActive(e)
    }

    function setPlusTenOptionActive(e : KeyboardEvent){
        e.preventDefault()
        const activeOptionIndex = getActiveOptionIndex(activeOptionRef)
        if(options[activeOptionIndex + 10] != null) return setActiveOption(options[activeOptionIndex + 10])
        setLastOptionActive(e)
    }

    function setPrevOptionActive(e : KeyboardEvent){
        e.preventDefault()
        const prevOptionIndex = getActiveOptionIndex(activeOptionRef)-1
        if(prevOptionIndex < 0) return false
        setActiveOption(options[prevOptionIndex])
    }

    function setNextOptionActive(e : KeyboardEvent){
        e.preventDefault()
        const nextOptionIndex = getActiveOptionIndex(activeOptionRef)+1
        if(nextOptionIndex > options.length-1) return false
        setActiveOption(options[nextOptionIndex])
    }
  
    function getActiveOptionIndex(activeOption : MutableRefObject<IOption>) : number{
        let activeIndex = 0
        for(let index = 0; index < options.length; index++){
            if(activeOption.current.value === options[index].value) {
                activeIndex = index
                return activeIndex
            }
        }
        return activeIndex
    }

    function closeSelectOptions(e : KeyboardEvent){
        e.preventDefault()
        if(isListboxExpandedRef.current === true ) setListboxAsExpanded(false)
    }

    function openSelectOptions(e : KeyboardEvent){
        e.preventDefault()
        setListboxAsExpanded(true)
    }

    function isListboxExpanded(){
        return isListboxExpandedRef.current === true
    }

    function isCharacterFastSelectable(key : string) : boolean{
        const numbersNLettersList = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
        return numbersNLettersList.includes(key.toLowerCase())
    }
}