import { useEffect, useState } from "react";
import IPrompt from "../interfaces/IPrompt";
import PromptService from "../services/API/PromptService";
import IPromptResponse from "../interfaces/responses/IPromptResponse";

function useFetchPromptsList(){
    const [promptsList, setPromptsList] = useState<IPrompt[] | IPromptResponse[]>([])
    // const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {

        async function fetchPromptsList () {
            const retrievedPromptsList = await PromptService.getAll()
            if (retrievedPromptsList == null) return setPromptsList([])
            return setPromptsList([...retrievedPromptsList])
        }
        fetchPromptsList()
    }, [/*refreshTrigger*/]);

    /*const handleRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    };*/

    return { promptsList, setPromptsList/*, handleRefresh*/ };
}

export default useFetchPromptsList