import { ISelectPreset  } from "./ISelectPreset";

class SelectPresetClass {
    #preset : ISelectPreset 

    constructor(preset : ISelectPreset ){
        this.#preset = preset
    }
   
    /**
     * @returns {ISelectPreset } The preset object
     */
    get() : ISelectPreset {
        return this.#preset
    }

    setWidth(width : number | string){
        if(typeof width === "number") this.#preset.width = width.toString()
        if(typeof width === "string") this.#preset.width = width
    }

}

export default SelectPresetClass