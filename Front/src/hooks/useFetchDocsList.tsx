import { useEffect, useRef, useState } from "react";
import { IRAGDocument } from "../interfaces/IRAGDocument";
import DocService from "../services/API/DocService";

export function useFetchDocsList(){
    const [docsList, _setDocsList] = useState<IRAGDocument[]>([])
    const docsListRef = useRef<IRAGDocument[]>(docsList)

    // const [refreshTrigger, setRefreshTrigger] = useState(0);

    function setDocsList (docsList: IRAGDocument[]) {
        docsListRef.current = docsList
        _setDocsList(docsList)
    }

    useEffect(() => {

        async function fetchDocsList () {
            const retrievedDocsList = await DocService.getAll()
            if(retrievedDocsList == null) return setDocsList([])
            return setDocsList([...retrievedDocsList])
        }
        
        fetchDocsList()
    }, [/*refreshTrigger*/]);

    /*const triggerDocsListRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    };*/

    return { docsList, setDocsList, docsListRef };
}