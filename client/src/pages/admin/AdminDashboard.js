import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/currency';
import Loading from '../../components/Loading';
import api from '../../utils/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/admin/stats');
      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      setError('Failed to load dashboard stats');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <div className="error-container">{error}</div>;

  return (
    <div className="admin-dashboard">
      <div className="container">
        <h1>Admin Dashboard</h1>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>{stats.totalUsers}</h3>
              <p>Total Users</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-info">
              <h3>{stats.totalOrders}</h3>
              <p>Total Orders</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-info">
              <h3>{stats.totalProducts}</h3>
              <p>Total Products</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <h3>{formatCurrency(stats.totalRevenue)}</h3>
              <p>Total Revenue</p>
            </div>
          </div>
        </div>

        <div className="dashboard-sections">
          <div className="dashboard-section">
            <h2>Order Statistics</h2>
            <div className="order-stats">
              <div className="stat-item">
                <span className="stat-label">Pending:</span>
                <span className="stat-value">{stats.orderStats.pending}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Processing:</span>
                <span className="stat-value">{stats.orderStats.processing}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Shipped:</span>
                <span className="stat-value">{stats.orderStats.shipped}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Delivered:</span>
                <span className="stat-value">{stats.orderStats.delivered}</span>
              </div>
            </div>
          </div>

          <div className="dashboard-section">
            <div className="section-header">
              <h2>Recent Orders</h2>
              <Link to="/admin/orders" className="view-all-link">View All →</Link>
            </div>
            <div className="recent-orders">
              {stats.recentOrders.map((order) => (
                <div key={order._id} className="order-item">
                  <div>
                    <p className="order-id">#{order._id.slice(-8)}</p>
                    <p className="order-user">{order.user.name}</p>
                  </div>
                  <div>
                    <p className="order-amount">{formatCurrency(order.totalPrice)}</p>
                    <span className={`status-badge ${order.orderStatus.toLowerCase()}`}>
                      {order.orderStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <Link to="/admin/products/add" className="btn btn-primary">
              Add New Product
            </Link>
            <Link to="/admin/products" className="btn btn-secondary">
              Manage Products
            </Link>
            <Link to="/admin/orders" className="btn btn-secondary">
              Manage Orders
            </Link>
            <Link to="/admin/users" className="btn btn-secondary">
              View Users
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
