/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from "react"
import AINodesChain from "../../models/nodes/AINodesChain"
import { AIAgentNew } from "../../models/nodes/AIAgentNew"
import DocProcessorService from "../../services/DocProcessorService"
import { useServices } from "../../hooks/useServices"
import ComfyUIWorkflowBuilder from "../../utils/ComfyUIWorkflowBuilder"
import { ExecutedMessage, TWSMessage } from "../../interfaces/TWSMessageType"
import { IImage } from "../../interfaces/IImage"

function SettingsPanel(){

    const firstLoad = useRef(true)

    const { comfyUIService, imageService } = useServices()
    // const [imagesFilename, setImagesFilename] = useState<string[]>([])
    const [images, setImages] = useState<IImage[]>([])
    const [hoveredImage, setHoveredImage] = useState<IImage | null>()

    useEffect(()=>{
        if(!firstLoad.current) return
        refreshImages()
    }, [])

    async function refreshImages(){
        const imgs = await imageService.getAllGeneratedImages()
        setImages(imgs ?? [])
    }

    /*useEffect(() => {
        if(firstLoad.current == false) return

        async function effect(){

            const agentWriter = new AIAgentNew({name : "agentWriter", modelName : 'llama3.2:3b', systemPrompt : 'write a 50 lines short story with this theme : '})
            const agentSummarizer = new AIAgentNew({name : "agentSummarizer", modelName : 'llama3.2:3b', systemPrompt : 'summarize the following story in 5 lines : '})
            agentWriter.addObserver(agentSummarizer)
            const agentsChain = new AINodesChain({startNode : agentWriter, endNode : agentSummarizer})
            const result = agentsChain.process("heroic fantasy")
           
            const semanticChunks = await DocProcessorService.semanticChunking(text, 0.7)

            console.log(JSON.stringify(semanticChunks))
            console.log(semanticChunks.length)
        }

        effect()

        firstLoad.current = false
    }, [])*/

    async function handleClick(){
        comfyUIService.initSocket()
        comfyUIService.onWorkflowExecuted(async (message : TWSMessage) => {
            console.log("trigger")
            comfyUIService.getPrompt((message as ExecutedMessage).data.prompt_id)
            const filename = (message as ExecutedMessage).data.output.images[0].filename
            const imageBlob = await comfyUIService.fetchGeneratedImage(filename)
            if(!imageBlob) return
            const formData = new FormData()
            formData.append("image", imageBlob, "generated_" + filename)
            formData.append("generated", "true")
            await imageService.upload(formData)
            comfyUIService.resetOnEventsCallbacks()
            comfyUIService.disconnect()
            refreshImages()
        })
        const workflow = new ComfyUIWorkflowBuilder().setPrompt("an abstract 3d logo rendered with cinema 4d containing a sphere and particles effects"/*"a 3d top isometric view of the eiffel tower with red grass"*/).setBatchSize(1).setResolution(256, 256).setRandomSeed().build()
        await comfyUIService.queuePrompt(workflow.get())
        // comfyUIService.WSSendWorkflow(new ComfyUIWorkflowBuilder().setPrompt("a 3d top isometric view of the eiffel tower").setResolution(512, 512).build())
        /*const img = await comfyUIService.viewImage({
            "filename": "ComfyUI_00022_.png",
            "subfolder": "",
            "type": "output"
        })
        console.log(img)*/
    }

    async function handleDownloadClick(e : React.MouseEvent){
        // console.log((e.target as HTMLImageElement).src)
        try {
            const response = await fetch((e.target as HTMLImageElement).src)
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = 'image.jpg'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          } catch (error) {
            console.error('Error downloading image:', error)
          }
    }

    function handleMouseOverPicture(index : number){
        setHoveredImage(images[index] ?? null)
    }

    return(
        <article className='comingSoonContainer'>
            <span className='comingSoon' style={{textAlign:'center', width:'100%'}} onClick={handleClick}>
                Coming Soon
            </span>
            <div style={{display:'flex', width:'100%', flexWrap:'wrap'}}>
                {images.map((image : IImage, index : number) => (<img onClick={handleDownloadClick} onMouseEnter={() => handleMouseOverPicture(index)} onMouseOut={() => setHoveredImage(null)} key={index + "-comfyimg"} style={{display:'flex', width:'30%', flexGrow:'1', maxWidth:'33.33%'}} src={'backend/images/generated/' + image.filename}/>))}
            </div>
        </article>
    )
}

export default SettingsPanel

/*const startingRequest = `name of random langage of programmation. strict rule : provide only the name.`
// initiate the agents line
const agentLine = new AIAgentsLine([
    new AIAgent({name : "agentLg1", modelName : 'llama3.2:3b'}),
    new AIAgent({name : "agentLg2", modelName : 'llama3.2:3b'}),
    new AIAgent({name : "agentLg3", modelName : 'llama3.2:3b'}),
    new AIAgent({name : "agentLg4", modelName : 'llama3.2:3b'}),
])
const agentRank = new AIAgent({name : "agentRank", modelName : 'llama3.2:3b'})
const agentLove = new AIAgent({name : "agentLove", modelName : 'llama3.2:3b'})
// add the next agent as a line observer
agentLine.addObserver(agentRank)
// define the action of the agent once the line has produced a result
agentRank.onUpdate(async function (this : AIAgent, state) {
    console.log(JSON.stringify(state))
    const response = await this.ask("only reply to the question. which langage listed here is prefered by the average user : " + state)
    return response.response
})
agentRank.addObserver(agentLove)
agentLove.onUpdate(async function (this : AIAgent, state) {
    console.log(JSON.stringify(state))
    const response = await this.ask("say that you love this langage : " + state)
    console.log(response.response)
})
// ask the line to act
agentLine.update(startingRequest) // executing the whole line*/