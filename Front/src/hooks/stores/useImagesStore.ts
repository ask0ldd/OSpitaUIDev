/* eslint-disable @typescript-eslint/no-unused-vars */
import { IImage } from "../../interfaces/IImage";
import { create } from "zustand";

export const useImagesStore = create<ImagesState>((set, get) => ({
    images: [],
    selectedImagesIds : new Set(),
    hoveredImage : null,
    pushImage : (image : IImage) => set((state : ImagesState) => ({ images: [...state.images, image] })),
    setImages : (images : IImage[]) => set((_) => ({ images: [...images] })),
    clearImages  : () => set((_) => ({ images: [] })),
    deselectAllImages: () => set((_) => ({ selectedImagesIds: new Set() })),
    /*deleteSelectedImages: () => set((state: ImagesState) => ({
        images: state.images.filter((_, index) => !state.selectedImagesIds.has(index)),
        selectedImagesIds: new Set()
    })),*/
    toggleImageWithId : (id: number) => set((state) => {
        const newSelectedImagesIds = new Set(state.selectedImagesIds);
        if (newSelectedImagesIds.has(id)) {
          newSelectedImagesIds.delete(id);
        } else {
          newSelectedImagesIds.add(id);
        }
        return { selectedImagesIds: newSelectedImagesIds };
    }),
    setHoveredImage : (image : IImage | null) => set({ hoveredImage: image }),
    clearHoveredImage  : () => set({ hoveredImage: null }),
    getSelectedImages : () => get().images.filter((_, index) => get().selectedImagesIds.has(index))
}));

export interface ImagesState {
    images : IImage[]
    hoveredImage : IImage | null
    selectedImagesIds : Set<number>
    deselectAllImages: () => void
    // deleteSelectedImages: () => void
    toggleImageWithId : (id : number) => void
    pushImage : (image : IImage) => void
    setImages : (images : IImage[]) => void
    clearImages   : () => void
    setHoveredImage : (image  : IImage | null ) => void
    clearHoveredImage   : () => void
    getSelectedImages : () => IImage[]
}