import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import { formatCurrency } from '../utils/currency';
import Loading from '../components/Loading';
import api from '../utils/api';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data } = await api.get(`/products/${id}`);
      if (data.success) {
        setProduct(data.data);
      }
    } catch (err) {
      setError('Failed to load product details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product.stock < quantity) {
      toast.error('Not enough stock available');
      return;
    }
    addToCart(product, quantity);
    toast.success(`${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  if (loading) return <Loading />;
  if (error || !product) return <div className="error-container">{error || 'Product not found'}</div>;

  return (
    <div className="product-detail">
      <div className="container">
        <button onClick={() => navigate(-1)} className="back-button">
          ← Back
        </button>

        <div className="product-detail-grid">
          <div className="product-images">
            <div className="main-image">
              <img
                src={product.images && product.images.length > 0
                  ? product.images[selectedImage].url
                  : '/placeholder-product.jpg'}
                alt={product.name}
              />
              {!product.inStock && (
                <div className="out-of-stock-overlay">Out of Stock</div>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="thumbnail-images">
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image.url}
                    alt={`${product.name} ${index + 1}`}
                    className={selectedImage === index ? 'active' : ''}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="product-details">
            <h1>{product.name}</h1>
            <p className="product-category">{product.category}</p>
            <p className="product-price">{formatCurrency(product.price)}</p>

            <div className="product-stock">
              {product.inStock ? (
                <span className="in-stock">In Stock ({product.stock} available)</span>
              ) : (
                <span className="out-of-stock">Out of Stock</span>
              )}
            </div>

            {product.inStock && (
              <div className="quantity-selector">
                <label>Quantity:</label>
                <div className="quantity-controls">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    max={product.stock}
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {product.inStock && (
              <div className="product-actions">
                <button onClick={handleAddToCart} className="btn btn-primary btn-large">
                  Add to Cart
                </button>
                <button onClick={handleBuyNow} className="btn btn-secondary btn-large">
                  Buy Now
                </button>
              </div>
            )}

            <div className="product-info-section">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

            {product.activeIngredient && (
              <div className="product-info-section">
                <h3>Active Ingredient</h3>
                <p>{product.activeIngredient}</p>
              </div>
            )}

            {product.packSize && (
              <div className="product-info-section">
                <h3>Pack Size</h3>
                <p>{product.packSize}</p>
              </div>
            )}

            {product.manufacturer && (
              <div className="product-info-section">
                <h3>Manufacturer</h3>
                <p>{product.manufacturer}</p>
              </div>
            )}

            <div className="product-info-section warning">
              <h3>⚠️ Safety Warnings</h3>
              <p>{product.safetyWarnings}</p>
            </div>

            <div className="product-info-section">
              <h3>📋 Usage Instructions</h3>
              <p>{product.usageInstructions}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
