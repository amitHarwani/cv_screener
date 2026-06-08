import {GoogleGenAI} from '@google/genai';
import dotenv from 'dotenv'
dotenv.config()
let instance = null;

export const getGeminiInstance = () => {
    /* Singleton instance of Gemini */
    if(instance){
        return instance
    }
    return new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY})
}