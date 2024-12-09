import React from "react";

function ImagesFooter({images} : {images : string[]}){
    return(
        <>
            <hr style={{opacity:0.3, margin:'0.65rem 0 0.3rem 0'}}/>
            <div style={{display:'flex', flexDirection:'row', columnGap:'0.5rem'}}>
                {images.map(image => (<img src={`/backend/images/${image}`} style={{margin:'0.5rem 0 0 0', width:'50px', border:'1px solid var(--input-border-color)'}}/>))}
            </div>
        </>
    )
}

export default React.memo(ImagesFooter, (prevProps, nextProps) => {
    return JSON.stringify(prevProps.images) === JSON.stringify(nextProps.images);
})