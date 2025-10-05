import { Chunk } from '../models/chunk.model.js';
import { createEmbedding } from './embedding.service.js';

export const searchSimilarChunks = async ({
  question,
  industry,
  limit = 5
}) => {
  // 1. Convert question into an embedding
  const queryEmbedding = await createEmbedding(question);

  // 2. Search MongoDB Vector Search
  const results = await Chunk.aggregate([
    {
      $vectorSearch: {
        index: 'vector_index',
        path: 'embedding',
        queryVector: queryEmbedding,
        numCandidates: 100,
        limit,
        filter: {
          industry: industry
        }
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
        score: {
          $meta: 'vectorSearchScore'
        }
      }
    }
  ]);

  return results;
};