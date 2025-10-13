import { GoogleGenAI } from '@google/genai';
import { searchSimilarChunks } from './vector-search.service.js';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const MODEL =
  process.env.GEMINI_MODEL || 'gemini-2.5-flash';

export const generateRagAnswer = async ({
  question,
  industry
}) => {

  // 1. Retrieve relevant chunks
  const chunks = await searchSimilarChunks({
    question,
    industry,
    limit: 5
  });

  if (!chunks.length) {
    return {
      answer:
        "I couldn't find relevant information in the uploaded knowledge base.",
      sources: []
    };
  }

  // 2. Build context
  const context = chunks
    .map((chunk, index) => `
SOURCE ${index + 1}
Document: ${chunk.documentName || 'Unknown document'}
Chunk: ${chunk.chunkIndex}

Content:
${chunk.content}
`)
    .join('\n--------------------\n');

  // 3. Industry instructions
  const industryInstruction =
    industry === 'healthcare'
      ? `
You are Nexora AI's healthcare knowledge assistant.

Answer ONLY using the provided sources.

Do not invent medical facts.
Do not diagnose patients.
Do not prescribe medication.
Do not present the response as a substitute for a qualified healthcare professional.

If the sources do not contain enough information, clearly say so.
`
      : `
You are Nexora AI's finance knowledge assistant.

Answer ONLY using the provided sources.

Do not invent financial facts.
Do not provide personalized investment advice.

If the sources do not contain enough information, clearly say so.
`;

  // 4. Prompt
  const prompt = `
${industryInstruction}

Answer the user's question using the retrieved knowledge.

USER QUESTION:
${question}

RETRIEVED KNOWLEDGE:
${context}

Rules:
- Use only the retrieved knowledge.
- Be concise and useful.
- Do not make up information.
- If the answer cannot be found in the sources, say so.
`;

  // 5. Generate answer
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt
  });

  const answer =
    response.text ||
    'I could not generate an answer from the available sources.';

  // 6. Prepare sources
  const sources = chunks.map((chunk) => ({
    documentId: chunk.documentId,
    documentName:
      chunk.documentName || 'Knowledge document',
    page: chunk.page ?? null,
    chunkIndex: chunk.chunkIndex,
    score: chunk.score
  }));

  return {
    answer,
    sources
  };
};