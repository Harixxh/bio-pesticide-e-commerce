import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import api from '../utils/api';
import './Home.css';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const { data } = await api.get('/products?limit=8');
      if (data.success) {
        setFeaturedProducts(data.data);
      }
    } catch (err) {
      setError('Failed to load featured products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="home">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Professional Pesticide Solutions</h1>
          <p>Quality products for crop protection and pest management</p>
          <div className="hero-buttons">
            <Link to="/products" className="btn btn-primary btn-large">
              Shop Now
            </Link>
            <Link to="/products" className="btn btn-secondary btn-large">
              Browse Products
            </Link>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <h2>Why Choose Us</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">✓</div>
              <h3>Quality Products</h3>
              <p>All products are tested and certified for safety and effectiveness</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Fast Delivery</h3>
              <p>Quick and reliable shipping to your doorstep</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💯</div>
              <h3>Expert Support</h3>
              <p>Get guidance from agricultural experts</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure Shopping</h3>
              <p>Safe and secure payment processing</p>
            </div>
          </div>
        </div>
      </section>

      <section className="products-section">
        <div className="container">
          <div className="section-header">
            <h2>Featured Products</h2>
            <Link to="/products" className="view-all-link">View All →</Link>
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="products-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="categories-section">
        <div className="container">
          <h2>Shop by Category</h2>
          <div className="categories-grid">
            <Link to="/products?category=Insecticides" className="category-card">
              <h3>Insecticides</h3>
            </Link>
            <Link to="/products?category=Herbicides" className="category-card">
              <h3>Herbicides</h3>
            </Link>
            <Link to="/products?category=Fungicides" className="category-card">
              <h3>Fungicides</h3>
            </Link>
            <Link to="/products?category=Bio-Pesticides" className="category-card">
              <h3>Bio-Pesticides</h3>
            </Link>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>Ready to Get Started?</h2>
          <p>Browse our extensive collection of pesticides and crop protection solutions</p>
          <Link to="/products" className="btn btn-primary btn-large">
            Explore Products
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
