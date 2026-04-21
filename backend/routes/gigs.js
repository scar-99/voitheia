import express from 'express';
import { createGig, getGigs, getGigById, updateGig, deleteGig } from '../controllers/gigController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/', getGigs);
router.post('/', protect, createGig);
router.put('/:id', protect, updateGig);
router.delete('/:id', protect, deleteGig);
router.get('/:id', getGigById);

export default router;
