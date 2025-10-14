import { Chat } from '../models/chat.model.js';
import { generateRagAnswer } from '../services/rag.service.js';

export const getChats = async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.industry) {
      filter.industry = req.query.industry;
    }

    const chats = await Chat
      .find(filter)
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      data: chats
    });

  } catch (error) {
    next(error);
  }
};


export const createChat = async (req, res, next) => {
  try {
    const { industry, title } = req.body;

    if (!industry) {
      return res.status(400).json({
        success: false,
        message: 'Industry is required'
      });
    }

    const chat = await Chat.create({
      industry,
      title: title || 'New Conversation',
      messages: []
    });

    res.status(201).json({
      success: true,
      data: chat
    });

  } catch (error) {
    next(error);
  }
};


export const getChat = async (req, res, next) => {
  try {
    const chat = await Chat.findById(req.params.id);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    res.json({
      success: true,
      data: chat
    });

  } catch (error) {
    next(error);
  }
};


export const sendMessage = async (req, res, next) => {
  try {
    const { question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Question is required'
      });
    }

    const chat = await Chat.findById(req.params.id);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Save user message
    chat.messages.push({
      role: 'user',
      content: question.trim()
    });

    // RAG
    const result = await generateRagAnswer({
      question: question.trim(),
      industry: chat.industry
    });

    // Save assistant response
    chat.messages.push({
      role: 'assistant',
      content: result.answer,
      sources: result.sources
    });

    // Automatically name conversation
    if (
      !chat.title ||
      chat.title === 'New Conversation'
    ) {
      chat.title = question.trim().slice(0, 60);
    }

    await chat.save();

    res.json({
      success: true,
      data: {
        answer: result.answer,
        sources: result.sources,
        chat
      }
    });

  } catch (error) {
    next(error);
  }
};