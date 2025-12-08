# Rym GSM - Full-Stack E-commerce Web Application

A complete e-commerce web application for a phone store called Rym GSM, built with React + Vite + TailwindCSS for the frontend, Node.js + Express.js for the backend, and MySQL for the database.

## 🚀 Features

### Frontend (React + Vite + TailwindCSS)
- **Home Page**: Hero banner, featured products, and promotions
- **Products Page**: Product listing with advanced filters (brand, price, RAM, storage) and search
- **Product Details**: Image carousel, full specifications, price, stock info, and add to cart
- **User Authentication**: Register, login, logout using JWT
- **Profile Page**: Display and edit user information
- **Cart Page**: Add/remove products, view total, proceed to checkout
- **Orders Page**: View past orders and their status
- **Contact Page**: Store information, contact form, and Google Maps integration
- **Admin Panel**: Complete product and order management system
- **Responsive Design**: Mobile-first design using TailwindCSS

### Backend (Node.js + Express + MySQL)
- **REST API**: Complete set of endpoints for all functionality
- **JWT Authentication**: Secure user authentication and authorization
- **Admin Protection**: Role-based access control
- **Database Integration**: MySQL with proper schema and relationships
- **Error Handling**: Comprehensive error handling and validation
- **CORS Support**: Cross-origin resource sharing configuration

### Database (MySQL)
- **Users Table**: User management with roles (user/admin)
- **Products Table**: Product catalog with specifications and images
- **Orders Table**: Order management with status tracking
- **Cart Table**: Shopping cart functionality
- **Seed Data**: Pre-populated with sample products

## 📁 Project Structure

```
rym-gsm/
├── rym-gsm-backend/          # Backend API
│   ├── config/
│   │   └── database.js       # Database configuration
│   ├── middleware/
│   │   └── auth.js           # Authentication middleware
│   ├── routes/
│   │   ├── auth.js           # Authentication routes
│   │   ├── products.js       # Product management routes
│   │   ├── cart.js           # Shopping cart routes
│   │   └── orders.js         # Order management routes
│   ├── scripts/
│   │   ├── init-db.sql       # Database initialization
│   │   └── seed.js           # Seed data script
│   ├── server.js             # Main server file
│   ├── package.json          # Backend dependencies
│   └── env.example           # Environment variables example
├── rym-gsm-frontend/         # Frontend React App
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── contexts/         # React contexts (Auth, Cart)
│   │   ├── pages/            # Page components
│   │   ├── config/           # Configuration files
│   │   ├── App.jsx           # Main app component
│   │   └── main.jsx          # Entry point
│   ├── package.json          # Frontend dependencies
│   └── env.example           # Environment variables example
└── README.md                 # This file
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd rym-gsm-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your MySQL credentials:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=rym_gsm
   JWT_SECRET=your_super_secret_jwt_key_here
   PORT=5000
   NODE_ENV=development
   ```

4. **Set up MySQL database:**
   ```bash
   # Login to MySQL
   mysql -u root -p
   
   # Run the initialization script
   source scripts/init-db.sql
   ```

5. **Seed the database with sample data:**
   ```bash
   npm run seed
   ```

6. **Start the backend server:**
   ```bash
   npm run dev
   ```

   The backend will be running on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd rym-gsm-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_APP_NAME=Rym GSM
   VITE_APP_VERSION=1.0.0
   ```

4. **Start the frontend development server:**
   ```bash
   npm run dev
   ```

   The frontend will be running on `http://localhost:5173`

## 🔑 Default Admin Credentials

- **Email:** admin@rymgsm.com
- **Password:** password

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `GET /api/products/brands/list` - Get all brands
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item quantity
- `DELETE /api/cart/remove/:productId` - Remove item from cart
- `DELETE /api/cart/clear` - Clear cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/my-orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `GET /api/orders/admin/all` - Get all orders (Admin only)
- `PUT /api/orders/:id/status` - Update order status (Admin only)

## 🎨 Technologies Used

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **TailwindCSS** - CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Query** - Data fetching and caching
- **React Hook Form** - Form handling
- **Lucide React** - Icon library
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL2** - Database driver
- **JWT** - Authentication
- **Bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Express Validator** - Input validation
- **Multer** - File upload handling

### Database
- **MySQL** - Relational database
- **JSON fields** - For flexible data storage (specs, images, products in orders)

## 🚀 Deployment

### Backend Deployment
1. Set up a MySQL database on your hosting provider
2. Update environment variables with production values
3. Deploy to platforms like Heroku, DigitalOcean, or AWS
4. Run database migrations and seed data

### Frontend Deployment
1. Build the production version: `npm run build`
2. Deploy to platforms like Vercel, Netlify, or AWS S3
3. Update API URL in environment variables

## 📱 Features Overview

### User Features
- Browse and search products with advanced filters
- View detailed product information and specifications
- Add products to cart and manage quantities
- User registration and authentication
- Profile management
- Order history and tracking
- Contact form and store information

### Admin Features
- Complete product management (CRUD operations)
- Order management and status updates
- User management (coming soon)
- Dashboard with statistics and analytics
- Inventory management

### Technical Features
- Responsive mobile-first design
- JWT-based authentication
- Role-based access control
- Input validation and error handling
- Image handling and optimization
- Search and filtering capabilities
- Pagination for large datasets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions, please contact:
- Email: info@rymgsm.com
- Phone: +1 (555) 123-4567

## 🔄 Version History

- **v1.0.0** - Initial release with complete e-commerce functionality

---

**Rym GSM** - Your trusted partner for premium smartphones and accessories! 📱✨
