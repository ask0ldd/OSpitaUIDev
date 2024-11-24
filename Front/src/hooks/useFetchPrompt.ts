import { useState, useEffect, useCallback } from "react";
import IPrompt from "../interfaces/IPrompt";
import IPromptResponse from "../interfaces/responses/IPromptResponse";
import PromptService from "../services/API/PromptService";

function useFetchPrompt(name : string | undefined){

    const genericPrompt : IPrompt = {name : "", prompts : [{version : 1, text : "", createdAt : new Date().toISOString()}], currentVersion: 1}
    const [prompt, setPrompt] = useState<IPrompt | IPromptResponse>(genericPrompt)

    const fetchPrompt = useCallback(async (promptName: string) => {
        try {
            const retrievedPrompt = await new PromptService().getByName(promptName)
            setPrompt(retrievedPrompt ?? genericPrompt)
        } catch (error) {
            console.error('Error fetching prompt:', error)
            setPrompt(genericPrompt)
        }
    }, []);

    useEffect(() => {
        if (!name || name === "") {
            setPrompt(genericPrompt);
        } else {
            fetchPrompt(name);
        }
    }, [name, fetchPrompt]);

    return { prompt, setPrompt };
}

export default useFetchPrompt