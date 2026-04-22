import mongoose from 'mongoose';

const gigSchema = new mongoose.Schema({
  freelancer:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:        { type: String, required: true, trim: true },
  description:  { type: String, default: '' },
  price:        { type: Number, required: true, min: 0 },
  isNegotiable: { type: Boolean, default: false },
  deliveryDays: { type: Number, required: true, min: 1 },
  category:     {
    type: String,
    enum: ['coding', 'design', 'writing', 'tutoring', 'editing', 'photography', 'other'],
    default: 'other'
  },
  images:       [{ type: String }],
  isActive:     { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Gig', gigSchema);
