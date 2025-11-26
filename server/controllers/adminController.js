const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Order = require('../models/Order');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for admin credentials from env or hardcoded
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@pesticide.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  if (email === adminEmail && password === adminPassword) {
    // Find or create admin user
    let admin = await User.findOne({ email: adminEmail });

    if (!admin) {
      admin = await User.create({
        name: 'Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        isEmailVerified: true,
      });
    }

    res.json({
      success: true,
      data: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        token: generateToken(admin._id),
      },
    });
  } else {
    res.status(401);
    throw new Error('Invalid admin credentials');
  }
});

// @desc    Get all users (Admin)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ role: 'user' }).select('-password');

  res.json({
    success: true,
    data: users,
    count: users.length,
  });
});

// @desc    Get user by ID (Admin)
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    res.json({
      success: true,
      data: user,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Delete user (Admin)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.role === 'admin') {
      res.status(400);
      throw new Error('Cannot delete admin user');
    }

    await user.deleteOne();
    res.json({
      success: true,
      message: 'User removed',
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get dashboard stats (Admin)
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments({ role: 'user' });
  const totalOrders = await Order.countDocuments();
  const Product = require('../models/Product');
  const totalProducts = await Product.countDocuments();

  // Calculate total revenue
  const orders = await Order.find({ orderStatus: { $ne: 'Cancelled' } });
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);

  // Recent orders
  const recentOrders = await Order.find()
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .limit(5);

  // Orders by status
  const pendingOrders = await Order.countDocuments({ orderStatus: 'Pending' });
  const processingOrders = await Order.countDocuments({ orderStatus: 'Processing' });
  const shippedOrders = await Order.countDocuments({ orderStatus: 'Shipped' });
  const deliveredOrders = await Order.countDocuments({ orderStatus: 'Delivered' });

  res.json({
    success: true,
    data: {
      totalUsers,
      totalOrders,
      totalProducts,
      totalRevenue,
      recentOrders,
      orderStats: {
        pending: pendingOrders,
        processing: processingOrders,
        shipped: shippedOrders,
        delivered: deliveredOrders,
      },
    },
  });
});

module.exports = {
  adminLogin,
  getAllUsers,
  getUserById,
  deleteUser,
  getDashboardStats,
};
