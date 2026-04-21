import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  type:    { type: String, enum: ['product', 'gig'], required: true },
  gig:     { type: mongoose.Schema.Types.ObjectId, ref: 'Gig' },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  buyer:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seller:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  price:   { type: Number, required: true },
  note:    { type: String, default: '' },
  status:  {
    type: String,
    enum: ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
