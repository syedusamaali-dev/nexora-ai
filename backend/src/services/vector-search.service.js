import { Chunk } from '../models/chunk.model.js';
import { createEmbedding } from './embedding.service.js';

export const searchSimilarChunks = async ({
  question,
  industry,
  limit = 5
}) => {

  // ---------------------------------------
  // 1. Create embedding for question
  // ---------------------------------------

  const queryEmbedding = await createEmbedding(question);

  // ---------------------------------------
  // 2. Vector search
  // ---------------------------------------

  const results = await Chunk.aggregate([
    {
      $vectorSearch: {
        index: 'vector_index',
        path: 'embedding',
        queryVector: queryEmbedding,
        numCandidates: 100,
        limit,
        filter: {
          industry
        }
      }
    },

    // Get document information
    {
      $lookup: {
        from: 'documents',
        localField: 'documentId',
        foreignField: '_id',
        as: 'document'
      }
    },

    {
      $unwind: {
        path: '$document',
        preserveNullAndEmptyArrays: true
      }
    },

    {
      $project: {
        _id: 1,
        documentId: 1,
        industry: 1,
        content: 1,
        page: 1,
        chunkIndex: 1,

        documentName: '$document.originalName',

        score: {
          $meta: 'vectorSearchScore'
        }
      }
    }
  ]);

  return results;
};