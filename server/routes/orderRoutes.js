const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrderById,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, createOrder);
router.get('/', protect, admin, getAllOrders);
router.get('/user/myorders', protect, getUserOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, admin, updateOrderStatus);
router.put('/:id/cancel', protect, cancelOrder);

module.exports = router;
