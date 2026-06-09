const {PDFParse} = require('pdf-parse')
const {z} = require("zod")
const mammoth = require('mammoth')
const path = require('path');
const fs = require("fs/promises")
const { getGeminiInstance } = require('./llm.js');
module.exports.extractCVText = async (fileType, buffer) => {
    /* Extract CV text depending on the file type */
    if (fileType.includes('pdf')) {
        const parser = new PDFParse({data: buffer})
        const data = await parser.getText();
        return data.text;
    } 
    else if (fileType.includes('officedocument')) {
        const data = await mammoth.extractRawText(buffer);
        return data.value;
    }
    else {
        throw new Error("Unsupported file format. Please upload a PDF or DOCX file.");
    }
}

module.exports.streamToBuffer = async (stream) => {
    /* Convert stream to buffer list */
    return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(chunks)));
        stream.on('error', reject);
    });
};

module.exports.saveFileLocally = async (candidateId, buffer, fileType) => {
    /* Saving the file locally, in local_cv_store directory */
    const uploadDir = path.join(process.cwd(), 'local_cv_store')

    await fs.mkdir(uploadDir, {recursive: true})

    const extension = fileType.includes("pdf") ? "pdf" : "docx"
    const fileName = `${candidateId}-CV.${extension}`;
    const filePath = path.join(uploadDir, fileName)

    /* Deleting old CV files of this candidate */
    await fs.rm(path.join(uploadDir,`${candidateId}-CV.pdf`), {force: true})
    await fs.rm(path.join(uploadDir,`${candidateId}-CV.docx`), {force: true})
    
    await fs.writeFile(filePath, buffer)

    return fileName
}

/* Response Schema to validate LLM Response */
const LLM_CV_RESPONSE_SCHEMA = z.object({
    FullName: z.string().default(""),
    Email: z.string().default(""),
    Phone: z.string().default(""),
    Skills: z.string().default(""),
    YearsOfExperience: z.number().int().default(0),
    CurrentRole: z.string().default(""),
    AISummary: z.string().default("")
})
module.exports.analyzeCV = async(cvText, maxRetries = 2) => {
    const gemini = getGeminiInstance()
    const prompt = `
    Extract the following details from the provided CV text.
    If a field is not found, return its default type: Empty String for Strings and 0 for number. 
    Return the result strictly using this JSON schema:
        {
            "FullName": "string",
            "Email": "string",
            "Phone": "string",
            "Skills": "string (comma separated list)",
            "YearsOfExperience": number,
            "CurrentRole": "string",
            "AISummary": "string (a brief 2-3 sentence summary of the candidate's profile, their strengths and Suggested Role For the candidate)"
        }
        
        CV Text:
        ${cvText}
    `
    /* Try upto <maxRetries> */
    for(let attempt = 1; attempt <= maxRetries; attempt++){
        try{
            const response = await gemini.models.generateContent({
                model: process.env.GEMINI_MODEL,
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseJsonSchema: z.toJSONSchema(LLM_CV_RESPONSE_SCHEMA)
                }
            })
            const parsedJSON = JSON.parse(response.text)
            const validatedData = LLM_CV_RESPONSE_SCHEMA.parse(parsedJSON)
            return validatedData
        }
        catch(error){
            console.warn(`LLM Call Failed: ${error}`)
            if(attempt == maxRetries){
                throw new Error(`Analyzing CV Failed`)
            }
        }
    }
}
