/* eslint-disable @typescript-eslint/no-unused-vars */
import '../../style/ChatHistory.css'
import userIcon from '../../assets/usericon4-2.png';
import './QuestionRow2.css'
import QuestionButtonsGroup from './QuestionButtonsGroup';

function QuestionRow({index, question, onDownload, onCopyToClipboard, onModify} : IProps){

    return(
       <article id={'questionItem'+index} className="historyItem questionItem2" style={{borderBottom:'1px solid #22222211'}} key={'question' + index}>
            <figure>
                <img className="actorIcon" src={userIcon} width={34}/>
            </figure>
            <div className='questionTextContainer'>{question}</div>
            <QuestionButtonsGroup index={index} question={question} onModify={onModify} />
       </article>
    )
   }
   
   export default QuestionRow

interface IProps{
    index : number
    question : string
    onDownload? : (text : string) => void
    onCopyToClipboard? : (text : string) => Promise<void>
    onModify : (text : string) => void
}