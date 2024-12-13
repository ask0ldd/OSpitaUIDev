import { useState, useCallback, useEffect } from "react"
import CharacterService from "../services/API/CharacterService"
import ICharacterResponse from "../interfaces/responses/ICharacterResponse"

function useFetchCharactersList(){
    const [charactersList, setCharactersList] = useState<ICharacterResponse[]>([])
    
    const fetchCharactersList = useCallback(async () => {
        try {
            const characterService = new CharacterService()
            const charactersList = await characterService.getAll()
            setCharactersList(charactersList ?? [])
        } catch (error) {
            console.error("Error fetching models list:", error)
        }
    }, [])

    useEffect(() => { fetchCharactersList() }, [fetchCharactersList])

    return charactersList;
}

export default useFetchCharactersList