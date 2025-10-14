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

router.get('/:id', getChat);

router.post('/:id/messages', sendMessage);

export default router;