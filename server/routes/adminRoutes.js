const express = require('express');
const router = express.Router();
const {
  adminLogin,
  getAllUsers,
  getUserById,
  deleteUser,
  getDashboardStats,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/login', adminLogin);
router.get('/users', protect, admin, getAllUsers);
router.get('/users/:id', protect, admin, getUserById);
router.delete('/users/:id', protect, admin, deleteUser);
router.get('/stats', protect, admin, getDashboardStats);

module.exports = router;
