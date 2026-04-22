import Gig from '../models/Gig.js';
import User from '../models/User.js';
import cloudinary from '../config/cloudinary.js';

export const createGig = async (req, res) => {
  try {
    const { title, description, price, isNegotiable, deliveryDays, category, images } = req.body;
    if (!title || !price || !deliveryDays)
      return res.status(400).json({ message: 'Title, price, deliveryDays are required' });

    const user = await User.findById(req.user._id);
    if (!user.upiId) {
      return res.status(400).json({ message: 'A UPI ID is mandatory before listing a gig. Please update your profile settings.' });
    }

    let imageUrls = [];
    if (images && images.length > 0) {
      const uploads = await Promise.all(
        images.map(img => cloudinary.uploader.upload(img, { folder: 'voitheia/gigs' }))
      );
      imageUrls = uploads.map(r => r.secure_url);
    }

    const gig = await Gig.create({
      freelancer: req.user._id, title, description,
      price, isNegotiable, deliveryDays, category, images: imageUrls,
    });

    res.status(201).json(gig);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getGigs = async (req, res) => {
  try {
    const { keyword, category, sort } = req.query;
    const query = { isActive: true };

    if (keyword) query.title = { $regex: keyword, $options: 'i' };
    if (category) query.category = category;

    const sortOptions = { newest: '-createdAt', price_asc: 'price', price_desc: '-price' };

    const gigs = await Gig.find(query)
      .sort(sortOptions[sort] || '-createdAt')
      .populate('freelancer', 'name avatar rating reviewCount college');

    res.json(gigs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getGigById = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id)
      .populate('freelancer', 'name avatar rating reviewCount college bio');
    if (!gig) return res.status(404).json({ message: 'Gig not found' });
    res.json(gig);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateGig = async (req, res) => {
  try {
    const gig = await Gig.findOneAndUpdate(
      { _id: req.params.id, freelancer: req.user._id },
      req.body,
      { new: true }
    );
    if (!gig) return res.status(404).json({ message: 'Not found or not yours' });
    res.json(gig);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteGig = async (req, res) => {
  try {
    await Gig.findOneAndDelete({ _id: req.params.id, freelancer: req.user._id });
    res.json({ message: 'Gig deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
