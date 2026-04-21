import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reviewee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  order:    { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  rating:   { type: Number, min: 1, max: 5, required: true },
  comment:  { type: String, default: '' },
}, { timestamps: true });

// One review per order
reviewSchema.index({ reviewer: 1, order: 1 }, { unique: true });

export default mongoose.model('Review', reviewSchema);
