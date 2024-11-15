/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react"
import { ImageRepository, Image } from "../../repositories/ImageRepository";

function ImagesSlot({active} : IProps){

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

  if(active == false) return(
    <article style={{marginTop:'0.75rem'}}>
      <h3>IMAGES<span className='nPages' style={{color:"#232323", fontWeight:'500'}}>open</span></h3>
    </article>
  )

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

interface IProps{
  active : boolean
}