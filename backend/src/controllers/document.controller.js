import { Document } from '../models/document.model.js';

export const getDocuments = async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.industry) {
      filter.industry = req.query.industry;
    }

    if (req.query.category) {
      filter.category = req.query.category;
    }

    const documents = await Document
      .find(filter)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: documents.length,
      data: documents
    });

  } catch (error) {
    next(error);
  }
};

export const getDocument = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    res.json({
      success: true,
      data: document
    });

  } catch (error) {
    next(error);
  }
};

export const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'PDF file is required'
      });
    }

    const { industry, category } = req.body;

    if (!industry || !category) {
      return res.status(400).json({
        success: false,
        message: 'Industry and category are required'
      });
    }

    const document = await Document.create({
      name: req.file.originalname.replace(/\.pdf$/i, ''),
      originalName: req.file.originalname,
      industry,
      category,
      filePath: req.file.path,
      mimeType: req.file.mimetype,
      size: req.file.size,
      status: 'uploaded'
    });

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      data: document
    });

  } catch (error) {
    next(error);
  }
};

export const deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findByIdAndDelete(
      req.params.id
    );

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    res.json({
      success: true,
      message: 'Document deleted successfully'
    });

  } catch (error) {
    next(error);
  }
};