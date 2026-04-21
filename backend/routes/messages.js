import express from 'express';
import { getChatHistory, getMyChats } from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/', protect, getMyChats);
router.get('/:chatId', protect, getChatHistory);

export default router;
