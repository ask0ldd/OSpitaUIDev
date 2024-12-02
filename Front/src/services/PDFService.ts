import { pdfjs } from "react-pdf";

class PDFService {

  constructor(){
    pdfjs.GlobalWorkerOptions.workerSrc = `./pdf.worker.min.mjs`;
    return this
  }

  public async convertToText(file: File | Blob | MediaSource): Promise<string>{
    let aggregatedText = ""
    let blobUrl
    let loadingTask

    try {
      blobUrl = URL.createObjectURL(file)
      loadingTask = pdfjs.getDocument(blobUrl)
      const pdf = await loadingTask.promise

      const numPages = pdf.numPages

      // Extract text from all pages
      for (let currentPageNumber = 1; currentPageNumber <= numPages; currentPageNumber++) {
        const page = await pdf.getPage(currentPageNumber)
        const textContent = await page.getTextContent()
        const pageText = textContent.items.map((item) => ("str" in item ? item.str : "")).join(" ")
        aggregatedText += pageText
      }
    } catch (error) {
      throw new Error(`Failed to extract text from the PDF. `+ error)
    } finally {
      if(blobUrl) URL.revokeObjectURL(blobUrl)
      if(loadingTask) loadingTask.destroy()
    }

    return aggregatedText
  }
}

export default PDFService