/* eslint-disable @typescript-eslint/no-unused-vars */
import useFetchPromptsList from "../../hooks/useFetchPromptsList.ts";
import usePagination from "../../hooks/usePagination.ts";
import DefaultSlotButtonsGroup from "./DefaultSlotButtonsGroup.tsx";

export function PromptsSlot({memoizedSetModalStatus, selectedPromptNameRef} : IProps){
    
    const { promptsList } = useFetchPromptsList()

    const itemsPerPage = 3;

    const { handlePageChange, activePage } = usePagination(itemsPerPage, () => promptsList.length)

    function nBlankConversationSlotsNeededAsFillers() : number{
        if (activePage * itemsPerPage + itemsPerPage < promptsList.length) return 0
        return activePage * itemsPerPage + itemsPerPage - promptsList.length
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
            {promptsList.slice(activePage * itemsPerPage, activePage * itemsPerPage + itemsPerPage).map((prompt, index) => (<li key={"prompt" + index + activePage * itemsPerPage} onClick={() => handleOpenEditPromptFormClick(prompt.name)}>{prompt.name}</li>))}
            {
                nBlankConversationSlotsNeededAsFillers() > 0 && Array(nBlankConversationSlotsNeededAsFillers()).fill("").map((_,id) => (<li className='fillerItem' key={"blank"+id}></li>))
            }
        </ul>
        <div className='buttonsContainer'>
            {/*<span className="activePage">Page {activePage+1}&nbsp;<span>/&nbsp;{Math.ceil(promptsList.length/3)}</span></span>*/}
            <DefaultSlotButtonsGroup handlePageChange={handlePageChange}>
                <button title="new prompt" className="purple purpleShadow" onClick={handleOpenNewPromptFormClick}>
                    <svg width="14" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="#fff" d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/></svg>
                </button>
            </DefaultSlotButtonsGroup>
        </div>
    </article>
    )

    function getPagination() : string{
        return `Page ${activePage+1} on ${Math.ceil(promptsList.length/3) || 1}`
    }
}

interface IProps{
    memoizedSetModalStatus : ({visibility, contentId} : {visibility : boolean, contentId : string}) => void
    selectedPromptNameRef : React.MutableRefObject<string>
}