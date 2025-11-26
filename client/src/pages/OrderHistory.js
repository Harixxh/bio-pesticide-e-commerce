import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/currency';
import Loading from '../components/Loading';
import api from '../utils/api';
import './OrderHistory.css';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders/user/myorders');
      if (data.success) {
        setOrders(data.data);
      }
    } catch (err) {
      setError('Failed to load orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    return status.toLowerCase().replace(' ', '-');
  };

  if (loading) return <Loading />;

  return (
    <div className="order-history">
      <div className="container">
        <h1>My Orders</h1>

        {error && <p className="error-message">{error}</p>}

        {orders.length === 0 ? (
          <div className="no-orders">
            <p>You haven't placed any orders yet.</p>
            <Link to="/products" className="btn btn-primary">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div>
                    <h3>Order #{order._id.slice(-8)}</h3>
                    <p className="order-date">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <span className={`status-badge ${getStatusClass(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                </div>

                <div className="order-items">
                  {order.orderItems.map((item, index) => (
                    <div key={index} className="order-item-preview">
                      <img
                        src={item.image || '/placeholder-product.jpg'}
                        alt={item.name}
                      />
                      <div>
                        <p>{item.name}</p>
                        <p className="item-quantity">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <div className="order-total">
                    <span>Total:</span>
                    <span className="amount">{formatCurrency(order.totalPrice)}</span>
                  </div>
                  <Link to={`/orders/${order._id}`} className="btn btn-secondary">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
