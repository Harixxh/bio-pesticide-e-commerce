# Pesticide E-Commerce Website

A full-stack e-commerce platform for buying and selling pesticides and agricultural products, built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## 🌟 Features

### User Features
- **Browse Products Without Login**: View all products and their details without authentication
- **Advanced Search & Filtering**: Filter by category, price range, and search by name
- **Shopping Cart**: Add products to cart (stored in localStorage before login)
- **User Authentication**: Secure JWT-based registration and login
- **Checkout Process**: Complete purchase with shipping address and payment method selection
- **Order Management**: View order history and track order status
- **Profile Management**: Update personal information and address
- **Order Cancellation**: Cancel orders before delivery

### Admin Features
- **Secure Admin Dashboard**: Comprehensive overview of store statistics
- **Product Management**: Full CRUD operations for products with image support
- **Order Management**: View all orders and update order status
- **User Management**: View registered users and manage accounts
- **Analytics**: Track total revenue, orders, users, and products

### Security Features
- JWT authentication with secure token storage
- Password hashing with bcrypt
- Protected routes for authenticated users
- Admin-only routes with role-based access control
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS configuration
- Helmet.js security headers

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **Context API** - State management
- **Axios** - HTTP client
- **React Toastify** - Toast notifications
- **CSS3** - Styling

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt.js** - Password hashing
- **Multer** - File uploads
- **Express Validator** - Input validation
- **Helmet** - Security headers
- **Morgan** - HTTP request logger
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
pesticide-e-commerce/
├── server/                    # Backend
│   ├── config/
│   │   └── db.js             # Database connection
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── orderController.js
│   │   └── productController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── models/
│   │   ├── Cart.js
│   │   ├── Order.js
│   │   ├── Product.js
│   │   └── User.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── orderRoutes.js
│   │   └── productRoutes.js
│   ├── uploads/              # Uploaded images
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js             # Entry point
│
└── client/                    # Frontend
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── AdminRoute.js
    │   │   ├── Footer.js
    │   │   ├── Loading.js
    │   │   ├── Navbar.js
    │   │   ├── ProductCard.js
    │   │   └── ProtectedRoute.js
    │   ├── context/
    │   │   ├── AuthContext.js
    │   │   └── CartContext.js
    │   ├── pages/
    │   │   ├── admin/
    │   │   │   ├── AdminAddProduct.js
    │   │   │   ├── AdminDashboard.js
    │   │   │   ├── AdminEditProduct.js
    │   │   │   ├── AdminLogin.js
    │   │   │   ├── AdminOrders.js
    │   │   │   ├── AdminProducts.js
    │   │   │   └── AdminUsers.js
    │   │   ├── Cart.js
    │   │   ├── Checkout.js
    │   │   ├── Home.js
    │   │   ├── Login.js
    │   │   ├── OrderConfirmation.js
    │   │   ├── OrderDetail.js
    │   │   ├── OrderHistory.js
    │   │   ├── ProductDetail.js
    │   │   ├── Products.js
    │   │   ├── Profile.js
    │   │   ├── Register.js
    │   │   └── UserDashboard.js
    │   ├── utils/
    │   │   └── api.js
    │   ├── App.js
    │   ├── App.css
    │   ├── index.js
    │   └── index.css
    ├── package.json
    └── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000
MONGO_URI=mongodb://localhost:27017/pesticide-ecommerce
JWT_SECRET=your_jwt_secret_key_change_this_in_production
ADMIN_EMAIL=admin@pesticide.com
ADMIN_PASSWORD=admin123
```

5. Start the server:
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. Open a new terminal and navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional):
```bash
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the React app:
```bash
npm start
```

The client will run on `http://localhost:3000`

## 📝 API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (Protected)
- `PUT /api/auth/profile` - Update user profile (Protected)

### Product Routes (Public)
- `GET /api/products` - Get all products with filtering and pagination
- `GET /api/products/:id` - Get single product
- `GET /api/products/featured` - Get featured products

### Product Routes (Admin)
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `POST /api/products/upload` - Upload product images

### Order Routes
- `POST /api/orders` - Create order (Protected)
- `GET /api/orders` - Get all orders (Admin)
- `GET /api/orders/user/myorders` - Get user's orders (Protected)
- `GET /api/orders/:id` - Get single order (Protected)
- `PUT /api/orders/:id/status` - Update order status (Admin)
- `PUT /api/orders/:id/cancel` - Cancel order (Protected)

### Admin Routes
- `POST /api/admin/login` - Admin login
- `GET /api/admin/users` - Get all users (Admin)
- `GET /api/admin/users/:id` - Get user by ID (Admin)
- `DELETE /api/admin/users/:id` - Delete user (Admin)
- `GET /api/admin/stats` - Get dashboard statistics (Admin)

## 🔐 Default Admin Credentials

```
Email: admin@pesticide.com
Password: admin123
```

⚠️ **Important**: Change these credentials in production!

## 🎨 Product Categories

- Insecticides
- Herbicides
- Fungicides
- Rodenticides
- Plant Growth Regulators
- Bio-Pesticides
- Other

## 💳 Payment Methods Supported

- Cash on Delivery
- Credit Card
- Debit Card
- UPI
- Net Banking

## 📦 Order Status Flow

1. **Pending** - Order placed, awaiting processing
2. **Processing** - Order being prepared
3. **Shipped** - Order dispatched
4. **Delivered** - Order completed
5. **Cancelled** - Order cancelled by user or admin

## 🔥 Key Features Explained

### Cart Persistence
- Cart items are stored in localStorage
- Cart persists across browser sessions
- Cart is maintained even without login
- After login, cart continues from where user left off

### Authentication Flow
1. Users can browse all products without login
2. Login is required only at checkout
3. Users are redirected back to checkout after login
4. JWT tokens are stored in localStorage
5. Automatic token refresh on page reload

### Image Upload
- Supports multiple images per product
- File size limit: 5MB
- Allowed formats: JPEG, JPG, PNG, GIF, WebP
- Images stored in `server/uploads/` directory

### Security Measures
- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens expire after 30 days
- Rate limiting: 100 requests per 15 minutes per IP
- Protected routes require valid JWT token
- Admin routes require admin role
- Input validation on all forms
- XSS protection with Helmet
- CORS configured for specific origin

## 🧪 Testing

To test the application:

1. **User Flow**:
   - Browse products on home page
   - Filter/search products
   - Add products to cart
   - Proceed to checkout (triggers login)
   - Complete order
   - View order history

2. **Admin Flow**:
   - Login at `/admin/login`
   - View dashboard statistics
   - Add new products
   - Edit existing products
   - Manage orders (update status)
   - View registered users

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongosh

# For MongoDB Atlas, ensure IP is whitelisted
```

### Port Already in Use
```bash
# Kill process on port 5000
npx kill-port 5000

# Or change PORT in .env file
```

### CORS Errors
- Ensure CLIENT_URL in server .env matches your React app URL
- Check CORS configuration in server.js

## 📚 Future Enhancements

- [ ] Email notifications for orders
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Discount codes/coupons
- [ ] Invoice generation (PDF)
- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Product recommendations
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Dark mode

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Built with ❤️ for agricultural e-commerce solutions

## 🙏 Acknowledgments

- MongoDB documentation
- Express.js documentation
- React.js documentation
- Node.js documentation
- Stack Overflow community

---

**Note**: This is a development project. For production deployment:
1. Use environment variables for all sensitive data
2. Change default admin credentials
3. Set up proper database backups
4. Implement proper error logging
5. Use HTTPS
6. Set up monitoring and alerts
7. Optimize images and assets
8. Implement CDN for static assets
