/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react"
import RightMenu from "./RightMenu"
import './RightPanel3.css'
import './RoleplayPanel.css'
import { ChatService } from "../../services/ChatService"
import AICharacter from "../../models/AICharacter"
import baseDirective from "../../constants/characters/baseDirective"
import defaultCharacterModelParameters from "../../constants/characters/DefaultCharacterModelParameters"
import useFetchCharactersList from "../../hooks/useFetchCharactersList"
import useFetchCharacterSettings from "../../hooks/useFetchCharacterSettings"

function RoleplayPanel({handleMenuItemClick, isStreaming, memoizedSetModalStatus} : IProps){

    const [searchTerm, setSearchTerm] = useState<string>("")
    const [activeItemIndex, setActiveItemIndex] = useState(0)

    const charactersList = useFetchCharactersList()
    const settings = useFetchCharacterSettings()

    function handleEmptySearchTermClick(){
        setSearchTerm("")
    }

    function handleSearchTermChange(event : React.ChangeEvent): void {
        setSearchTerm(() => ((event.target as HTMLInputElement).value))
    }

    async function handleClickCharacterItem(index : number){
        const activeCharacter = new AICharacter({
            ...defaultCharacterModelParameters, 
            modelName : settings.model,
            num_ctx : settings.num_ctx,
            num_predict : settings.num_predict,
            temperature : settings.temperature,
            name : charactersList[index].name,
            coreIdentity : charactersList[index].coreIdentity,
            mbti : charactersList[index].mbti,
            appearance : charactersList[index].appearance,
            background : "",
            socialCircle : "",
            formativeExperiences : "",
            systemPrompt : `${baseDirective}\n\n${charactersList[index].coreIdentity}\n\n${charactersList[index].mbti}\n\n${charactersList[index].appearance}`
        })
        ChatService.setActiveAgent(activeCharacter)
        setActiveItemIndex(index)
    }

    function handleOpenEditCharacterFormClick(){
        memoizedSetModalStatus({visibility : true, contentId : "formEditCharacter"})
    }

    return(<aside className="rightDrawer">
        <RightMenu handleMenuItemClick={handleMenuItemClick} isStreaming={isStreaming}/>
        <article className='roleplayContainer'>
            <h3 style={{margin:'2px 0 10px 0'}}>SPEAK WITH</h3>
            <div className="searchSettingsContainer">
                <div title="search" className="searchCharContainer active">
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
                <div style={{width:'1px', height:'40px', borderRight:'1px dashed #35353599'}}></div>
                <button className="settingsButton purpleShadow" onClick={handleOpenEditCharacterFormClick}>
                    <svg width="18" height="18" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21.9984 5.76357C21.9992 5.61882 21.9715 5.47532 21.9167 5.34131C21.862 5.2073 21.7813 5.08541 21.6794 4.98263L17.0157 0.318979C16.913 0.217037 16.7911 0.136386 16.6571 0.0816487C16.5231 0.0269117 16.3796 -0.000833794 16.2348 3.12556e-06C16.0901 -0.000833794 15.9466 0.0269117 15.8125 0.0816487C15.6785 0.136386 15.5566 0.217037 15.4539 0.318979L12.3411 3.43175L0.318995 15.4538C0.217053 15.5566 0.136401 15.6785 0.0816639 15.8125C0.026927 15.9465 -0.000818536 16.09 1.83843e-05 16.2348V20.8984C1.83843e-05 21.1902 0.115902 21.4699 0.322177 21.6762C0.528451 21.8825 0.80822 21.9984 1.09994 21.9984H5.76359C5.9175 22.0067 6.07145 21.9827 6.21546 21.9277C6.35946 21.8728 6.49032 21.7882 6.59953 21.6794L18.5556 9.65728L21.6794 6.59951C21.7796 6.49278 21.8614 6.37011 21.9214 6.23654C21.932 6.14886 21.932 6.06023 21.9214 5.97256C21.9265 5.92136 21.9265 5.86977 21.9214 5.81857L21.9984 5.76357ZM5.31262 19.7985H2.19985V16.6858L13.122 5.76357L16.2348 8.87634L5.31262 19.7985ZM17.7857 7.32546L14.6729 4.21269L16.2348 2.6618L19.3366 5.76357L17.7857 7.32546Z" fill="white"/>
                    </svg>
                </button>
            </div>
            <div className="characterList">
            {charactersList.filter(character => character.name.toLowerCase().includes(searchTerm.toLowerCase()) || character.genres.some(genre => genre.toLowerCase().includes(searchTerm.toLowerCase()))).map((character, index) => (
                <article key={"character"+index} className={activeItemIndex == index ? "characterItem active" : "characterItem"} onClick={() => handleClickCharacterItem(index)}>
                    <img style={{filter :'saturate(0.93) contrast(0.9)'}} src={'backend/images/characters/' + character.portrait}/>
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
    memoizedSetModalStatus : ({visibility, contentId} : {visibility : boolean, contentId? : string}) => void
}
