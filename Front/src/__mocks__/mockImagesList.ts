import { IImage } from "../interfaces/IImage";

export const mockImagesList = [
    {
        id : 1, 
        filename : 'gecko.png', 
        data : new Blob([new Uint8Array([
            137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82,
            0, 0, 0, 8, 0, 0, 0, 8, 8, 2, 0, 0, 0, 75, 109, 41,
            220, 0, 0, 0, 34, 73, 68, 65, 84, 8, 215, 99, 120, 173, 168,
            135, 21, 49, 0, 241, 255, 15, 90, 104, 8, 33, 129, 83, 7, 97,
            163, 136, 214, 129, 93, 2, 43, 2, 0, 181, 31, 90, 179, 225, 252,
            176, 37, 0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130
        ])], { type: "image/png" })
    },
    {
        id : 2, 
        filename : 'mouse.png', 
        data : new Blob([new Uint8Array([
            137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82,
            0, 0, 0, 8, 0, 0, 0, 8, 8, 2, 0, 0, 0, 75, 109, 41,
            220, 0, 0, 0, 34, 73, 68, 65, 84, 8, 215, 99, 248, 255, 255,
            63, 3, 3, 3, 99, 130, 226, 22, 251, 1, 68, 19, 50, 6, 0, 0,
            0, 0, 73, 69, 78, 68, 174, 66, 96, 130
          ])], { type: "image/png" })
    },
    //{id : 2, filename : 'mouse.png', data : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/6Xb9AAAABJRU5ErkJggg=='}
]

export const mockImagesList2 : IImage[] = [
    {
        $loki : 1, 
        filename : 'gecko.png', 
    },
    {
        $loki : 2, 
        filename : 'mouse.png', 
    },
    {
        $loki : 3, 
        filename : 'fox.png', 
    },
    {
        $loki : 4, 
        filename : 'bear.png', 
    },
]