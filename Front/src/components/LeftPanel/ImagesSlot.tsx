/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react"
import { ImageRepository, Image } from "../../repositories/ImageRepository";

function ImagesSlot({active, setActiveSlot} : IProps){

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
    <article style={{marginTop:'0.75rem', cursor:'pointer'}} onClick={() => setActiveSlot("images")}>
      <h3>IMAGES
        <svg style={{marginLeft:'auto', transform:'translateY(1px)'}} width="20" height="12" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.0603 10.9405C10.4746 11.5258 9.52543 11.5258 8.93973 10.9405L1.30462 3.31105C0.359131 2.36626 1.02826 0.75 2.36489 0.75L17.6351 0.750001C18.9717 0.750002 19.6409 2.36627 18.6954 3.31105L11.0603 10.9405Z" fill="#353535"/>
        </svg>
      </h3>
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
  setActiveSlot : React.Dispatch<React.SetStateAction<"documents" | "images">>
}