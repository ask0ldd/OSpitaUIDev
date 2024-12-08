/* eslint-disable @typescript-eslint/no-unused-vars */
import '../../style/ChatHistory.css'
import AnswerWaitingAnim from './AnswerWaitingAnim'
import computerIcon from '../../assets/chaticon9.png';
import './AnswerRow2.css'
import { ISource } from '../../interfaces/IConversation';
import { TTSService } from '../../services/TTSService';
import AnswerButtonsGroup from './AnswerButtonsGroup';

function AnswerRow({isStreaming, index, answer, sources, TTS, onDownload, onCopyToClipboard, onRegenerate, images} : IProps){

    /*function convertSourcesArrayToHTML(sourcesArray : ISource[]) : string{
        if(sourcesArray.length == 0) return ''
        return sourcesArray.reduce((acc, source) => acc + source.asHTML, '<hr style="opacity:0.3; margin:1.15rem 0 0.5rem 0;"><span style="font-size:14px; font-weight:600; text-decoration:underline; margin-bottom:0.25rem;">Sources :</span>').slice(0, -4)
    }

    function convertImagesArrayToHTML(imagesArray : string[])  : string{
        if(imagesArray.length == 0) return ''
        const imagesHTML = imagesArray.reduce((acc, imageFilename) => acc + `<img src="/backend/images/${imageFilename}" style="margin:0.5rem 0 0 0; width:50px; border:1px solid var(--input-border-color);"/>`, '')
        return `<hr style="opacity:0.3; margin:0.65rem 0 0.5rem 0;">
                <div style="display:flex; flex-direction:row; column-gap:0.5rem;">${imagesHTML}</div>`
    }*/

    /*function showCOT() {
        (document.querySelector('hidden') as HTMLElement).style.display = 'block';
    }*/

    return(
        <article className="historyItem answerItem" key={'answer' + index} id={'answer' + index}>
            <figure className={ isStreaming ? "actorFigureAnimation" : ""}>
                <img className="actorIcon" src={/*images.length ? images[0] : */computerIcon}/>
            </figure>
            {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                answer.asHTML == '' ? <AnswerWaitingAnim/> : 
                <div className='answerContainer'>
                    <div dangerouslySetInnerHTML={{ __html: answer.asHTML.toString()}}>
                    </div>
                    {(images && images.length > 0 ) && 
                        <>
                            <hr style={{opacity:0.3, margin:'0.65rem 0 0.3rem 0'}}/>
                            <div style={{display:'flex', flexDirection:'row', columnGap:'0.5rem'}}>
                                {images.map((image, imageIndex) => (<img key={'img'+index+'-'+imageIndex} src={`/backend/images/${image}`} style={{margin:'0.5rem 0 0 0', width:'50px', border:'1px solid var(--input-border-color)'}}/>))}
                            </div>
                        </>
                    }
                    {(sources && sources.length > 0) && 
                        <>
                            <hr style={{opacity:0.3, margin:'0.95rem 0 0.75rem 0'}}/>
                            <span style={{fontSize:'14px', fontWeight:600, textDecoration:'underline', marginBottom:'0.25rem'}} >Sources :</span>
                            {sources.map((source, sourceIndex) => (<span className="source" key={'src'+index+'-'+sourceIndex}><a href={source.asMarkdown}>{source.asMarkdown}</a></span>))}
                        </>
                    }
                </div>
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
    images : string[]
    onDownload : (text : string) => void
    onCopyToClipboard : (text : string) => Promise<void>
    onRegenerate? : () => void
    TTS : TTSService
    isStreaming : boolean
}