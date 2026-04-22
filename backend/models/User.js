import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  email:       { type: String, required: true, unique: true, lowercase: true },
  password:    { type: String, required: true, minlength: 6 },
  avatar:      { type: String, default: '' },
  college:     { type: String, default: '' },
  bio:         { type: String, default: '' },
  phone:       { type: String, default: '' },
  upiId:       { type: String, default: '' },
  addresses: [{
    label: { type: String, enum: ['Home', 'Work', 'Other'], default: 'Home' },
    text: { type: String, required: true },
    isDefault: { type: Boolean, default: false }
  }],
  rating:      { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  wishlist:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

export default mongoose.model('User', userSchema);
