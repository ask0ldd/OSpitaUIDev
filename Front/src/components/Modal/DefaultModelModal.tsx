import { ChatService } from '../../services/ChatService'
import Select, { IOption } from '../CustomSelect/Select'
import './DefaultModelModal.css'

export function DefaultModelModal({modelsList} : {modelsList : string[]}){

    function handleSwitchModel(option : IOption){
        const agent = ChatService.getActiveAgent()
        agent.setModel(option.value)
        ChatService.setActiveAgent(agent)
    }

    function handleSave(e : React.MouseEvent){
        e.preventDefault();
        (e.currentTarget.parentElement as HTMLDialogElement).style.display = 'none';
        (e.currentTarget.parentElement as HTMLDialogElement).close();
    }

    return(
        <dialog>
            <Select 
                    width="80%"
                    options={modelsList.map((model) => ({ label: model, value: model }))} 
                    defaultOption={modelsList[0]}
                    labelledBy="label-modelName" 
                    id="settingsSelectModel"
                    onValueChange={handleSwitchModel}
            />
            <button className='save' onClick={handleSave}>Save</button>
        </dialog>
    )
}