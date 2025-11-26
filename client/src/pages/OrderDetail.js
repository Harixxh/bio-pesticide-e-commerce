import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { formatCurrency } from '../utils/currency';
import Loading from '../components/Loading';
import api from '../utils/api';
import './OrderDetail.css';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);

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

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    setCancelling(true);
    try {
      const { data } = await api.put(`/orders/${id}/cancel`);
      if (data.success) {
        toast.success('Order cancelled successfully');
        setOrder(data.data);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <Loading />;
  if (error || !order) return <div className="error-container">{error || 'Order not found'}</div>;

  const canCancel = order.orderStatus !== 'Delivered' && order.orderStatus !== 'Cancelled';

  return (
    <div className="order-detail">
      <div className="container">
        <button onClick={() => navigate(-1)} className="back-button">
          ← Back to Orders
        </button>

        <div className="order-detail-header">
          <div>
            <h1>Order Details</h1>
            <p className="order-id">Order ID: {order._id}</p>
            <p className="order-date">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <span className={`status-badge ${order.orderStatus.toLowerCase()}`}>
            {order.orderStatus}
          </span>
        </div>

        <div className="order-detail-grid">
          <div className="order-main-content">
            <div className="section-card">
              <h2>Order Items</h2>
              {order.orderItems.map((item) => (
                <div key={item._id} className="order-item">
                  <img
                    src={item.image || '/placeholder-product.jpg'}
                    alt={item.name}
                  />
                  <div className="item-info">
                    <h3>{item.name}</h3>
                    <p>Price: {formatCurrency(item.price)}</p>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                  <div className="item-total">
                    {formatCurrency(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="section-card">
              <h2>Shipping Address</h2>
              <div className="address-info">
                <p><strong>{order.shippingAddress.fullName}</strong></p>
                <p>{order.shippingAddress.phone}</p>
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.zipCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>

            {order.orderNotes && (
              <div className="section-card">
                <h2>Order Notes</h2>
                <p>{order.orderNotes}</p>
              </div>
            )}
          </div>

          <div className="order-sidebar">
            <div className="section-card">
              <h2>Order Summary</h2>
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

            <div className="section-card">
              <h2>Payment Information</h2>
              <p><strong>Method:</strong> {order.paymentMethod}</p>
              <p><strong>Status:</strong> {order.paymentStatus}</p>
            </div>

            {canCancel && (
              <button
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="btn btn-danger btn-block"
              >
                {cancelling ? 'Cancelling...' : 'Cancel Order'}
              </button>
            )}

            {order.deliveredAt && (
              <div className="delivery-info">
                <p>
                  <strong>Delivered on:</strong>{' '}
                  {new Date(order.deliveredAt).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
