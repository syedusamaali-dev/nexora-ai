import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
  
},
console.log(
  'Gemini key loaded:',
  Boolean(process.env.GEMINI_API_KEY),
  process.env.GEMINI_API_KEY?.slice(0, 8)
));

export const createEmbedding = async (text) => {
  const response = await ai.models.embedContent({
    model: 'gemini-embedding-001',
    contents: text
  });

  return response.embeddings[0].values;
  console.log(
  'Gemini key loaded:',
  Boolean(process.env.GEMINI_API_KEY),
  process.env.GEMINI_API_KEY?.slice(0, 8)
);
};