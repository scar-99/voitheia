import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  chatId: { type: String, required: true, index: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text:   { type: String, required: true },
  read:   { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Message', messageSchema);
