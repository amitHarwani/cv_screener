const {GoogleGenAI} = require('@google/genai');
const dotenv = require('dotenv')
dotenv.config()
let instance = null;

module.exports.getGeminiInstance = () => {
    /* Singleton instance of Gemini */
    if(instance){
        return instance
    }
    return new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY})
}