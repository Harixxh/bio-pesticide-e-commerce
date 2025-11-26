import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import { formatCurrency } from '../utils/currency';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart, isInCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product._id}`} className="product-image-link">
        <img
          src={product.images && product.images.length > 0 
            ? product.images[0].url 
            : '/placeholder-product.jpg'}
          alt={product.name}
          className="product-image"
        />
        {!product.inStock && <div className="out-of-stock-badge">Out of Stock</div>}
      </Link>

      <div className="product-info">
        <Link to={`/products/${product._id}`}>
          <h3 className="product-name">{product.name}</h3>
        </Link>
        <p className="product-category">{product.category}</p>
        <p className="product-price">{formatCurrency(product.price)}</p>

        <div className="product-actions">
          <Link to={`/products/${product._id}`} className="btn btn-secondary">
            View Details
          </Link>
          {product.inStock && (
            <button 
              onClick={handleAddToCart} 
              className={`btn btn-primary ${isInCart(product._id) ? 'in-cart' : ''}`}
            >
              {isInCart(product._id) ? 'Added ✓' : 'Add to Cart'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
