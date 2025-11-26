import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './UserDashboard.css';

const UserDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="user-dashboard">
      <div className="container">
        <h1>Welcome, {user?.name}!</h1>

        <div className="dashboard-grid">
          <Link to="/orders" className="dashboard-card">
            <div className="card-icon">📦</div>
            <h3>My Orders</h3>
            <p>View and track your orders</p>
          </Link>

          <Link to="/profile" className="dashboard-card">
            <div className="card-icon">👤</div>
            <h3>My Profile</h3>
            <p>Manage your account information</p>
          </Link>

          <Link to="/products" className="dashboard-card">
            <div className="card-icon">🛍️</div>
            <h3>Shop Products</h3>
            <p>Browse our product catalog</p>
          </Link>

          <Link to="/cart" className="dashboard-card">
            <div className="card-icon">🛒</div>
            <h3>Shopping Cart</h3>
            <p>View your cart items</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
