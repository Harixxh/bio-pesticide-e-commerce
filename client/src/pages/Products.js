import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import api from '../utils/api';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || 'all',
    search: searchParams.get('search') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'newest',
  });
  const [pagination, setPagination] = useState({});

  const categories = [
    'all',
    'Insecticides',
    'Herbicides',
    'Fungicides',
    'Rodenticides',
    'Plant Growth Regulators',
    'Bio-Pesticides',
    'Other'
  ];

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      if (filters.category !== 'all') params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.sort) params.append('sort', filters.sort);

      const { data } = await api.get(`/products?${params.toString()}`);
      
      if (data.success) {
        setProducts(data.data);
        setPagination(data.pagination);
      }
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);

    // Update URL params
    const params = new URLSearchParams();
    Object.keys(newFilters).forEach(key => {
      if (newFilters[key] && newFilters[key] !== 'all') {
        params.set(key, newFilters[key]);
      }
    });
    setSearchParams(params);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const resetFilters = () => {
    setFilters({
      category: 'all',
      search: '',
      minPrice: '',
      maxPrice: '',
      sort: 'newest',
    });
    setSearchParams({});
  };

  if (loading) return <Loading />;

  return (
    <div className="products-page">
      <div className="container">
        <h1>Our Products</h1>

        <div className="products-layout">
          <aside className="filters-sidebar">
            <h3>Filters</h3>

            <div className="filter-group">
              <label>Search Products</label>
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Search..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="filter-input"
                />
              </form>
            </div>

            <div className="filter-group">
              <label>Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="filter-select"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Price Range</label>
              <div className="price-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="filter-input"
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="filter-input"
                />
              </div>
            </div>

            <div className="filter-group">
              <label>Sort By</label>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="filter-select"
              >
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name_asc">Name: A to Z</option>
                <option value="name_desc">Name: Z to A</option>
              </select>
            </div>

            <button onClick={resetFilters} className="btn btn-secondary btn-block">
              Reset Filters
            </button>
          </aside>

          <div className="products-content">
            {error && <p className="error-message">{error}</p>}

            {products.length === 0 ? (
              <div className="no-products">
                <p>No products found matching your criteria.</p>
              </div>
            ) : (
              <>
                <div className="products-header">
                  <p>{pagination.total} products found</p>
                </div>
                <div className="products-grid">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
