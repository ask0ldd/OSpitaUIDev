/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import useFetchPromptsList from "../../hooks/useFetchPromptsList";

export function PromptsSlot({memoizedSetModalStatus, selectedPromptNameRef} : IProps){
    
    const [promptsListPage, setPromptsListPage] = useState(0)
    const { promptsList } = useFetchPromptsList()

    const itemsPerPage = 3;

    /***
    //
    // Events Handlers
    //
    ***/

    function handleNextPage() : void{
        setPromptsListPage(page => page + 1 < Math.ceil(promptsList.length / itemsPerPage) ? page+1 : 0)
    }

    function handlePreviousPage() : void{
        setPromptsListPage(page => page - 1 < 0 ? Math.ceil(promptsList.length / itemsPerPage) - 1 : page - 1)
    }

    function nBlankConversationSlotsNeededAsFillers() : number{
        if (promptsListPage * itemsPerPage + itemsPerPage < promptsList.length) return 0
        return promptsListPage * itemsPerPage + itemsPerPage - promptsList.length
    }

    function handleOpenEditPromptFormClick(promptName : string) : void {
        selectedPromptNameRef.current = promptName
        memoizedSetModalStatus({visibility : true, contentId : "formEditPrompt"})
    }

    function handleOpenNewPromptFormClick() : void {
        memoizedSetModalStatus({visibility : true, contentId : "formNewPrompt"})
    }

    return(
    <article style={{marginTop:'0.75rem'}}>
        <h3>
            PROMPTS<span className='nPages' style={{color:"#232323", fontWeight:'500'}}>{getPagination()}</span>
        </h3>
        <ul>
            {promptsList.slice(promptsListPage * itemsPerPage, promptsListPage * itemsPerPage + itemsPerPage).map((prompt, index) => (<li key={"prompt" + index + promptsListPage * itemsPerPage} onClick={() => handleOpenEditPromptFormClick(prompt.name)}>{prompt.name}</li>))}
            {
                nBlankConversationSlotsNeededAsFillers() > 0 && Array(nBlankConversationSlotsNeededAsFillers()).fill("").map((_,id) => (<li className='fillerItem' key={"blank"+id}></li>))
            }
        </ul>
        <div className='buttonsContainer'>
            {/*<span className="activePage">Page {promptsListPage+1}&nbsp;<span>/&nbsp;{Math.ceil(promptsList.length/3)}</span></span>*/}
            <button title="previous page" className="white" style={{marginLeft:'auto'}} onClick={handlePreviousPage}>
                <svg height="16" width="14" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>
            </button>
            <button title="next page" className="white" onClick={handleNextPage}>
                <svg style={{transform:'rotate(180deg)'}} height="16" width="14" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>
            </button>
            <button title="create a new prompt" className="purple purpleShadow" onClick={handleOpenNewPromptFormClick}>
                <svg width="14" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="#fff" d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/></svg>
            </button>
        </div>
    </article>
    )

    function getPagination() : string{
        return `Page ${promptsListPage+1} on ${Math.ceil(promptsList.length/3) || 1}`
    }
}

interface IProps{
    memoizedSetModalStatus : ({visibility, contentId} : {visibility : boolean, contentId : string}) => void
    selectedPromptNameRef : React.MutableRefObject<string>
}