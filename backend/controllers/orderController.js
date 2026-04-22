import Order from '../models/Order.js';
import Review from '../models/Review.js';
import User from '../models/User.js';

export const createOrder = async (req, res) => {
  try {
    const { type, gigId, productId, sellerId, price, note, deliveryAddress, paymentMethod } = req.body;
    if (!type || !sellerId || !price || !paymentMethod)
      return res.status(400).json({ message: 'type, sellerId, price, and paymentMethod required' });

    const order = await Order.create({
      type,
      gig:     gigId     || undefined,
      product: productId || undefined,
      buyer:   req.user._id,
      seller:  sellerId,
      price,
      deliveryAddress,
      paymentMethod,
      note,
    });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const { role } = req.query;
    const filter = role === 'seller'
      ? { seller: req.user._id }
      : { buyer: req.user._id };

    const orders = await Order.find(filter)
      .sort('-createdAt')
      .populate('gig', 'title price')
      .populate('product', 'title price images')
      .populate('buyer', 'name avatar email phone')
      .populate('seller', 'name avatar email phone');

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('gig product')
      .populate('buyer', 'name avatar email phone')
      .populate('seller', 'name avatar email phone');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    const isParty = [order.buyer._id, order.seller._id]
      .some(id => id.toString() === req.user._id.toString());
    if (!isParty) return res.status(403).json({ message: 'Not authorized' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const isSeller = order.seller.toString() === req.user._id.toString();
    const isBuyer  = order.buyer.toString()  === req.user._id.toString();

    const allowed = {
      accepted:    isSeller,
      in_progress: isSeller,
      completed:   isBuyer || isSeller,
      cancelled:   isBuyer || isSeller,
    };

    if (!allowed[status])
      return res.status(403).json({ message: 'Not allowed to set this status' });

    order.status = status;
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addReview = async (req, res) => {
  try {
    const { orderId, revieweeId, rating, comment } = req.body;
    const order = await Order.findById(orderId);
    if (!order || order.status !== 'completed')
      return res.status(400).json({ message: 'Can only review completed orders' });

    const review = await Review.create({
      reviewer: req.user._id,
      reviewee: revieweeId,
      order: orderId,
      rating,
      comment,
    });

    const allReviews = await Review.find({ reviewee: revieweeId });
    const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await User.findByIdAndUpdate(revieweeId, {
      rating: Math.round(avg * 10) / 10,
      reviewCount: allReviews.length,
    });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserReviews = async (req, res) => {
  const reviews = await Review.find({ reviewee: req.params.userId })
    .sort('-createdAt')
    .populate('reviewer', 'name avatar');
  res.json(reviews);
};
