import Product from '../models/Product.js';
import User from '../models/User.js';
import cloudinary from '../config/cloudinary.js';

export const createProduct = async (req, res) => {
  try {
    const { title, description, price, isNegotiable, category, condition, images } = req.body;
    if (!title || !price)
      return res.status(400).json({ message: 'Title and price are required' });

    const user = await User.findById(req.user._id);
    if (!user.upiId) {
      return res.status(400).json({ message: 'A UPI ID is mandatory before listing a product. Please update your profile settings.' });
    }

    let imageUrls = [];
    if (images && images.length > 0) {
      const uploads = await Promise.all(
        images.map(img =>
          cloudinary.uploader.upload(img, { folder: 'voitheia/products', resource_type: 'image' })
        )
      );
      imageUrls = uploads.map(r => r.secure_url);
    }

    const product = await Product.create({
      seller: req.user._id, title, description,
      price, isNegotiable, category, condition, images: imageUrls,
    });

    res.status(201).json(product);
  } catch (err) {
    console.error('❌ Create Product Error:', err);
    res.status(500).json({ message: err.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const { keyword, category, minPrice, maxPrice, sort, status } = req.query;
    const query = { status: status || 'available' };

    if (keyword) query.title = { $regex: keyword, $options: 'i' };
    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const sortOptions = {
      newest:     '-createdAt',
      oldest:     'createdAt',
      price_asc:  'price',
      price_desc: '-price',
    };

    const products = await Product.find(query)
      .sort(sortOptions[sort] || '-createdAt')
      .populate('seller', 'name avatar rating reviewCount college');

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('seller', 'name avatar rating reviewCount college bio');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, seller: req.user._id },
      req.body,
      { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found or not yours' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, seller: req.user._id });
    if (!product) return res.status(404).json({ message: 'Product not found or not yours' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const markSold = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, seller: req.user._id },
      { status: 'sold' },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Not found or not yours' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const toggleWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const pid = req.params.id;
    const idx = user.wishlist.indexOf(pid);
    if (idx === -1) user.wishlist.push(pid);
    else user.wishlist.splice(idx, 1);
    await user.save();
    res.json({ wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
