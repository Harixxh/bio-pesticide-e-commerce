import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { formatCurrency } from '../utils/currency';
import './Cart.css';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    updateQuantity(productId, newQuantity);
  };

  const handleRemove = (productId, productName) => {
    removeFromCart(productId);
    toast.success(`${productName} removed from cart`);
  };

  const handleCheckout = () => {
    if (!isAuthenticated()) {
      toast.info('Please login to proceed with checkout');
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <div className="container">
          <h2>Your Cart is Empty</h2>
          <p>Add some products to your cart to get started!</p>
          <Link to="/products" className="btn btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1>Shopping Cart</h1>

        <div className="cart-layout">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item._id} className="cart-item">
                <img
                  src={item.images && item.images.length > 0
                    ? item.images[0].url
                    : '/placeholder-product.jpg'}
                  alt={item.name}
                  className="cart-item-image"
                />

                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p className="cart-item-category">{item.category}</p>
                  <p className="cart-item-price">{formatCurrency(item.price)} each</p>
                </div>

                <div className="cart-item-quantity">
                  <label>Quantity:</label>
                  <div className="quantity-controls">
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value) || 1)}
                      min="1"
                    />
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="cart-item-total">
                  <p>{formatCurrency(item.price * item.quantity)}</p>
                </div>

                <button
                  onClick={() => handleRemove(item._id, item.name)}
                  className="cart-item-remove"
                  aria-label="Remove item"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>

            <div className="summary-row">
              <span>Subtotal:</span>
              <span>{formatCurrency(getCartTotal())}</span>
            </div>

            <div className="summary-row">
              <span>Shipping:</span>
              <span>Calculated at checkout</span>
            </div>

            <div className="summary-row">
              <span>Tax:</span>
              <span>Calculated at checkout</span>
            </div>

            <div className="summary-row total">
              <span>Total:</span>
              <span>{formatCurrency(getCartTotal())}</span>
            </div>

            <button onClick={handleCheckout} className="btn btn-primary btn-block btn-large">
              Proceed to Checkout
            </button>

            <Link to="/products" className="btn btn-secondary btn-block">
              Continue Shopping
            </Link>

            <button onClick={clearCart} className="btn-text-link">
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
