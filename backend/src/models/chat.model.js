import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true
    },

    content: {
      type: String,
      required: true
    },

    sources: [
      {
        documentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Document'
        },

        documentName: String,

        page: Number
      }
    ]
  },
  {
    _id: false
  }
);

const chatSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: 'New Conversation'
    },

    industry: {
      type: String,
      enum: ['healthcare', 'finance'],
      required: true
    },

    messages: [messageSchema]
  },
  {
    timestamps: true
  }
);

export const Chat = mongoose.model(
  'Chat',
  chatSchema
);