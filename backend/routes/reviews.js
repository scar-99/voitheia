import express from 'express';

const router = express.Router();

// Reviews are created via orderController.addReview
// Get reviews for a user (optional endpoint for dashboard)
router.get('/:userId', async (req, res) => {
  // Implementation for getting reviews for a specific user
  res.json({ message: 'Get reviews endpoint' });
});

export default router;
