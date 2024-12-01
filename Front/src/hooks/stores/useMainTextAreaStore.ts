/* eslint-disable @typescript-eslint/no-unused-vars */
import { createRef } from "react";
import { create } from "zustand";

export const useMainTextAreaStore = create<TextAreaState>((set, get) => ({
    textareaValue : "",
    textareaRef : createRef(),
    clearTextareaValue : () => set({ textareaValue: "" }),
    setTextareaValue : text => set({ textareaValue: text }),
}));

export interface TextAreaState {
    textareaValue : string
    textareaRef : React.RefObject<HTMLTextAreaElement>
    clearTextareaValue : () => void
    setTextareaValue : (text : string) => void
}