# Razorpay Payment Integration Guide

## Setup Instructions

### 1. Get Razorpay Test API Keys

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign up or log in to your account
3. Switch to **Test Mode** (toggle in the top menu)
4. Go to Settings → API Keys
5. Generate test API keys if not already generated
6. Copy the **Key ID** and **Key Secret**

### 2. Configure Environment Variables

Update your `server/.env` file:

```env
RAZORPAY_KEY_ID=rzp_test_your_actual_key_id
RAZORPAY_KEY_SECRET=your_actual_key_secret
```

**Important:** Replace the placeholder values with your actual Razorpay test keys.

### 3. Test Cards for Payment Testing

When in test mode, use these test card details:

#### Successful Payment:
- **Card Number:** 4111 1111 1111 1111
- **CVV:** Any 3 digits
- **Expiry:** Any future date
- **Name:** Any name

#### Failed Payment:
- **Card Number:** 4000 0000 0000 0002
- **CVV:** Any 3 digits
- **Expiry:** Any future date

### 4. Test UPI

For UPI testing in test mode:
- UPI ID: `success@razorpay`
- This will simulate a successful payment

### 5. How to Use

1. Start both frontend and backend servers
2. Add products to cart
3. Go to checkout
4. Fill shipping address
5. Select "UPI / Razorpay" or "Pay Online" payment method
6. Click "Proceed to Payment"
7. Razorpay checkout modal will open
8. Use test cards/UPI for payment
9. Payment will be verified and order will be created

### 6. Features Implemented

✅ Razorpay integration with test mode  
✅ UPI payment support  
✅ Card payments (Credit/Debit)  
✅ Net Banking  
✅ Wallet payments  
✅ Payment verification with signature  
✅ Order creation after successful payment  
✅ Refund support (for order cancellations)  

### 7. API Endpoints

- `POST /api/payment/create-order` - Create Razorpay order
- `POST /api/payment/verify` - Verify payment signature
- `GET /api/payment/:paymentId` - Get payment details
- `POST /api/payment/refund` - Refund payment

### 8. Security Notes

⚠️ **Never commit .env file to version control**  
⚠️ **Use test keys only in development**  
⚠️ **Switch to live keys only in production**  
⚠️ **Verify all payments server-side**  

### 9. Going Live

When ready for production:

1. Switch to **Live Mode** in Razorpay Dashboard
2. Complete KYC verification
3. Generate live API keys
4. Update `.env` with live keys
5. Test thoroughly before going live
6. Set up webhooks for payment notifications

### 10. Troubleshooting

**Payment not opening:**
- Check if Razorpay script is loaded
- Verify API keys in .env
- Check browser console for errors

**Payment verification failed:**
- Ensure signature verification is correct
- Check if key secret matches

**Order not created after payment:**
- Check backend logs
- Verify order creation endpoint
- Check database connection

### 11. Documentation

- [Razorpay Docs](https://razorpay.com/docs/)
- [Test Cards](https://razorpay.com/docs/payments/payments/test-card-details/)
- [Payment Gateway](https://razorpay.com/docs/payment-gateway/)

---

## Current Configuration

✅ Backend: Razorpay SDK installed  
✅ Payment routes configured  
✅ Frontend: Razorpay hook created  
✅ Checkout page updated  
✅ Test mode enabled  

**Next Step:** Add your actual Razorpay test keys to `.env` file!
