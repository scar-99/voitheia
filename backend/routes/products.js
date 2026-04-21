import express from 'express';
import {
  createProduct, getProducts, getProductById,
  updateProduct, deleteProduct, markSold, toggleWishlist
} from '../controllers/productController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/', getProducts);
router.post('/', protect, createProduct);
router.patch('/:id/sold', protect, markSold);
router.patch('/:id/wishlist', protect, toggleWishlist);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);
router.get('/:id', getProductById);

export default router;
