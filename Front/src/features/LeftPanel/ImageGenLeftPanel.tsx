/* eslint-disable @typescript-eslint/no-unused-vars */
import './LeftPanel3.css'
import './ImageGenLeftPanel.css'
import ollama from '../../assets/Ollama3.png'
import { useRef, useState, useEffect } from 'react'
import { useServices } from '../../hooks/useServices'
import { IImage } from '../../interfaces/IImage'

function ImageGenLeftPanel() {
    
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

    function handleMouseOverPicture(index : number){
        setHoveredImage(images[index] ?? null)
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

    return(
        <aside className="leftDrawer">
            <figure style={{cursor:'pointer'}} onClick={() => location.reload()}><span>OSSPITA FOR</span> <img src={ollama}/></figure>
            <article>
                <h3>
                    GALLERY
                </h3>
                <div className='galleryContainer'>
                    {images.map((image : IImage, index : number) => (<img onClick={handleDownloadClick} onMouseEnter={() => handleMouseOverPicture(index)} onMouseOut={() => setHoveredImage(null)} key={index + "-comfyimg"} src={'backend/images/generated/' + image.filename}/>))}
                </div>
            </article>
        </aside>
    )
}

export default ImageGenLeftPanel