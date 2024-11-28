/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useRef, useCallback } from "react"
import { Image, ImageRepository } from "../repositories/ImageRepository";

export function useImagesSlotState() {
    // should use useSyncExternalStore instead of
    const [images, setImages] = useState<Image[]>([])
    const [hoveredImage, setHoveredImage] = useState<Image | null>(null)

    const [selectedImgsIds, _setSelectedImgsIds] = useState<Set<number>>(new Set())
    const selectedImgsIdsRef = useRef<Set<number>>(new Set())

    function toggleImageWithId(id : number) : void 
    {
        const  newSelectedImgsIds = new Set([...selectedImgsIds])
        if(newSelectedImgsIds.has(id)){
            newSelectedImgsIds.delete(id)
            ImageRepository.deselectImage(id)
        }else{
            newSelectedImgsIds.add(id)
            ImageRepository.selectImage(id)
        }
        selectedImgsIdsRef.current = newSelectedImgsIds
        _setSelectedImgsIds(newSelectedImgsIds)
    }

    function deselectAllImages() : void {
        ImageRepository.deselectAllImages()
        selectedImgsIdsRef.current = new Set()
        _setSelectedImgsIds(new Set())
    }

    function deleteSelectedImages() : void {
        selectedImgsIdsRef.current.forEach(imageId => ImageRepository.deleteImage(imageId))
        const notSelectedImages = images.filter((_, index) => !selectedImgsIdsRef.current.has(index))
        setImages(notSelectedImages)
        deselectAllImages()
    }

    return  {images, setImages, hoveredImage, setHoveredImage, toggleImageWithId, selectedImgsIdsRef, deselectAllImages, deleteSelectedImages}
}

/*const setSelectedImgsIds = useCallback((ids : Set<number>) => {
    selectedImgsIdsRef.current = new Set([...ids])
    _setSelectedImgsIds(new Set([...ids]))
}, [])*/

/*const [_, _setSelectedImgId] = useState<number>(-1)
const selectedImgIdRef = useRef<number>(-1)
const setSelectedImgId = useCallback((id : number) => {
    selectedImgIdRef.current = id
    _setSelectedImgId(id)
}, [])*/