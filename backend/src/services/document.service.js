import fs from 'fs/promises';
import { PDFParse } from 'pdf-parse';

import { Document } from '../models/document.model.js';
import { Chunk } from '../models/chunk.model.js';
import { createEmbedding } from './embedding.service.js';

const CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 150;

const splitText = (text) => {
  const chunks = [];

  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + CHUNK_SIZE, text.length);

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
    // ---------------------------------------
    // 1. Mark document as processing
    // ---------------------------------------
    document.status = 'processing';
    document.errorMessage = null;

    await document.save();

    // ---------------------------------------
    // 2. Read PDF
    // ---------------------------------------
    const buffer = await fs.readFile(document.filePath);

    console.log(
      `Processing PDF: ${document.originalName}`
    );

    console.log(
      `PDF size: ${buffer.length} bytes`
    );

    // ---------------------------------------
    // 3. Extract PDF text
    // ---------------------------------------
    const parser = new PDFParse({
      data: buffer
    });

    const pdf = await parser.getText();

    await parser.destroy();

    console.log(
      `Extracted text length: ${pdf.text?.length || 0}`
    );

    // ---------------------------------------
    // 4. Split text into chunks
    // ---------------------------------------
    const chunks = splitText(pdf.text || '');

    console.log(
      `Created ${chunks.length} chunks`
    );

    // ---------------------------------------
    // 5. Delete previous chunks
    // ---------------------------------------
    await Chunk.deleteMany({
      documentId: document._id
    });

    // ---------------------------------------
    // 6. Generate embeddings
    // ---------------------------------------
    const chunkDocuments = [];

    for (let index = 0; index < chunks.length; index++) {
      const content = chunks[index];

      console.log(
        `Creating embedding ${index + 1}/${chunks.length}`
      );

      const embedding = await createEmbedding(content);

      console.log(
        `Embedding ${index + 1} length: ${embedding?.length || 0}`
      );

      if (!embedding || embedding.length === 0) {
        throw new Error(
          `Failed to generate embedding for chunk ${index}`
        );
      }

      chunkDocuments.push({
        documentId: document._id,
        industry: document.industry,
        content,
        page: null,
        chunkIndex: index,
        embedding
      });
    }

    // ---------------------------------------
    // 7. Save chunks + embeddings
    // ---------------------------------------
    if (chunkDocuments.length > 0) {
      await Chunk.insertMany(chunkDocuments);
    }

    console.log(
      `Saved ${chunkDocuments.length} chunks with embeddings`
    );

    // ---------------------------------------
    // 8. Update document
    // ---------------------------------------
    document.pages = 0;
    document.chunks = chunks.length;
    document.status = 'ready';
    document.errorMessage = null;

    await document.save();

    console.log(
      `Document processing completed: ${document._id}`
    );

    return document;

  } catch (error) {

    console.error(
      `Document processing failed: ${error.message}`
    );

    document.status = 'failed';
    document.errorMessage = error.message;

    await document.save();

    throw error;
  }
};