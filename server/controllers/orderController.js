const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  // Verify stock availability and update stock
  for (let item of orderItems) {
    const product = await Product.findById(item.product);
    
    if (!product) {
      res.status(404);
      throw new Error(`Product not found: ${item.name}`);
    }

    if (product.stock < item.quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for ${product.name}`);
    }

    // Reduce stock
    product.stock -= item.quantity;
    product.inStock = product.stock > 0;
    await product.save();
  }

  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  res.status(201).json({
    success: true,
    data: order,
  });
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email')
    .populate('orderItems.product', 'name price');

  if (order) {
    // Check if order belongs to user or user is admin
    if (order.user._id.toString() === req.user._id.toString() || req.user.role === 'admin') {
      res.json({
        success: true,
        data: order,
      });
    } else {
      res.status(403);
      throw new Error('Not authorized to view this order');
    }
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/user/myorders
// @access  Private
const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

  res.json({
    success: true,
    data: orders,
  });
});

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate('user', 'name email')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: orders,
  });
});

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.orderStatus = req.body.orderStatus || order.orderStatus;
    
    if (req.body.orderStatus === 'Delivered') {
      order.deliveredAt = Date.now();
      order.paymentStatus = 'Paid';
    }

    if (req.body.orderNotes) {
      order.orderNotes = req.body.orderNotes;
    }

    const updatedOrder = await order.save();

    res.json({
      success: true,
      data: updatedOrder,
    });
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    // Check if order belongs to user or user is admin
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to cancel this order');
    }

    if (order.orderStatus === 'Delivered') {
      res.status(400);
      throw new Error('Cannot cancel delivered order');
    }

    // Restore stock for cancelled orders
    for (let item of order.orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        product.inStock = product.stock > 0;
        await product.save();
      }
    }

    order.orderStatus = 'Cancelled';
    const updatedOrder = await order.save();

    res.json({
      success: true,
      data: updatedOrder,
    });
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

module.exports = {
  createOrder,
  getOrderById,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
};
