/* eslint-disable @typescript-eslint/no-unused-vars */
import { Image } from "../../interfaces/IImage";
import { create } from "zustand";

export const useImagesStore = create<ImagesState>((set) => ({
    images: [],
    selectedImagesIds : new Set(),
    hoveredImage : null,
    pushImage : (image : Image) => set((state : ImagesState) => ({ images: [...state.images, image] })),
    clearImages  : () => set((state : ImagesState) => ({ images: [] })),
    deselectAllImages: () => set((state : ImagesState) => ({ selectedImagesIds: new Set() })),
    deleteSelectedImages: () => set((state: ImagesState) => ({
        images: state.images.filter((_, index) => !state.selectedImagesIds.has(index)),
        selectedImagesIds: new Set()
    })),
    toggleImageWithId : (id: number) => set((state) => {
        const newSelectedImagesIds = new Set(state.selectedImagesIds);
        if (newSelectedImagesIds.has(id)) {
          newSelectedImagesIds.delete(id);
        } else {
          newSelectedImagesIds.add(id);
        }
        return { selectedImagesIds: newSelectedImagesIds };
    }),
    setHoveredImage : (image : Image | null) => set({ hoveredImage: image }),
    clearHoveredImage  : () => set({ hoveredImage: null }),
}));

export interface ImagesState {
    images : Image[]
    hoveredImage : Image | null
    selectedImagesIds : Set<number>
    deselectAllImages: () => void
    deleteSelectedImages: () => void
    toggleImageWithId : (id : number) => void
    pushImage : (image : Image) => void
    clearImages   : () => void
    setHoveredImage : (image  : Image | null ) => void
    clearHoveredImage   : () => void
}