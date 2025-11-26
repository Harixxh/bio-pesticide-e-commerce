import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { formatCurrency } from '../../utils/currency';
import Loading from '../../components/Loading';
import api from '../../utils/api';
import './AdminOrders.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders');
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

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const { data } = await api.put(`/orders/${orderId}/status`, {
        orderStatus: newStatus,
      });

      if (data.success) {
        setOrders(orders.map((order) =>
          order._id === orderId ? data.data : order
        ));
        toast.success('Order status updated successfully');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update order status');
    }
  };

  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter((order) => order.orderStatus.toLowerCase() === filter.toLowerCase());

  if (loading) return <Loading />;

  return (
    <div className="admin-orders">
      <div className="container">
        <h1>Manage Orders</h1>

        <div className="orders-filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({orders.length})
          </button>
          <button
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending ({orders.filter(o => o.orderStatus === 'Pending').length})
          </button>
          <button
            className={`filter-btn ${filter === 'processing' ? 'active' : ''}`}
            onClick={() => setFilter('processing')}
          >
            Processing ({orders.filter(o => o.orderStatus === 'Processing').length})
          </button>
          <button
            className={`filter-btn ${filter === 'shipped' ? 'active' : ''}`}
            onClick={() => setFilter('shipped')}
          >
            Shipped ({orders.filter(o => o.orderStatus === 'Shipped').length})
          </button>
          <button
            className={`filter-btn ${filter === 'delivered' ? 'active' : ''}`}
            onClick={() => setFilter('delivered')}
          >
            Delivered ({orders.filter(o => o.orderStatus === 'Delivered').length})
          </button>
        </div>

        {error && <p className="error-message">{error}</p>}

        {filteredOrders.length === 0 ? (
          <div className="no-orders">
            <p>No orders found.</p>
          </div>
        ) : (
          <div className="orders-table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id}>
                    <td>#{order._id.slice(-8)}</td>
                    <td>
                      <div>
                        <p className="customer-name">{order.user.name}</p>
                        <p className="customer-email">{order.user.email}</p>
                      </div>
                    </td>
                    <td>
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td>{order.orderItems.length}</td>
                    <td>{formatCurrency(order.totalPrice)}</td>
                    <td>
                      <span className={`payment-badge ${order.paymentStatus.toLowerCase()}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${order.orderStatus.toLowerCase()}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td>
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                        className="status-select"
                        disabled={order.orderStatus === 'Cancelled'}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
