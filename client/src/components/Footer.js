import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>About Us</h3>
          <p>
            Your trusted source for quality pesticides and agricultural solutions.
            We provide safe and effective products for all your crop protection needs.
          </p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Customer Service</h3>
          <ul>
            <li><Link to="/shipping">Shipping Info</Link></li>
            <li><Link to="/returns">Returns Policy</Link></li>
            <li><Link to="/terms">Terms & Conditions</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>Email: harishadmin@gmail.com</p>
          <p>Phone: +91 8754834543</p>
          <p>Address: 2/16 Good Street<br/>Thanjavur, Tamil Nadu, India 614903</p>
          <div className="social-links">
            <a href="#" aria-label="Facebook">📘</a>
            <a href="#" aria-label="Twitter">🐦</a>
            <a href="#" aria-label="Instagram">📷</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 PesticideShop. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
