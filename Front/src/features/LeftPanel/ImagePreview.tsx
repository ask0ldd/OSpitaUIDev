function ImagePreview({imageSrc} : {imageSrc : string}){
    return(
        <div>
            <img className="previewImage" src={imageSrc} alt="preview"/>
        </div>
    )
}

export default ImagePreview;