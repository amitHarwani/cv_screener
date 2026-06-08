import cds from "@sap/cds"
import {Readable} from "stream"
import { analyzeCV, extractCVText, saveFileLocally, streamToBuffer } from "./utils/cvutils.js";


export default class CVService extends cds.ApplicationService {
    init() {
        const {SELECT, UPDATE} = cds.ql

        this.on('UPDATE', '*', async (req, next) => {
            if(!req.data.Content){
                return next() // Normal Update 
            }
            // CV Upload Section
            try{
                const candidateID = req.data.ID
                const Candidates = req.target
                const candidateRecord = await SELECT.one.from(Candidates).where({ID: candidateID})
                if(!candidateRecord){
                    return req.reject("Candidate Not Found")
                }
                const fileType = req.data.FileType
                const fileBuffer = await streamToBuffer(req.data.Content);

                const savedFileName = await saveFileLocally(candidateID, fileBuffer, fileType)

                const cvText = await extractCVText(fileType, fileBuffer)
                
                const extractedData = await analyzeCV(cvText)

                await UPDATE(Candidates).set({
                    ...extractedData,
                    CVText: cvText,
                    FileName: savedFileName,
                    FileType: fileType
                }).where({ID: candidateID})
                
                return extractedData
            }
            catch(error){
                console.error(`Error Screening CV`, error)
                return req.reject(500, `Error Screening CV: ${error}`)
            }
        })
        return super.init()
    }
}

