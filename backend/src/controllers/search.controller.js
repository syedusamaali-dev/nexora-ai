import { searchSimilarChunks } from '../services/vector-search.service.js';

export const searchDocuments = async (req, res, next) => {
  try {
    const { question, industry } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: 'Question is required'
      });
    }

    if (!industry) {
      return res.status(400).json({
        success: false,
        message: 'Industry is required'
      });
    }

    const results = await searchSimilarChunks({
      question,
      industry,
      limit: 5
    });

    res.json({
      success: true,
      count: results.length,
      data: results
    });

  } catch (error) {
    next(error);
  }
};