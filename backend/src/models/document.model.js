import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    originalName: {
      type: String,
      required: true
    },

    industry: {
      type: String,
      enum: ['healthcare', 'finance'],
      required: true,
      index: true
    },

    category: {
      type: String,
      required: true
    },

    filePath: {
      type: String,
      required: true
    },

    mimeType: {
      type: String,
      required: true
    },

    size: {
      type: Number,
      required: true
    },

    pages: {
      type: Number,
      default: 0
    },

    chunks: {
      type: Number,
      default: 0
    },

    status: {
      type: String,
      enum: [
        'uploaded',
        'processing',
        'ready',
        'failed'
      ],
      default: 'uploaded',
      index: true
    },

    errorMessage: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

export const Document = mongoose.model(
  'Document',
  documentSchema
);