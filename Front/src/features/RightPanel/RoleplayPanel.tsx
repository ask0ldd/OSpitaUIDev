import { useState } from "react"
import RightMenu from "./RightMenu"
import './RoleplayPanel.css'
import { ChatService } from "../../services/ChatService"
import AICharacter from "../../models/AICharacter"
import baseDirective from "../../constants/characters/baseDirective"
import defaultCharacterModelParameters from "../../constants/characters/DefaultCharacterModelParameters"
import useFetchCharactersList from "../../hooks/useFetchCharactersList"
import AgentService from "../../services/API/AgentService"

function RoleplayPanel({handleMenuItemClick, isStreaming} : IProps){

    const [searchTerm, setSearchTerm] = useState<string>("")
    const [activeItemIndex, setActiveItemIndex] = useState(0)

    const charactersList = useFetchCharactersList()

    function handleEmptySearchTermClick(){
        setSearchTerm("")
    }

    function handleSearchTermChange(event : React.ChangeEvent): void {
        setSearchTerm(() => ((event.target as HTMLInputElement).value))
    }

    async function handleClickCharacterItem(index : number){
        const agentService = new AgentService()
        const helpfulAssistantAgent = await agentService.getAgentByName('helpfulAssistant')
        const activeCharacter = new AICharacter({
            ...defaultCharacterModelParameters, 
            modelName : helpfulAssistantAgent!.model,
            name : charactersList[index].name,
            coreIdentity : charactersList[index].coreIdentity,
            mbti : charactersList[index].mbti,
            appearance : charactersList[index].appearance,
            background : "",
            socialCircle : "socialCircle",
            formativeExperiences : "",
            systemPrompt : `${baseDirective}\n\n${charactersList[index].coreIdentity}\n\n${charactersList[index].mbti}\n\n${charactersList[index].appearance}`
        })
        ChatService.setActiveAgent(activeCharacter)
        setActiveItemIndex(index)
    }

    return(<aside className="rightDrawer">
        <RightMenu handleMenuItemClick={handleMenuItemClick} isStreaming={isStreaming}/>
        <article className='roleplayContainer'>
            <h3 style={{margin:'2px 0 10px 0'}}>SPEAK WITH</h3>
            <p style={{fontSize:'13px'}}>choose model / context legnth</p>
            <div style={{width:'100%', height:'1px', borderBottom:'1px dashed #35353599', marginBottom:'1rem'}}></div>
            <div title="search" className="searchContainer active">
                <input autoFocus type="text" value={searchTerm} placeholder="Search" onChange={handleSearchTermChange}/> {/* ref={searchInputRef} onChange={handleSearchTermChange} */ }
                {searchTerm == "" ? 
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M2.2886 6.86317C2.2886 5.64968 2.77065 4.4859 3.62872 3.62784C4.48678 2.76978 5.65056 2.28772 6.86404 2.28772C8.07753 2.28772 9.24131 2.76978 10.0994 3.62784C10.9574 4.4859 11.4395 5.64968 11.4395 6.86317C11.4395 8.07665 10.9574 9.24043 10.0994 10.0985C9.24131 10.9566 8.07753 11.4386 6.86404 11.4386C5.65056 11.4386 4.48678 10.9566 3.62872 10.0985C2.77065 9.24043 2.2886 8.07665 2.2886 6.86317ZM6.86404 1.29784e-07C5.7839 -0.000137709 4.71897 0.254672 3.75588 0.743706C2.79278 1.23274 1.95871 1.94219 1.32149 2.81435C0.68428 3.68652 0.26192 4.69677 0.0887629 5.76294C-0.0843938 6.82911 -0.00345731 7.9211 0.32499 8.9501C0.653437 9.9791 1.22012 10.916 1.97895 11.6847C2.73778 12.4534 3.66733 13.0322 4.692 13.3739C5.71667 13.7156 6.80753 13.8106 7.87585 13.6512C8.94417 13.4918 9.95979 13.0826 10.8401 12.4566L14.0624 15.6789C14.2781 15.8873 14.567 16.0026 14.867 16C15.1669 15.9974 15.4538 15.8771 15.6658 15.665C15.8779 15.4529 15.9982 15.166 16.0008 14.8661C16.0034 14.5662 15.8881 14.2772 15.6798 14.0615L12.4587 10.8404C13.1888 9.8136 13.6222 8.60567 13.7113 7.34894C13.8005 6.09221 13.542 4.83518 12.9642 3.7156C12.3864 2.59602 11.5116 1.6571 10.4356 1.00171C9.35958 0.346316 8.12393 -0.000244844 6.86404 1.29784e-07Z" fill="#6D48C1"/>
                    </svg>
                    :<svg onClick={handleEmptySearchTermClick} width="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                        <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
                    </svg>
                }
            </div>
            <div className="characterList">
            {charactersList.filter(character => character.name.includes(searchTerm) || character.genres.some(genre => genre.includes(searchTerm))).map((character, index) => (
                <article key={"character"+index} className={activeItemIndex == index ? "characterItem active" : "characterItem"} onClick={() => handleClickCharacterItem(index)}>
                    <img src={'backend/images/characters/' + character.portrait}/>
                    <span>{capitalizeFirstLetter(character.name)}</span>
                </article>
            ))}
            </div>
        </article>
    </aside>)
}

function capitalizeFirstLetter(string : string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export default RoleplayPanel

interface IProps{
    handleMenuItemClick : (item : string) => void
    isStreaming : boolean
}
