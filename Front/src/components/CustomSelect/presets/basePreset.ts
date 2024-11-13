import SelectPresetClass from "./SelectPresetClass";

/* eslint-disable @typescript-eslint/no-unused-vars */
export const basePreset = new SelectPresetClass(
    { // weight font
        width : '200px',
        height: '40px',
        font : 'Jost',
        labelTextColor: "#454545",
        selectBackgroundColor: "#dee3ef",
        selectTextColor: "#454545",
        hoverOptionTextColor: "#FFFFFF",
        optionsContainerBackgroundColor: "#f7f9fds",
        optionsContainerBorderColor: "#bbc4e2",
        arrowColor: "#213547",
        selectBorderColor: { default: "#bbc4e2", focus: "#6d48c1" },
        borderRadius : '4px',
        optionBackgroundColor: { active: "#e2e6f3", hover: "#5d4794" }
    }
)


const newPreset = {
    select : {
        width : '100px',
        height: '30px',
        font : 'Jost',
    },
    combobox : {
        width : '100%',
        height : '100%',
        border : 'none',
        boxShadow : 'none',
        background : 'none',
        outline :'none',
        color : 'black',
    },
    comboboxFocus :{
        border: 'none',
        outline : 'none',
    },
    optionsContainer : {
        background : 'none',
        border  : 'none',
    },
    option : {
        background : 'blue',
        color : 'black',
    },
    optionHover : {
        background : 'blue',
        color : 'white',
    },
    optionActive : {
        background : 'blue',
        color: 'white',
    }
}