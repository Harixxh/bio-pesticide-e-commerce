import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { formatCurrency } from '../utils/currency';
import Loading from '../components/Loading';
import api from '../utils/api';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const { data } = await api.get(`/orders/${id}`);
      if (data.success) {
        setOrder(data.data);
      }
    } catch (err) {
      setError('Failed to load order details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error || !order) return <div className="error-container">{error || 'Order not found'}</div>;

  return (
    <div className="order-confirmation">
      <div className="container">
        <div className="confirmation-header">
          <div className="success-icon">✓</div>
          <h1>Order Placed Successfully!</h1>
          <p>Thank you for your order. We'll send you a confirmation email shortly.</p>
        </div>

        <div className="order-details">
          <div className="order-info-card">
            <h2>Order Information</h2>
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Status:</strong> <span className={`status-badge ${order.orderStatus.toLowerCase()}`}>{order.orderStatus}</span></p>
            <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
            <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
          </div>

          <div className="order-info-card">
            <h2>Shipping Address</h2>
            <p>{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.phone}</p>
            <p>{order.shippingAddress.street}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
            <p>{order.shippingAddress.country}</p>
          </div>
        </div>

        <div className="order-items-section">
          <h2>Order Items</h2>
          {order.orderItems.map((item) => (
            <div key={item._id} className="order-item">
              <img src={item.image || '/placeholder-product.jpg'} alt={item.name} />
              <div className="item-details">
                <h3>{item.name}</h3>
                <p>Quantity: {item.quantity}</p>
                <p>{formatCurrency(item.price)} each</p>
              </div>
              <div className="item-total">
                {formatCurrency(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>

        <div className="order-summary">
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>{formatCurrency(order.itemsPrice)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping:</span>
            <span>{formatCurrency(order.shippingPrice)}</span>
          </div>
          <div className="summary-row">
            <span>Tax (GST):</span>
            <span>{formatCurrency(order.taxPrice)}</span>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <span>{formatCurrency(order.totalPrice)}</span>
          </div>
        </div>

        <div className="confirmation-actions">
          <Link to="/orders" className="btn btn-primary">
            View My Orders
          </Link>
          <Link to="/products" className="btn btn-secondary">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
