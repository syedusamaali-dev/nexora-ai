import { Router } from 'express';

import {
  getChats,
  createChat,
  getChat,
  sendMessage
} from '../controllers/chat.controller.js';

const router = Router();

router.get('/', getChats);

router.post('/', createChat);

router.post('/:id/messages', sendMessage);

router.get('/:id', getChat);

export default router;