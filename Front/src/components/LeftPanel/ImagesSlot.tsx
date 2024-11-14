/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react"
import { ImageRepository, Image } from "../../repositories/ImageRepository";

function ImagesSlot(){

  const [images, setImages] = useState<Image[]>([])

  async function handleFileSelect(e : React.ChangeEvent<HTMLInputElement>){
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]

    const allowTypes = ["image/jpeg", "image/png"]
    if (!allowTypes.includes(file.type)) return // !!! should display error message

    if (file) {
      const reader = new FileReader();
      
      reader.onload = function(e : ProgressEvent<FileReader>) {
        const dataURL = e.target?.result as string
        if(dataURL != null) {
          ImageRepository.pushImage({name : file.name, data : dataURL})
          setImages([...images, {filename : file.name, data : dataURL}])
        }
      };
      
      reader.readAsDataURL(file);
    }
  }

  return(<></>)

  return(
  <article style={{marginTop:'0.75rem'}}>
      <input onChange={handleFileSelect} type="file" />
      {
        images?.map((image, index) => (<img style={{width:'48px'}} src={image.data}/>))
      }
  </article>
  )
}

export default ImagesSlot