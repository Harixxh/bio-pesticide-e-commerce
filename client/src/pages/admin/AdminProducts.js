import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { formatCurrency } from '../../utils/currency';
import Loading from '../../components/Loading';
import api from '../../utils/api';
import './AdminProducts.css';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products?limit=100');
      if (data.success) {
        setProducts(data.data);
      }
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      const { data } = await api.delete(`/products/${id}`);
      if (data.success) {
        toast.success('Product deleted successfully');
        setProducts(products.filter((p) => p._id !== id));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete product');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="admin-products">
      <div className="container">
        <div className="page-header">
          <h1>Manage Products</h1>
          <Link to="/admin/products/add" className="btn btn-primary">
            + Add New Product
          </Link>
        </div>

        {error && <p className="error-message">{error}</p>}

        {products.length === 0 ? (
          <div className="no-products">
            <p>No products found. Add your first product!</p>
          </div>
        ) : (
          <div className="products-table-container">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <img
                        src={product.images && product.images.length > 0
                          ? product.images[0].url
                          : '/placeholder-product.jpg'}
                        alt={product.name}
                        className="product-thumbnail"
                      />
                    </td>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>{formatCurrency(product.price)}</td>
                    <td>{product.stock}</td>
                    <td>
                      <span className={`stock-badge ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <Link
                          to={`/admin/products/edit/${product._id}`}
                          className="btn btn-sm btn-secondary"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(product._id, product.name)}
                          className="btn btn-sm btn-danger"
                        >
                          Delete
                        </button>
                      </div>
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

export default AdminProducts;
