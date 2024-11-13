import { useEffect, useState } from "react";
import { OllamaService } from "../services/OllamaService";

function useFetchModelsList(includes ?: "includes-embedding-models"){
    const [modelsList, setModelsList] = useState<string[]>([])

    useEffect(() => {

        async function fetchModelsList () {
            try {
                // listing all the models installed on the users machine
                const modelList = await OllamaService.getModelList()
                if(modelList != null) {
                    const ml = modelList?.models.map((model) => model?.model)
                    if(includes == "includes-embedding-models") return setModelsList(ml)
                    setModelsList(ml.filter((model : string) => !(model.includes("embed") || model.includes("llava"))))
                }
            } catch (error) {
                console.error("Error fetching models list:", error)
            }
        }
        
        fetchModelsList()
    }, []);

    return modelsList;
}

export default useFetchModelsList;