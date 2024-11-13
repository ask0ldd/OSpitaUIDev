/* eslint-disable prefer-const */
import * as fs from "fs"

export class AIRAGTools{

    static splitStringToSequences(text : string, seqLength : number) : string[] {
        const words = text.split(/\s+/)
        let sequences = []
        let sequence = []
        for(let i = 0; i < words.length; i++){
            sequence.push(words[i])
            if(i == 0) continue
            if(i % seqLength == 0 || i === words.length - 1){
                sequences.push(sequence.join(" "))
                sequence = []
            }
        }
        return sequences
    }

    static splitUtf8TxtFileToSequences(filePath : string, seqLength : number = 200) : string[]{
        try{
            const file = fs.readFileSync(filePath, "utf8")
            return this.splitStringToSequences(file, seqLength)
        }catch(error: unknown){
            console.log(error)
            return []
        }
    }

}