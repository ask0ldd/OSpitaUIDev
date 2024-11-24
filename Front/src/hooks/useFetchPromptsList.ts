import { useCallback, useEffect, useState } from "react";
import IPrompt from "../interfaces/IPrompt";
import PromptService from "../services/API/PromptService";
import IPromptResponse from "../interfaces/responses/IPromptResponse";

function useFetchPromptsList(){
    const [promptsList, setPromptsList] = useState<IPrompt[] | IPromptResponse[]>([])

    const fetchPromptsList = useCallback(async () => {
        try {
            const retrievedPromptsList = await new PromptService().getAll()
            setPromptsList(retrievedPromptsList || [])
        } catch (error) {
            console.error('Error fetching prompts list:', error)
            setPromptsList([]);
        }
      }, []);

    useEffect(() => {
        fetchPromptsList()
    }, [fetchPromptsList]);

    return { promptsList, setPromptsList };
}

export default useFetchPromptsList