const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Razorpay Order
exports.createOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    // Amount should be in paise (multiply by 100) and convert to integer
    const amountInPaise = Math.round(amount * 100);
    
    const options = {
      amount: amountInPaise, // amount in paise (integer)
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1 // Auto capture payment
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key: process.env.RAZORPAY_KEY_ID // Send key to frontend
      }
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order',
      error: error.message
    });
  }
};

// Verify Razorpay Payment
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Create signature for verification
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    // Compare signatures
    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Payment is verified
      res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        data: {
          orderId: razorpay_order_id,
          paymentId: razorpay_payment_id
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification error',
      error: error.message
    });
  }
};

// Get Payment Details
exports.getPaymentDetails = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await razorpay.payments.fetch(paymentId);

    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    console.error('Get payment details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment details',
      error: error.message
    });
  }
};

// Refund Payment (for cancelled orders)
exports.refundPayment = async (req, res) => {
  try {
    const { paymentId, amount } = req.body;

    // Amount should be in paise (multiply by 100) and convert to integer
    const amountInPaise = Math.round(amount * 100);

    const refund = await razorpay.payments.refund(paymentId, {
      amount: amountInPaise, // amount in paise (integer)
      speed: 'normal'
    });

    res.status(200).json({
      success: true,
      message: 'Refund initiated successfully',
      data: refund
    });
  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process refund',
      error: error.message
    });
  }
};
