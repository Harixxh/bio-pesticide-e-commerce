const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// @desc    Get all products with filtering, sorting, and pagination
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  // Build query
  const query = {};

  // Filter by category
  if (req.query.category && req.query.category !== 'all') {
    query.category = req.query.category;
  }

  // Filter by price range
  if (req.query.minPrice || req.query.maxPrice) {
    query.price = {};
    if (req.query.minPrice) {
      query.price.$gte = parseFloat(req.query.minPrice);
    }
    if (req.query.maxPrice) {
      query.price.$lte = parseFloat(req.query.maxPrice);
    }
  }

  // Search by name
  if (req.query.search) {
    query.name = { $regex: req.query.search, $options: 'i' };
  }

  // Filter by stock availability
  if (req.query.inStock === 'true') {
    query.inStock = true;
  }

  // Sort options
  let sortOptions = {};
  if (req.query.sort) {
    switch (req.query.sort) {
      case 'price_asc':
        sortOptions = { price: 1 };
        break;
      case 'price_desc':
        sortOptions = { price: -1 };
        break;
      case 'name_asc':
        sortOptions = { name: 1 };
        break;
      case 'name_desc':
        sortOptions = { name: -1 };
        break;
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }
  } else {
    sortOptions = { createdAt: -1 };
  }

  const products = await Product.find(query)
    .sort(sortOptions)
    .limit(limit)
    .skip(skip);

  const count = await Product.countDocuments(query);

  res.json({
    success: true,
    data: products,
    pagination: {
      page,
      limit,
      total: count,
      pages: Math.ceil(count / limit),
    },
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json({
      success: true,
      data: product,
    });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    category,
    stock,
    images,
    safetyWarnings,
    usageInstructions,
    activeIngredient,
    packSize,
    manufacturer,
  } = req.body;

  const product = await Product.create({
    name,
    description,
    price,
    category,
    stock,
    images,
    safetyWarnings,
    usageInstructions,
    activeIngredient,
    packSize,
    manufacturer,
  });

  res.status(201).json({
    success: true,
    data: product,
  });
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    Object.keys(req.body).forEach(key => {
      product[key] = req.body[key];
    });

    const updatedProduct = await product.save();

    res.json({
      success: true,
      data: updatedProduct,
    });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.deleteOne();
    res.json({
      success: true,
      message: 'Product removed',
    });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ featured: true }).limit(8);

  res.json({
    success: true,
    data: products,
  });
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
};
