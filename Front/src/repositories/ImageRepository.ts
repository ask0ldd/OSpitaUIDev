export class ImageRepository{
    static images : Image[] = []

    static pushImage(image : {name : string, data : string}){
        this.images.push({filename : image.name, data : image.data})
    }

    static getImages() : Image[]{
        return this.images;
    }

    static getImagesAsBase64() : string[]{
        return this.images.map(image => image.data.split(',')[1]);
    }

    static clearImages(){
        this.images = []
    }

    static deleteImage(index : number){
        this.images.splice(index,1);
    }

    static getImage(index : number) : Image{
        return this.images[index];
    }

    static getImageAsBase64(index : number) : string{
        return this.images[index].data.split(',')[1]
    }

    static setImages(images : {name : string, data : string}[]){
        this.images = images.map(image => ({filename : image.name, data : image.data}));
    }

    static getLength() : number {
        return this.images.length
    }
}

export interface Image{
    data : string,
    filename : string
}