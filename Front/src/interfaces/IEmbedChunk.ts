export default interface IEmbedChunkedDoc{
    text : string
    embeddings : number[]
    metadatas : IDocMetadatas
}

interface IDocMetadatas {
    filename : string
    filesize : number
}