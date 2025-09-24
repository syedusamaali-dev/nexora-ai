import mongoose from 'mongoose';

const chunkSchema = new mongoose.Schema(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      required: true,
      index: true
    },

    industry: {
      type: String,
      enum: ['healthcare', 'finance'],
      required: true,
      index: true
    },

    content: {
      type: String,
      required: true
    },

    page: {
      type: Number,
      default: null
    },

    chunkIndex: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export const Chunk = mongoose.model('Chunk', chunkSchema);