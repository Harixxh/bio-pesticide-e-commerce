import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loading from '../../components/Loading';
import api from '../../utils/api';
import './AdminProductForm.css';

const AdminEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(null);

  const categories = [
    'Insecticides',
    'Herbicides',
    'Fungicides',
    'Rodenticides',
    'Plant Growth Regulators',
    'Bio-Pesticides',
    'Other'
  ];

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data } = await api.get(`/products/${id}`);
      if (data.success) {
        setFormData({
          ...data.data,
          images: data.data.images?.length > 0 ? data.data.images : [{ url: '', alt: '' }],
        });
      }
    } catch (err) {
      toast.error('Failed to load product');
      navigate('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (index, field, value) => {
    const newImages = [...formData.images];
    newImages[index][field] = value;
    setFormData({ ...formData, images: newImages });
  };

  const addImageField = () => {
    setFormData({
      ...formData,
      images: [...formData.images, { url: '', alt: '' }],
    });
  };

  const removeImageField = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const validImages = formData.images.filter((img) => img.url.trim() !== '');

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        images: validImages.length > 0 ? validImages : undefined,
      };

      const { data } = await api.put(`/products/${id}`, productData);

      if (data.success) {
        toast.success('Product updated successfully!');
        navigate('/admin/products');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;
  if (!formData) return <div className="error-container">Product not found</div>;

  return (
    <div className="admin-product-form">
      <div className="container">
        <div className="page-header">
          <h1>Edit Product</h1>
          <button onClick={() => navigate(-1)} className="btn btn-secondary">
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-section">
            <h2>Basic Information</h2>

            <div className="form-group">
              <label htmlFor="name">Product Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="5"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Price ($) *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="stock">Stock Quantity *</label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  min="0"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Product Details</h2>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="activeIngredient">Active Ingredient</label>
                <input
                  type="text"
                  id="activeIngredient"
                  name="activeIngredient"
                  value={formData.activeIngredient || ''}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="packSize">Pack Size</label>
                <input
                  type="text"
                  id="packSize"
                  name="packSize"
                  value={formData.packSize || ''}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="manufacturer">Manufacturer</label>
                <input
                  type="text"
                  id="manufacturer"
                  name="manufacturer"
                  value={formData.manufacturer || ''}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Safety & Usage</h2>

            <div className="form-group">
              <label htmlFor="safetyWarnings">Safety Warnings *</label>
              <textarea
                id="safetyWarnings"
                name="safetyWarnings"
                value={formData.safetyWarnings}
                onChange={handleChange}
                required
                rows="4"
              />
            </div>

            <div className="form-group">
              <label htmlFor="usageInstructions">Usage Instructions *</label>
              <textarea
                id="usageInstructions"
                name="usageInstructions"
                value={formData.usageInstructions}
                onChange={handleChange}
                required
                rows="4"
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Product Images</h2>
            {formData.images.map((image, index) => (
              <div key={index} className="image-input-group">
                <div className="form-row">
                  <div className="form-group flex-grow">
                    <label>Image URL</label>
                    <input
                      type="url"
                      value={image.url}
                      onChange={(e) => handleImageChange(index, 'url', e.target.value)}
                    />
                  </div>
                  <div className="form-group flex-grow">
                    <label>Alt Text</label>
                    <input
                      type="text"
                      value={image.alt}
                      onChange={(e) => handleImageChange(index, 'alt', e.target.value)}
                    />
                  </div>
                  {formData.images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageField(index)}
                      className="btn btn-danger btn-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addImageField}
              className="btn btn-secondary btn-sm"
            >
              + Add Another Image
            </button>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary btn-large" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-secondary btn-large"
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminEditProduct;
