import { useContext, useState} from 'react'
import './style/ComboBox.css'
import { SelectContext } from './contexts/SelectContext'
// import { DatasTableContext } from '../DatasTableContext'

/**
 * Component : The field containing the active option of the custom select.
 * @Component
 * @return ( <SelectComboBox/> )
 */
// MEMO : forwardRef
const ComboBox = (({overrideOnClickEvent} : {overrideOnClickEvent ?: () => void}) => {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [comboboxFocus, setComboboxFocus] = useState(false) // just to force the refresh of the component when getting in or out focus

    const { id, labelledBy, activeOption, listbox, preset } = useContext(SelectContext)

    const comboboxStyle = {
        width: preset.width,
        height: preset.height,
        background: preset.selectBackgroundColor , 
        outline: "1px solid "+ preset.selectBorderColor.default,
        borderRadius : preset.borderRadius,
        color: preset.selectTextColor,
    }

    const comboboxFocusStyle = {
        width: preset.width,
        height: preset.height,
        background: preset.selectBackgroundColor,
        /*border:  "1px solid "+ preset.selectBorderColor.focus,*/
        borderRadius : preset.borderRadius,
        outline: "2px solid "+ preset.selectBorderColor.focus, 
        color: preset.selectTextColor,
    }

    return(
        <span style={comboboxFocus ? comboboxFocusStyle : comboboxStyle} 
            onFocus={()=> {setComboboxFocus(true);}} onBlur={() => {listbox.setAsExpanded(false); setComboboxFocus(false);}} 
            onMouseUp={overrideOnClickEvent && overrideOnClickEvent}
            onMouseDown={overrideOnClickEvent ? () => {} : () => {listbox.setAsExpanded(!listbox.isExpanded)}} 
            tabIndex={0} aria-controls="customListbox" id={id} role="combobox" 
            aria-haspopup="listbox" aria-activedescendant={activeOption.get().value} aria-labelledby={labelledBy}
            aria-expanded={listbox.isExpanded} className={listbox.isExpanded ? "selectLabel selectLabel-active" : "selectLabel"}
        >
            {activeOption.get().label}
            {/*<img alt="dropdown arrow" className={listbox.isExpanded ? "customSelectOpen" : "customSelectArrow"} src="./icons/select-arrow.svg"/>*/}
            <svg className={listbox.isExpanded ? "customSelectOpen" : "customSelectArrow"} width="14" height="9" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.88 10.5466L8 4.43996L14.12 10.5466L16 8.66663L8 0.66663L1.64355e-07 8.66663L1.88 10.5466Z" fill={preset.arrowColor}/>
            </svg>
        </span>
    )
})

export default ComboBox