const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createOrder,
  verifyPayment,
  getPaymentDetails,
  refundPayment
} = require('../controllers/paymentController');

// Create Razorpay order
router.post('/create-order', protect, createOrder);

// Verify payment
router.post('/verify', protect, verifyPayment);

// Get payment details
router.get('/:paymentId', protect, getPaymentDetails);

// Refund payment (admin only)
router.post('/refund', protect, refundPayment);

module.exports = router;
