import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { formatCurrency } from '../utils/currency';
import useRazorpay from '../hooks/useRazorpay';
import api from '../utils/api';
import './Checkout.css';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { initiatePayment, loading: paymentLoading } = useRazorpay();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || 'India',
  });

  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');

  const subtotal = getCartTotal();
  const taxRate = 0.18; // 18% GST (India)
  const taxPrice = subtotal * taxRate;
  const shippingPrice = subtotal > 1000 ? 0 : 50; // Free shipping above ₹1000
  const totalPrice = subtotal + taxPrice + shippingPrice;

  const handleChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // If payment method is Razorpay/UPI, initiate Razorpay payment
    if (paymentMethod === 'Razorpay' || paymentMethod === 'UPI') {
      const orderItems = cartItems.map((item) => ({
        product: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.images && item.images.length > 0 ? item.images[0].url : '',
      }));

      const orderData = {
        orderItems,
        shippingAddress,
        itemsPrice: subtotal,
        taxPrice,
        shippingPrice,
        totalPrice,
      };

      await initiatePayment({
        amount: totalPrice,
        orderData,
        onSuccess: (order) => {
          clearCart();
          navigate(`/order-confirmation/${order._id}`);
        },
        onFailure: () => {
          toast.error('Payment failed or cancelled');
        }
      });
    } else {
      // Cash on Delivery or other methods
      setLoading(true);
      try {
        const orderItems = cartItems.map((item) => ({
          product: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.images && item.images.length > 0 ? item.images[0].url : '',
        }));

        const orderData = {
          orderItems,
          shippingAddress,
          paymentMethod,
          itemsPrice: subtotal,
          taxPrice,
          shippingPrice,
          totalPrice,
        };

        const { data } = await api.post('/orders', orderData);

        if (data.success) {
          clearCart();
          toast.success('Order placed successfully!');
          navigate(`/order-confirmation/${data.data._id}`);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to place order');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1>Checkout</h1>

        <div className="checkout-layout">
          <form onSubmit={handleSubmit} className="checkout-form">
            <div className="checkout-section">
              <h2>Shipping Address</h2>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fullName">Full Name *</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={shippingAddress.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={shippingAddress.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="street">Street Address *</label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  value={shippingAddress.street}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="state">State *</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={shippingAddress.state}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="zipCode">ZIP Code *</label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={shippingAddress.zipCode}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="country">Country *</label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={shippingAddress.country}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="checkout-section">
              <h2>Payment Method</h2>

              <div className="payment-options">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Cash on Delivery"
                    checked={paymentMethod === 'Cash on Delivery'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Cash on Delivery</span>
                </label>

                <label className="radio-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Credit Card"
                    checked={paymentMethod === 'Credit Card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Credit Card</span>
                </label>

                <label className="radio-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Debit Card"
                    checked={paymentMethod === 'Debit Card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Debit Card</span>
                </label>

                <label className="radio-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="UPI"
                    checked={paymentMethod === 'UPI'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>UPI / Razorpay (Cards, Wallets, NetBanking)</span>
                </label>

                <label className="radio-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Razorpay"
                    checked={paymentMethod === 'Razorpay'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Pay Online (All Payment Methods)</span>
                </label>
              </div>

              {(paymentMethod === 'UPI' || paymentMethod === 'Razorpay') && (
                <div className="payment-info">
                  <p>✓ Secure payment via Razorpay</p>
                  <p>✓ Supports UPI, Cards, Wallets, NetBanking</p>
                  <p>✓ Test Mode - Use test cards for demo</p>
                </div>
              )}
            </div>

            <button type="submit" className="btn btn-primary btn-block btn-large" disabled={loading || paymentLoading}>
              {loading || paymentLoading ? 'Processing...' : paymentMethod === 'UPI' || paymentMethod === 'Razorpay' ? 'Proceed to Payment' : 'Place Order'}
            </button>
          </form>

          <div className="order-summary">
            <h2>Order Summary</h2>

            <div className="summary-items">
              {cartItems.map((item) => (
                <div key={item._id} className="summary-item">
                  <img
                    src={item.images && item.images.length > 0
                      ? item.images[0].url
                      : '/placeholder-product.jpg'}
                    alt={item.name}
                  />
                  <div>
                    <p>{item.name}</p>
                    <p className="item-quantity">Qty: {item.quantity}</p>
                  </div>
                  <p>{formatCurrency(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            <div className="summary-totals">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>

              <div className="summary-row">
                <span>Shipping:</span>
                <span>{shippingPrice === 0 ? 'FREE' : formatCurrency(shippingPrice)}</span>
              </div>

              <div className="summary-row">
                <span>Tax (18% GST):</span>
                <span>{formatCurrency(taxPrice)}</span>
              </div>

              <div className="summary-row total">
                <span>Total:</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
            </div>

            {subtotal < 1000 && (
              <p className="shipping-note">
                Add {formatCurrency(1000 - subtotal)} more to get FREE shipping!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
