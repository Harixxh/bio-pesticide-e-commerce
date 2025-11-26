import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import './AdminProductForm.css';

const AdminAddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Insecticides',
    stock: '',
    safetyWarnings: '',
    usageInstructions: '',
    activeIngredient: '',
    packSize: '',
    manufacturer: '',
    images: [{ url: '', alt: '' }],
  });

  const categories = [
    'Insecticides',
    'Herbicides',
    'Fungicides',
    'Rodenticides',
    'Plant Growth Regulators',
    'Bio-Pesticides',
    'Other'
  ];

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
    setLoading(true);

    try {
      // Filter out empty images
      const validImages = formData.images.filter((img) => img.url.trim() !== '');

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        images: validImages.length > 0 ? validImages : undefined,
      };

      const { data } = await api.post('/products', productData);

      if (data.success) {
        toast.success('Product added successfully!');
        navigate('/admin/products');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-product-form">
      <div className="container">
        <div className="page-header">
          <h1>Add New Product</h1>
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
                placeholder="Enter product name"
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
                placeholder="Enter detailed product description"
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
                  placeholder="0.00"
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
                  placeholder="0"
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
                  value={formData.activeIngredient}
                  onChange={handleChange}
                  placeholder="e.g., Glyphosate 41%"
                />
              </div>

              <div className="form-group">
                <label htmlFor="packSize">Pack Size</label>
                <input
                  type="text"
                  id="packSize"
                  name="packSize"
                  value={formData.packSize}
                  onChange={handleChange}
                  placeholder="e.g., 1 Liter"
                />
              </div>

              <div className="form-group">
                <label htmlFor="manufacturer">Manufacturer</label>
                <input
                  type="text"
                  id="manufacturer"
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleChange}
                  placeholder="Manufacturer name"
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
                placeholder="Enter safety warnings and precautions"
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
                placeholder="Enter usage instructions"
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
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div className="form-group flex-grow">
                    <label>Alt Text</label>
                    <input
                      type="text"
                      value={image.alt}
                      onChange={(e) => handleImageChange(index, 'alt', e.target.value)}
                      placeholder="Image description"
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
            <button type="submit" className="btn btn-primary btn-large" disabled={loading}>
              {loading ? 'Adding Product...' : 'Add Product'}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-secondary btn-large"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddProduct;
