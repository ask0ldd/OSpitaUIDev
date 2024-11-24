import { useCallback, useEffect, useRef, useState } from "react";
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

    // won't be triggered each time the component is rerendered
    const fetchDocsList = useCallback(async () => {
        try {
            const retrievedDocsList = await DocService.getAll()
            const newDocsList = retrievedDocsList ?? []
            setDocsList(newDocsList)
            docsListRef.current = newDocsList
        } catch (error) {
            console.error('Error fetching docs list:', error)
            setDocsList([])
            docsListRef.current = []
        }
    }, []);

    useEffect(() => {
        fetchDocsList()
    // fetchDocsList used as a dependancy since useCallback used to avoid rerenders
    }, [fetchDocsList, /*refreshTrigger*/]);

    /*const triggerDocsListRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    };*/

    return { docsList, setDocsList, docsListRef };
}