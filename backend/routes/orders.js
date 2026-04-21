import express from 'express';
import {
  createOrder, getMyOrders, getOrderById,
  updateOrderStatus, addReview, getUserReviews
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.post('/', protect, createOrder);
router.get('/', protect, getMyOrders);
router.patch('/:id/status', protect, updateOrderStatus);
router.post('/review', protect, addReview);
router.get('/reviews/:userId', getUserReviews);
router.get('/:id', protect, getOrderById);

export default router;
