import fs from 'fs/promises';
import pdfParse from 'pdf-parse';

import { Document } from '../models/document.model.js';
import { Chunk } from '../models/chunk.model.js';

const CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 150;

const splitText = (text) => {
  const chunks = [];

  let start = 0;

  while (start < text.length) {
    const end = Math.min(
      start + CHUNK_SIZE,
      text.length
    );

    const chunk = text.slice(start, end).trim();

    if (chunk.length > 0) {
      chunks.push(chunk);
    }

    start += CHUNK_SIZE - CHUNK_OVERLAP;
  }

  return chunks;
};

export const processDocument = async (documentId) => {
  const document = await Document.findById(documentId);

  if (!document) {
    throw new Error('Document not found');
  }

  try {
    document.status = 'processing';
    await document.save();

    const buffer = await fs.readFile(document.filePath);

    const pdf = await pdfParse(buffer);

    const chunks = splitText(pdf.text);

    await Chunk.deleteMany({
      documentId: document._id
    });

    const chunkDocuments = chunks.map((content, index) => ({
      documentId: document._id,
      industry: document.industry,
      content,
      page: null,
      chunkIndex: index
    }));

    if (chunkDocuments.length > 0) {
      await Chunk.insertMany(chunkDocuments);
    }

    document.pages = pdf.numpages;
    document.chunks = chunks.length;
    document.status = 'ready';
    document.errorMessage = null;

    await document.save();

    return document;

  } catch (error) {
    document.status = 'failed';
    document.errorMessage = error.message;

    await document.save();

    throw error;
  }
};