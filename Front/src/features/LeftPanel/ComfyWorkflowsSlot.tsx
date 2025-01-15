import { useEffect, useState } from "react";
import usePagination from "../../hooks/usePagination";
import { useServices } from "../../hooks/useServices";
import DefaultSlotButtonsGroup from "./DefaultSlotButtonsGroup";
import { IComfyWorklowResponse } from "../../interfaces/responses/IComfyWorklowResponse";

/* eslint-disable @typescript-eslint/no-unused-vars */
function ComfyWorkflowsSlot(){

    const { workflowService } = useServices()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [worklowsList, setWorkflowsList] = useState<IComfyWorklowResponse[]>([])

    useEffect(() => {
        async function getWorkflows(){
            try {
                const workflows = await workflowService.getAll()
                setWorkflowsList(workflows || [])
            } catch (error) {
                console.error('Error fetching workflows list:', error)
                setWorkflowsList([])
            }
        }

        getWorkflows()
    }, [])

    const itemsPerPage = 8;

    const { handlePageChange, activePage } = usePagination(itemsPerPage, () => worklowsList.length)

    function nBlankConversationSlotsNeededAsFillers() : number{
        if (activePage * itemsPerPage + itemsPerPage < worklowsList.length) return 0
        return activePage * itemsPerPage + itemsPerPage - worklowsList.length
    }

    function handleOpenEditWorkflowFormClick(WorkflowName : string) : void {
        // selectedWorkflowNameRef.current = WorkflowName
        // memoizedSetModalStatus({visibility : true, contentId : "formEditWorkflow"})
    }

    function handleOpenNewWorkflowFormClick() : void {
        // memoizedSetModalStatus({visibility : true, contentId : "formNewWorkflow"})
    }
    
    
    return(
        <article>
            <h3>
                WORKFLOWS
            </h3>
            <ul>
                {worklowsList.slice(activePage * itemsPerPage, activePage * itemsPerPage + itemsPerPage).map((workflow, index) => (<li key={"workflow" + index + activePage * itemsPerPage} onClick={() => handleOpenEditWorkflowFormClick(workflow.name)}>{workflow.name}</li>))}
                {
                    nBlankConversationSlotsNeededAsFillers() > 0 && Array(nBlankConversationSlotsNeededAsFillers()).fill("").map((_,id) => (<li className='fillerItem' key={"blank"+id}></li>))
                }
            </ul>
            <div className='buttonsContainer'>
                {/*<span className="activePage">Page {activePage+1}&nbsp;<span>/&nbsp;{Math.ceil(WorkflowsList.length/3)}</span></span>*/}
                <DefaultSlotButtonsGroup handlePageChange={handlePageChange}>
                    <button title="new Workflow" className="purple purpleShadow" onClick={handleOpenNewWorkflowFormClick}>
                        <svg width="14" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="#fff" d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/></svg>
                    </button>
                </DefaultSlotButtonsGroup>
            </div>
        </article>
    )
}

function nVignettesToFillRow(nImages : number){
    return 28 - ((nImages) % 4)
}

export default ComfyWorkflowsSlot