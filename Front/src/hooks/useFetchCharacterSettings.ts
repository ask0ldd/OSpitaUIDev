import { useState, useCallback, useEffect } from "react"
import ICharacterSettings from "../interfaces/ICharacterSettings"
import CharacterService from "../services/API/CharacterService"

function useFetchCharacterSettings(){
    const [characterSettings, setCharacterSettings] = useState<ICharacterSettings>({model : "llama3.2:3b", temperature : 0.8, num_ctx : 10000, num_predict : 2048})
    
    const fetchCharactersList = useCallback(async () => {
        try {
            const characterService = new CharacterService()
            const settings = await characterService.getSettings()
            // console.log(JSON.stringify(settings))
            if(settings != null) setCharacterSettings(settings)
        } catch (error) {
            console.error("Error fetching models list:", error)
        }
    }, [])

    useEffect(() => { fetchCharactersList() }, [fetchCharactersList])

    return characterSettings;
}

export default useFetchCharacterSettings