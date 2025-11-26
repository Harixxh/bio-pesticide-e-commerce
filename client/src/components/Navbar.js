import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🌿</span>
          PesticideShop
        </Link>

        <button className="menu-toggle" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
          <li><Link to="/products" onClick={() => setIsMenuOpen(false)}>Products</Link></li>
          
          {isAuthenticated() ? (
            <>
              {isAdmin() ? (
                <>
                  <li><Link to="/admin/dashboard" onClick={() => setIsMenuOpen(false)}>Admin Dashboard</Link></li>
                  <li><Link to="/admin/products" onClick={() => setIsMenuOpen(false)}>Manage Products</Link></li>
                  <li><Link to="/admin/orders" onClick={() => setIsMenuOpen(false)}>Orders</Link></li>
                </>
              ) : (
                <>
                  <li><Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</Link></li>
                  <li><Link to="/orders" onClick={() => setIsMenuOpen(false)}>My Orders</Link></li>
                  <li><Link to="/profile" onClick={() => setIsMenuOpen(false)}>Profile</Link></li>
                </>
              )}
              <li>
                <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="logout-btn">
                  Logout ({user?.name})
                </button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link></li>
              <li><Link to="/register" onClick={() => setIsMenuOpen(false)}>Register</Link></li>
            </>
          )}

          {!isAdmin() && (
            <li>
              <Link to="/cart" className="cart-link" onClick={() => setIsMenuOpen(false)}>
                <span className="cart-icon">🛒</span>
                {getCartCount() > 0 && (
                  <span className="cart-badge">{getCartCount()}</span>
                )}
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
