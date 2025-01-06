/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-irregular-whitespace */
import { ComfyUIBaseWorkflow } from '../constants/ComfyUIBaseWorkflow'
import ImageGenLeftPanel from '../features/LeftPanel/ImageGenLeftPanel'
import ImageGenRightPanel from '../features/RightPanel/ImageGenRightPanel'
import '../style/Chat.css'
import '../style/ImageGen.css'


function ImageGen(){
    return(
        <div id="globalContainer" className="globalContainer">
            <ImageGenLeftPanel/>
            <main style={{height:'100vh', maxHeight:'100vh', overflow:'hidden'}}>
                <div className='topIGContainer'>
                    <div className='topBar'>Follow our tutorial to install ComfyUI & the required tools</div>
                </div>
                <div className='bodyTextBotBarContainer'>
                    <div id="workflowContainer" style={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%',
                        flex: 1,
                        overflow: 'hidden',
                    }}>
                        <div className='workflowJSONContainer'>
                            <pre>{JSON.stringify(ComfyUIBaseWorkflow, null, '  ')}</pre>
                        </div>
                        <div className='workflowTableContainer'>
                            {extractProperties(ComfyUIBaseWorkflow).map(prop => (<span>{prop}</span>))}
                        </div>
                    </div>
                    <textarea className='positivePrompt' style={{ flex: '0 0 auto'}} rows={5}></textarea>
                    <div className='progressSendContainer'>
                        <div className='progressBar'>0 %</div>
                        <button className="sendButton purpleShadow">Generate Image</button>
                    </div>
                </div>
            </main>
            <ImageGenRightPanel/>
        </div>
    )
}

function extractProperties(obj : object, prefix = '') {
    let properties : string[] = [];
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      properties.push(fullKey);
      if (typeof value === 'object' && value !== null) {
        properties = properties.concat(extractProperties(value, fullKey));
      }
    }
    return properties.filter(prop => prop.includes("inputs") && !prop.endsWith("inputs"));
}

function setNestedProperty<T extends Record<string, any>>(obj: T, keys: string[], value: string): T {
    const lastKey = keys.pop()
    const target = keys.reduce((acc: any, key: string) => {
        if (!acc[key]) acc[key] = {}
        return acc[key]
    }, obj)

    if (lastKey) {
        target[lastKey] = value
    }
    return obj
}

export default ImageGen