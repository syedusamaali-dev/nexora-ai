import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

export const createEmbedding = async (text) => {
  const response = await ai.models.embedContent({
    model: process.env.GEMINI_EMBEDDING_MODEL || 'gemini-embedding-001',
    contents: text
  });

  return response.embeddings[0].values;
};