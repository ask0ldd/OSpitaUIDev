/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { IRAGDocument } from "../../interfaces/IRAGDocument";
import useFetchDocsList from "../../hooks/useFetchDocsList";
import { ChatService } from "../../services/ChatService";
import DocService from "../../services/API/DocService";

export default function DocumentsSlot({isWebSearchActivated, setWebSearchActivated, memoizedSetModalStatus, active} : IProps){

    // const RAGDocuments = DocumentsRepository.getDocuments().slice(0,6)

    const units = ["B", "KB", "MB", "GB"]

    const { docsList, docsListRef, setDocsList} = useFetchDocsList()

    /*const [documents, _setDocuments] = useState<IRAGDocument[]>([...RAGDocuments])
    const documentsRef = useRef<IRAGDocument[]>([...RAGDocuments])

    function setDocuments(documents: IRAGDocument[]){
        _setDocuments(documents)
        documentsRef.current = documents
    }*/

    const [documentsListPage, setDocumentsListPage] = useState<number>(0)

    const [documentsActiveTool, setDocumentsActiveTool] = useState<"search"|"filter">("search")

    const [documentsSearchTerm, setDocumentsSearchTerm] = useState<string>("")
    const filterInputRef = useRef<HTMLInputElement>(null)
    const searchInputRef = useRef<HTMLInputElement>(null)


    function reduceFileSize(filesize : number, round : number = 0) : string | undefined{
        const newFileSize = filesize / 1000
        if(newFileSize < 1) return filesize.toFixed(1) + " " + units[round]
        return reduceFileSize(Math.round((filesize / 1000) * 100) / 100, round + 1)
    }

    function handleSearchContainerClick(e : React.MouseEvent): void {
        e.stopPropagation()
        e.preventDefault()
        setDocumentsActiveTool("search")
    }

    function handleFilterContainerClick(e : React.MouseEvent): void {
        e.stopPropagation()
        e.preventDefault()
        setDocumentsActiveTool("filter")
        setDocumentsSearchTerm("")
    }

    useEffect(() => {
        if (documentsActiveTool === "search" && searchInputRef.current) {
            searchInputRef.current.blur()
        }
    }, [])

    useEffect(() => {
        if(isWebSearchActivated == true) setDocsList(docsListRef.current.map(doc => ({...doc, selected : false})))
    }, [isWebSearchActivated])

    /***
    //
    // Events Handlers
    //
    ***/

    function handleSearchTermChange(event : React.ChangeEvent): void {
        setDocumentsListPage(0)
        setDocumentsSearchTerm(() => ((event.target as HTMLInputElement).value))
    }

    function handleEmptySearchTermClick() : void {
        setDocumentsSearchTerm("")
    }

    function handleFileClick(filename : string) : void {
        const newDocs = [...docsListRef.current]
        const targetFileIndex = newDocs.findIndex(doc => doc.filename === filename)
        const doc = newDocs[targetFileIndex]
        doc.selected = !doc.selected
        if(doc.selected) { ChatService.setDocAsARAGTarget(doc.filename) } 
        else { ChatService.removeDocFromRAGTargets(doc.filename) }
        setDocsList(newDocs)
        setWebSearchActivated(false)
    }

    function handleNextPage() : void{
        setDocumentsListPage(currentPage => currentPage + 1 < Math.ceil(getFilteredDocs().length/5) ? currentPage + 1 : 0)
    }

    function handleDeleteDocsClick(e: React.MouseEvent) : void{
        e.preventDefault();
        const namesOfDocsToDelete = docsListRef.current.filter(doc => doc.selected === true).map(doc => doc.filename)
        try{
            for(const name of namesOfDocsToDelete){
                DocService.deleteByName(name)
            }
        }catch(e){
            console.error(e);
        }
        setDocsList(docsListRef.current.filter(doc => !namesOfDocsToDelete.includes(doc.filename)))
    }

    function handlePrevPage() : void{
        setDocumentsListPage(currentPage => currentPage - 1 < 0 ? Math.ceil(getFilteredDocs().length/5) - 1 : currentPage - 1)
    }

    function handleOpenUploadFileFormClick() : void {
        memoizedSetModalStatus({visibility : true, contentId : "formUploadFile"})
    }

    return(
        <article style={{marginTop:'0.75rem'}}>
                <h3>
                    DOCUMENTS<span className='nPages' style={{color:"#232323", fontWeight:'500'}}>{getPagination()}</span>
                </h3>
                <div className="searchFilterContainer">
                    <div title="search" className={documentsActiveTool == "search" ? "searchContainer active" : "searchContainer"} onClick={handleSearchContainerClick}>
                        {documentsActiveTool == "search" && <input autoFocus ref={searchInputRef} type="text" value={documentsSearchTerm} onChange={handleSearchTermChange} placeholder="Search"/>}
                        {documentsSearchTerm == "" ? 
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M2.2886 6.86317C2.2886 5.64968 2.77065 4.4859 3.62872 3.62784C4.48678 2.76978 5.65056 2.28772 6.86404 2.28772C8.07753 2.28772 9.24131 2.76978 10.0994 3.62784C10.9574 4.4859 11.4395 5.64968 11.4395 6.86317C11.4395 8.07665 10.9574 9.24043 10.0994 10.0985C9.24131 10.9566 8.07753 11.4386 6.86404 11.4386C5.65056 11.4386 4.48678 10.9566 3.62872 10.0985C2.77065 9.24043 2.2886 8.07665 2.2886 6.86317ZM6.86404 1.29784e-07C5.7839 -0.000137709 4.71897 0.254672 3.75588 0.743706C2.79278 1.23274 1.95871 1.94219 1.32149 2.81435C0.68428 3.68652 0.26192 4.69677 0.0887629 5.76294C-0.0843938 6.82911 -0.00345731 7.9211 0.32499 8.9501C0.653437 9.9791 1.22012 10.916 1.97895 11.6847C2.73778 12.4534 3.66733 13.0322 4.692 13.3739C5.71667 13.7156 6.80753 13.8106 7.87585 13.6512C8.94417 13.4918 9.95979 13.0826 10.8401 12.4566L14.0624 15.6789C14.2781 15.8873 14.567 16.0026 14.867 16C15.1669 15.9974 15.4538 15.8771 15.6658 15.665C15.8779 15.4529 15.9982 15.166 16.0008 14.8661C16.0034 14.5662 15.8881 14.2772 15.6798 14.0615L12.4587 10.8404C13.1888 9.8136 13.6222 8.60567 13.7113 7.34894C13.8005 6.09221 13.542 4.83518 12.9642 3.7156C12.3864 2.59602 11.5116 1.6571 10.4356 1.00171C9.35958 0.346316 8.12393 -0.000244844 6.86404 1.29784e-07Z" fill="#6D48C1"/>
                            </svg>
                            :<svg onClick={handleEmptySearchTermClick} width="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                                <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
                            </svg>
                        }
                    </div>
                    <div title="filter" className={documentsActiveTool == "filter" ? "filterContainer active" : "filterContainer"} onClick={handleFilterContainerClick}>
                        {documentsActiveTool == "filter" && <input autoFocus ref={filterInputRef} type="text" placeholder="Filter (Coming soon)"/>}
                        <svg style={{transform:'translateY(1px)'}} width="15" height="14" viewBox="0 0 19 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.8125 1.875H0.9375C0.68886 1.875 0.450403 1.77623 0.274587 1.60041C0.0987721 1.4246 0 1.18614 0 0.9375C0 0.68886 0.0987721 0.450403 0.274587 0.274587C0.450403 0.0987719 0.68886 0 0.9375 0H17.8125C18.0611 0 18.2996 0.0987719 18.4754 0.274587C18.6512 0.450403 18.75 0.68886 18.75 0.9375C18.75 1.18614 18.6512 1.4246 18.4754 1.60041C18.2996 1.77623 18.0611 1.875 17.8125 1.875ZM14.6875 7.25H4.0625C3.81386 7.25 3.5754 7.15123 3.39959 6.97541C3.22377 6.7996 3.125 6.56114 3.125 6.3125C3.125 6.06386 3.22377 5.8254 3.39959 5.64959C3.5754 5.47377 3.81386 5.375 4.0625 5.375H14.6875C14.9361 5.375 15.1746 5.47377 15.3504 5.64959C15.5262 5.8254 15.625 6.06386 15.625 6.3125C15.625 6.56114 15.5262 6.7996 15.3504 6.97541C15.1746 7.15123 14.9361 7.25 14.6875 7.25ZM10.9375 12.625H7.8125C7.56386 12.625 7.3254 12.5262 7.14959 12.3504C6.97377 12.1746 6.875 11.9361 6.875 11.6875C6.875 11.4389 6.97377 11.2004 7.14959 11.0246C7.3254 10.8488 7.56386 10.75 7.8125 10.75H10.9375C11.1861 10.75 11.4246 10.8488 11.6004 11.0246C11.7762 11.2004 11.875 11.4389 11.875 11.6875C11.875 11.9361 11.7762 12.1746 11.6004 12.3504C11.4246 12.5262 11.1861 12.625 10.9375 12.625Z" fill="#7983B5"/>
                        </svg>
                    </div>
                </div>
                <ul style={{marginTop:'0.5rem'}}>
                    {
                        docsListRef.current.filter(document => document.filename.toLowerCase().includes(documentsSearchTerm.toLowerCase())).slice(documentsListPage * 5, documentsListPage * 5 + 5).map((document, id) => (
                            <li title="Click to target with RAG" className={document.selected ? "activeDocument" : ""} onClick={() => handleFileClick(document.filename)} key={"documentLi"+id}>
                                {document.selected && <div style={{height:'100%', width:'6px', background:'#6d48c1'}}></div>}
                                {/*document.selected && <svg className="star" width="12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>*/}
                                {document.filename}
                                <span style={{marginLeft:'auto'}}>{reduceFileSize(document.size)}</span>
                            </li>
                        ))
                    }
                    {
                        nBlankFileSlotsNeededAsFillers() > 0 && Array(nBlankFileSlotsNeededAsFillers()).fill("").map((el,id) => (<li className='fillerItem' key={"blank"+id}></li>))
                    }
                </ul>
                <div className='buttonsContainer'>
                    <div className="deleteSelected purpleShadow" onClick={handleDeleteDocsClick}>
                        <svg width="14" height="16" viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg">
                            <path fill="#ffffff" d="M188 40H152V28C152 20.5739 149.05 13.452 143.799 8.20101C138.548 2.94999 131.426 0 124 0H76C68.5739 0 61.452 2.94999 56.201 8.20101C50.95 13.452 48 20.5739 48 28V40H12C8.8174 40 5.76516 41.2643 3.51472 43.5147C1.26428 45.7652 0 48.8174 0 52C0 55.1826 1.26428 58.2348 3.51472 60.4853C5.76516 62.7357 8.8174 64 12 64H16V200C16 205.304 18.1071 210.391 21.8579 214.142C25.6086 217.893 30.6957 220 36 220H164C169.304 220 174.391 217.893 178.142 214.142C181.893 210.391 184 205.304 184 200V64H188C191.183 64 194.235 62.7357 196.485 60.4853C198.736 58.2348 200 55.1826 200 52C200 48.8174 198.736 45.7652 196.485 43.5147C194.235 41.2643 191.183 40 188 40ZM72 28C72 26.9391 72.4214 25.9217 73.1716 25.1716C73.9217 24.4214 74.9391 24 76 24H124C125.061 24 126.078 24.4214 126.828 25.1716C127.579 25.9217 128 26.9391 128 28V40H72V28ZM160 196H40V64H160V196ZM88 96V160C88 163.183 86.7357 166.235 84.4853 168.485C82.2348 170.736 79.1826 172 76 172C72.8174 172 69.7652 170.736 67.5147 168.485C65.2643 166.235 64 163.183 64 160V96C64 92.8174 65.2643 89.7652 67.5147 87.5147C69.7652 85.2643 72.8174 84 76 84C79.1826 84 82.2348 85.2643 84.4853 87.5147C86.7357 89.7652 88 92.8174 88 96ZM136 96V160C136 163.183 134.736 166.235 132.485 168.485C130.235 170.736 127.183 172 124 172C120.817 172 117.765 170.736 115.515 168.485C113.264 166.235 112 163.183 112 160V96C112 92.8174 113.264 89.7652 115.515 87.5147C117.765 85.2643 120.817 84 124 84C127.183 84 130.235 85.2643 132.485 87.5147C134.736 89.7652 136 92.8174 136 96Z"/>
                        </svg>
                        Selected docs
                    </div>
                    <button title="previous page" onClick={handlePrevPage} className="white" style={{marginLeft:'auto'}}>
                        <svg height="16" width="14" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>
                    </button>
                    <button title="next page" onClick={handleNextPage} className="white">
                        <svg style={{transform:'rotate(180deg)'}} height="16" width="14" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>
                    </button>
                    <button title="upload a new doc" onClick={handleOpenUploadFileFormClick} className="purple purpleShadow">
                        <svg width="14" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="#fff" d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/></svg>
                    </button>
                </div>
            </article>
    )

    if(active == false) return(
        <article style={{marginTop:'0.75rem'}}>
          <h3>IMAGES<span className='nPages' style={{color:"#232323", fontWeight:'500'}}>open</span></h3>
        </article>
    )

    function getFilteredDocs() : IRAGDocument[]{
        return docsListRef.current.filter(document => document.filename.toLowerCase().includes(documentsSearchTerm.toLowerCase()))
    }

    function nBlankFileSlotsNeededAsFillers() : number{
        if (documentsListPage*5+5 < docsListRef.current.length) return 0
        return documentsListPage*5+5 - docsListRef.current.length
    }

    function getPagination() : string{
        return `Page ${documentsListPage + 1} on ${Math.ceil(getFilteredDocs().length / 5) || 1}`
    }
}

interface IProps{
    isWebSearchActivated : boolean
    setWebSearchActivated: (value: boolean) => void
    memoizedSetModalStatus : ({visibility, contentId} : {visibility : boolean, contentId : string}) => void
    active : boolean
}