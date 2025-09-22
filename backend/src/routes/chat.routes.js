import { Router } from 'express';

import {
  getChats,
  createChat,
  getChat
} from '../controllers/chat.controller.js';

const router = Router();

router.get('/', getChats);

router.post('/', createChat);

router.get('/:id', getChat);

export default router;