/* eslint-disable @typescript-eslint/no-unused-vars */
import { read, write, utils } from "xlsx";

class XLSXService{

    parseToString(data : ArrayBuffer /*File | Blob | MediaSource, options : ParsingOptions*/) : string{
        const workbook = read(data, { type: 'array' })
        const sheet = workbook.Sheets[workbook.SheetNames[0]]
        return JSON.stringify(utils.sheet_to_json(sheet, {header: 1}))
    }

}

export default XLSXService