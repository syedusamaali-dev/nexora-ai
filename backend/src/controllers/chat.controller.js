import { Chat } from '../models/chat.model.js';

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