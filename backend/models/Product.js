import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  seller:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:       { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  price:       { type: Number, required: true, min: 0 },
  category:    {
    type: String,
    enum: ['books', 'electronics', 'clothing', 'hostel', 'sports', 'other'],
    default: 'other'
  },
  condition:   {
    type: String,
    enum: ['new', 'like new', 'good', 'fair'],
    default: 'good'
  },
  images:      [{ type: String }],   // Cloudinary URLs
  status:      { type: String, enum: ['available', 'sold'], default: 'available' },
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
