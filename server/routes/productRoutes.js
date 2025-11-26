const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:id', getProductById);

// Admin routes
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

// Image upload route
router.post('/upload', protect, admin, upload.array('images', 5), (req, res) => {
  const imageUrls = req.files.map(file => ({
    url: `/uploads/${file.filename}`,
    alt: file.originalname,
  }));
  
  res.json({
    success: true,
    data: imageUrls,
  });
});

module.exports = router;
