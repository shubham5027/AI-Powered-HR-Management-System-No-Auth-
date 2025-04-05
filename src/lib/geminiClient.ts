// lib/geminiClient.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = 'AIzaSyBCstuceBv_TMCB3Xhf9M7GL-brZCyDaNE';

if (!apiKey) {
  throw new Error('Google Gemini API key is missing.');
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

export const getGeminiResponse = async (prompt: string) => {
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    return '⚠️ Sorry, something went wrong generating the response.';
  }
};
