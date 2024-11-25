export class ImageRepository{
    static images : Image[] = []

    static selectedImageIndex : number = -1;

    static selectedImages : Set<number> = new Set();

    // static selectedImagesData : string[]

    static pushImage(image : Image){
        this.images.push({id : image.id, filename : image.filename, data : image.data})
    }

    static getImages() : Image[]{
        return this.images;
    }

    static getImagesDatas() : string[]{
        return this.images.map(image => image.data)
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

    static getSelectedImageAsBase64() : string | undefined{
        if(this.selectedImageIndex == -1) return undefined
        return this.getImageAsBase64(this.selectedImageIndex)
    }

    static getSelectedImage() : string | undefined{
        if(this.selectedImageIndex == -1) return undefined
        return this.getImage(this.selectedImageIndex).data
    }

    static setSelectedImageId(index : number){
        this.selectedImageIndex = index
    }

    /* multiple images

    static getSelectedImagesAsBase64() : string[]{
        console.log('nSelectImages : ' + this.selectedImages.size)
        console.log(this.images.length)
        return this.images.map(image => (image.data.split(',')[1])) // .filter((image, index) => this.selectedImages.has(index))
    }

    static selectImage(index : number){
        this.selectedImages.add(index)
    }

    static deselectImage(index : number){
        this.selectedImages.delete(index)
    }

    static clearSelectedImages(){
        this.selectedImages = new Set()
    }

    static isImageSelected(index  : number)  : boolean {
        return this.selectedImages.has(index)
    }

    static isAnImageSelected() : boolean {
        return this.selectedImages.size > 0
        // return this.selectedImageIndex!= -1;
    }

    static getSelectedImagesIds() : Set<number> {
        return new Set(this.selectedImages)
    }

    end */

    static setImages(images : {id : number, name : string, data : string}[]){
        this.images = images.map(image => ({id : image.id, filename : image.name, data : image.data}));
    }

    static nImages() : number {
        return this.images.length
    }

    static deselectAllImages(){
        this.selectedImageIndex = -1
    }

}

export interface Image{
    id : number
    data : string,
    filename : string
}