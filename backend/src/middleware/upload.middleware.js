import { Router } from 'express';

import {
  getDocuments,
  getDocument,
  uploadDocument,
  deleteDocument
} from '../controllers/document.controller.js';

import { upload } from '../middleware/upload.middleware.js';

const router = Router();

router.get('/', getDocuments);

router.get('/:id', getDocument);

router.post(
  '/',
  upload.single('file'),
  uploadDocument
);

router.delete('/:id', deleteDocument);

export default router;