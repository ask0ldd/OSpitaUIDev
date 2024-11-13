/* eslint-disable @typescript-eslint/no-unused-vars */
import '../../style/ChatHistory.css'
import AnswerWaitingAnim from './AnswerWaitingAnim'
import computerIcon from '../../assets/chaticon9.png';
import './AnswerRow2.css'
import { ISource } from '../../interfaces/IConversation';
import { TTSService } from '../../services/TTSService';
import AnswerButtonsGroup from './AnswerButtonsGroup';


function AnswerRow({isStreaming, index, answer, sources, TTS, onDownload, onCopyToClipboard, onRegenerate} : IProps){

    function convertSourcesArrayToHTML(sourcesArray : ISource[]) : string{
        if(sourcesArray.length == 0) return ''
        return sourcesArray.reduce((acc, source) => acc + source.asHTML, '<hr style="opacity:0.3; margin:1.15rem 0 0.5rem 0;"><span style="font-size:14px; font-weight:600; text-decoration:underline; margin-bottom:0.25rem;">Sources :</span>').slice(0, -4)
    }

    /*function showCOT() {
        (document.querySelector('hidden') as HTMLElement).style.display = 'block';
    }*/

    return(
        <article className="historyItem answerItem" key={'answer' + index} id={'answer' + index}>
            <figure className={ isStreaming ? "actorFigureAnimation" : ""}>
                <img className="actorIcon" src={computerIcon}/>
            </figure>
            {
                answer.asHTML == '' ? <AnswerWaitingAnim/> : <div className='answerContainer' dangerouslySetInnerHTML={{ __html: (answer.asHTML.toString() + convertSourcesArrayToHTML(sources)) || "" }}></div>
            }
            {   (answer.asHTML && answer.asMarkdown) &&
                <AnswerButtonsGroup answer={answer} onCopyToClipboard={onCopyToClipboard} onRegenerate={onRegenerate} TTS={TTS}/>
            }
        </article>
    )
}

export default AnswerRow

interface IProps{
    index : number
    answer : {asMarkdown : string, asHTML : string}
    sources : ISource[]
    onDownload : (text : string) => void
    onCopyToClipboard : (text : string) => Promise<void>
    onRegenerate? : () => void
    TTS : TTSService
    isStreaming : boolean
}