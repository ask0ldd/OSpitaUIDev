import './style/OptionsList.css'
import { useContext, useState } from 'react'
import { IOption } from './Select'
import { SelectContext } from './contexts/SelectContext'

/**
 * Component : One Option - Populates the option list of a custom select.
 * @Component
 * @param {Object} props - Props.
 * @param {number} props.index - Index of the option.
 * @param {Object} props.option
 * @param {string} props.option.label - text displayed as an option.
 * @param {string} props.option.value - value sent on form submit when this option is selected.
 * @return ( <Option index={index} option={option}/> )
 */
function Option({index, option} : IProps){

    const { options, activeOption, listbox, preset } = useContext(SelectContext)
    const [hoverOption, setHoverOption] = useState("0")

    const optionHoverStyle = { 
        color : preset.hoverOptionTextColor, 
        background : preset.optionBackgroundColor.hover, 
    }

    const optionDefaultStyle = {
    }

    const optionSelectedStyle = {
        background:preset.optionBackgroundColor.active
    }

    /**
     * Check if the given option is active.
     * @param {IOption} option - The option to be checked.
     * @returns {boolean} - True if the option is active, false otherwise.
     */
    function isOptionActive(option : IOption)
    {
        return activeOption.get().value === option?.value
    }

    return (
        <li role="option" id={option.value} data-value={option.value} aria-selected={isOptionActive(options[index])} 
        style={ hoverOption == option.value ? optionHoverStyle 
             : isOptionActive(options[index]) ? optionSelectedStyle : optionDefaultStyle
        } 
        onMouseEnter={() => setHoverOption(option.value)}
        onMouseOut={() => setHoverOption("0")}
        onMouseDown={(e) => {e.preventDefault(); activeOption.set(options[index]); listbox.setAsExpanded(false);}}
        value={option.value}>{option.label}</li>
    )
}

export default Option

interface IProps{
    index : number
    option : IOption
}

/*
<li onClick={() => {setActiveOption(options[index]); setOptionsListVisibility(false);}} key={selectId+'-option-'+index} value={option.value}>{option.label}</li>
*/