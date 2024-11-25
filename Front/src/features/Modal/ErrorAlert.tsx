export default function ErrorAlert({errorMessage} : {errorMessage : string}){
    return(
        <div style={{margin:'0 auto', padding : '1.5rem 0'}}>
            Error : {errorMessage}
        </div>
    )
}