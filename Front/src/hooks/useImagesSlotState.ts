/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useRef, useCallback } from "react"
import { Image } from "../repositories/ImageRepository";

export function useImagesSlotState() {
    // should use useSyncExternalStore instead of
    const [images, setImages] = useState<Image[]>([])
    const [hoveredImage, setHoveredImage] = useState<Image | null>(null)

    const [_, _setSelectedImgId] = useState<number>(-1)
    const selectedImgIdRef = useRef<number>(-1)
    const setSelectedImgId = useCallback((id : number) => {
        selectedImgIdRef.current = id
        _setSelectedImgId(id)
    }, [])
    return  {images, setImages, hoveredImage, setHoveredImage, setSelectedImgId, selectedImgIdRef}
}