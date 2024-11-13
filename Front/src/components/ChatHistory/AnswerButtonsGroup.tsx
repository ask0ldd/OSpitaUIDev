import { TTSService } from "../../services/TTSService"

export default function AnswerButtonsGroup( {answer, onCopyToClipboard, onRegenerate, TTS} : IProps){
    return(
        <div className='answerIconsContainer'>
            {<button title="regenerate an answer" style={onRegenerate ? {opacity :  1} : {opacity : 0.35, cursor:"auto"}} className={onRegenerate ? 'iconButton' : 'iconButton inactive'} onClick={onRegenerate ? () => onRegenerate() : () => void(0)}>
                <svg width="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path d="M105.1 202.6c7.7-21.8 20.2-42.3 37.8-59.8c62.5-62.5 163.8-62.5 226.3 0L386.3 160 352 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l111.5 0c0 0 0 0 0 0l.4 0c17.7 0 32-14.3 32-32l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 35.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5zM39 289.3c-5 1.5-9.8 4.2-13.7 8.2c-4 4-6.7 8.8-8.1 14c-.3 1.2-.6 2.5-.8 3.8c-.3 1.7-.4 3.4-.4 5.1L16 432c0 17.7 14.3 32 32 32s32-14.3 32-32l0-35.1 17.6 17.5c0 0 0 0 0 0c87.5 87.4 229.3 87.4 316.7 0c24.4-24.4 42.1-53.1 52.9-83.8c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.5 62.5-163.8 62.5-226.3 0l-.1-.1L125.6 352l34.4 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L48.4 288c-1.6 0-3.2 .1-4.8 .3s-3.1 .5-4.6 1z"/>
                </svg>
            </button>}
            <button title="copy to clipboard" className='iconButton' onClick={() => onCopyToClipboard(answer.asMarkdown)}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M6 3C6 2.44772 6.44772 2 7 2H15C15.5523 2 16 2.44772 16 3V9C16 10.6569 14.6569 12 13 12H7C6.44772 12 6 11.5523 6 11V3ZM7 0C5.34315 0 4 1.34315 4 3V11C4 12.6569 5.34315 14 7 14H13C15.7614 14 18 11.7614 18 9V3C18 1.34315 16.6569 0 15 0H7ZM0 5V13C0 15.7614 2.23858 18 5 18H11V16H5C3.34315 16 2 14.6569 2 13V5H0ZM10 8H8V6H10V4H12V6H14V8H12V10H10V8Z" fill="#252525"/>
                </svg>
            </button>
            <button title="read aloud" className='iconButton' onClick={playTTS}>
                {/*<svg style={{width:'16px', opacity:1}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M8 256a56 56 0 1 1 112 0A56 56 0 1 1 8 256zm160 0a56 56 0 1 1 112 0 56 56 0 1 1 -112 0zm216-56a56 56 0 1 1 0 112 56 56 0 1 1 0-112z"/></svg>*/}
                <svg style={{width:'14px', opacity:1, transform: 'translate(-1px, 0px) rotateZ(-90deg)'}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"/></svg>
            </button>
        </div>
    )

    async function playTTS(){
        if(TTS.isPlaying()) return TTS.stop()
        if(TTS) TTS.speak(answer.asMarkdown)
        // TTSAPI.call(answer.asMarkdown)
    }
}

interface IProps{
    answer : {asMarkdown : string, asHTML : string}
    onCopyToClipboard : (text : string) => Promise<void>
    onRegenerate? : () => void
    TTS : TTSService
}