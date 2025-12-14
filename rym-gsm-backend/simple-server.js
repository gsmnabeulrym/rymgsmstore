require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query, getPool, getDbType } = require('./config/database');

const productsRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const reviewRoutes = require('./routes/mock-reviews');
const searchRoutes = require('./routes/search');
const wishlistRoutes = require('./routes/wishlist');
const notificationRoutes = require('./routes/notifications');
const adminNotificationRoutes = require('./routes/admin-notifications');
const chatbotRoutes = require('./routes/chatbot');
const analyticsRoutes = require('./routes/analytics-fixed');
const comparisonRoutes = require('./routes/comparison');

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'rym-gsm-secret-key-2024';

// Get database pool from config
const pool = getPool();

// Data persistence file
const DATA_FILE = path.join(__dirname, 'data.json');

// Load data from file or create default
function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
      return data;
    }
  } catch (error) {
    console.log('Error loading data file, using defaults:', error.message);
  }
  
  // Return default data
  return {
    users: [
      {
        id: 1,
        name: 'Admin User',
        email: 'admin@rymgsm.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        phone: '+1234567890',
        address: '123 Admin St, City, State',
        role: 'admin',
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        name: 'John Doe',
        email: 'john@example.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        phone: '+1234567891',
        address: '456 User Ave, City, State',
        role: 'user',
        created_at: new Date().toISOString()
      }
    ],
    products: [
      {
        id: 1,
        name: 'iPhone 15 Pro',
        brand: 'Apple',
        price: 999.99,
        stock: 25,
        category: 'phone',
        images: [
          'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500',
          'https://images.unsplash.com/photo-1511707171631-9ed2a79be0f3?w=500'
        ],
        specs: {
          ram: '8GB',
          storage: '128GB',
          camera: '48MP Main, 12MP Ultra Wide, 12MP Telephoto',
          battery: '3274 mAh',
          display: '6.1-inch Super Retina XDR',
          processor: 'A17 Pro chip'
        },
        description: 'The latest iPhone with titanium design and advanced camera system.'
      },
      {
        id: 2,
        name: 'Samsung Galaxy S24 Ultra',
        brand: 'Samsung',
        price: 1199.99,
        stock: 20,
        category: 'phone',
        images: [
          'https://images.unsplash.com/photo-1511707171631-9ed2a79be0f3?w=500',
          'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500'
        ],
        specs: {
          ram: '12GB',
          storage: '256GB',
          camera: '200MP Main, 12MP Ultra Wide, 10MP Telephoto, 10MP Periscope',
          battery: '5000 mAh',
          display: '6.8-inch Dynamic AMOLED 2X',
          processor: 'Snapdragon 8 Gen 3'
        },
        description: 'Premium Android flagship with S Pen and advanced AI features.'
      },
      {
        id: 3,
        name: 'Google Pixel 8 Pro',
        brand: 'Google',
        price: 899.99,
        stock: 15,
        category: 'phone',
        images: [
          'https://images.unsplash.com/photo-1511707171631-9ed2a79be0f3?w=500',
          'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500'
        ],
        specs: {
          ram: '12GB',
          storage: '128GB',
          camera: '50MP Main, 48MP Ultra Wide, 48MP Telephoto',
          battery: '5050 mAh',
          display: '6.7-inch LTPO OLED',
          processor: 'Google Tensor G3'
        },
        description: 'AI-powered smartphone with exceptional camera capabilities.'
      },
      {
        id: 4,
        name: 'AirPods Pro (2nd Gen)',
        brand: 'Apple',
        price: 249.99,
        stock: 50,
        category: 'accessory',
        images: [
          'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500'
        ],
        specs: {
          battery: 'Up to 6 hours listening time',
          connectivity: 'Bluetooth 5.3',
          features: 'Active Noise Cancellation, Spatial Audio, Adaptive Transparency',
          case: 'MagSafe Charging Case'
        },
        description: 'Premium wireless earbuds with active noise cancellation.'
      }
    ],
    carts: {},
    orders: [
      {
        id: 1,
        user_id: 1,
        products: [
          { product_id: 1, name: 'iPhone 15 Pro', price: 999.99, quantity: 1 },
          { product_id: 2, name: 'Samsung Galaxy S24 Ultra', price: 1199.99, quantity: 1 }
        ],
        total: 2199.98,
        status: 'pending',
        created_at: new Date('2024-01-15T10:30:00Z').toISOString()
      },
      {
        id: 2,
        user_id: 2,
        products: [
          { product_id: 3, name: 'Google Pixel 8 Pro', price: 899.99, quantity: 1 }
        ],
        total: 899.99,
        status: 'shipped',
        created_at: new Date('2024-01-10T14:20:00Z').toISOString()
      }
    ]
  };
}

// Save data to file
function saveData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving data file:', error.message);
  }
}

// Load initial data
let data = loadData();
const mockUsers = data.users;
const mockProducts = data.products;
const mockCarts = data.carts;
const mockOrders = data.orders;

// Middleware to authenticate user
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: decoded.userId };
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// Middleware
app.use(cors({
  origin: true, // Allow all origins for development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Rym GSM API is running',
    timestamp: new Date().toISOString(),
    environment: 'development'
  });
});

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      });
    }
    
    // Get user from database
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (rows.length === 0) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }
    
    const user = rows[0];

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Name, email, and password are required'
      });
    }
    
    // Check if user already exists
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    
    if (existingUsers.length > 0) {
      return res.status(400).json({
        message: 'User already exists with this email'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password, phone, address, role) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, hashedPassword, phone || null, address || null, 'user']
    );

    const newUser = {
      id: result.insertId,
      name,
      email,
      phone: phone || null,
      address: address || null,
      role: 'user'
    };

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: newUser
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

app.get('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, name, email, phone, address, role FROM users WHERE id = ?',
      [req.user.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const user = rows[0];
    
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
});

app.put('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    
    // Check if user exists
    const [existingUser] = await pool.execute(
      'SELECT * FROM users WHERE id = ?',
      [req.user.id]
    );
    
    if (existingUser.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== existingUser[0].email) {
      const [emailCheck] = await pool.execute(
        'SELECT id FROM users WHERE email = ? AND id != ?',
        [email, req.user.id]
      );
      
      if (emailCheck.length > 0) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    // Build update query dynamically
    const updates = [];
    const params = [];
    
    if (name !== undefined) { updates.push('name = ?'); params.push(name); }
    if (email !== undefined) { updates.push('email = ?'); params.push(email); }
    if (phone !== undefined) { updates.push('phone = ?'); params.push(phone); }
    if (address !== undefined) { updates.push('address = ?'); params.push(address); }
    
    if (updates.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }
    
    params.push(req.user.id);
    
    // Update user in database
    await pool.execute(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    // Get updated user
    const [updatedUser] = await pool.execute(
      'SELECT id, name, email, phone, address, role FROM users WHERE id = ?',
      [req.user.id]
    );
    
    res.json({
      message: 'Profile updated successfully',
      user: updatedUser[0]
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
});

// Products routes
app.get('/api/products', async (req, res) => {
  try {
    const { page = 1, limit = 12, brand, category, minPrice, maxPrice, search, ram, storage } = req.query;
    
    console.log('📦 GET /api/products - Query params:', req.query);
    
    let query = 'SELECT * FROM products WHERE 1=1';
    let countQuery = 'SELECT COUNT(*) as total FROM products WHERE 1=1';
    const params = [];
    
    // Apply filters
    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ?)';
      countQuery += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    
    if (brand) {
      query += ' AND brand = ?';
      countQuery += ' AND brand = ?';
      params.push(brand);
    }
    
    if (category) {
      query += ' AND category = ?';
      countQuery += ' AND category = ?';
      params.push(category);
    }
    
    if (minPrice) {
      query += ' AND price >= ?';
      countQuery += ' AND price >= ?';
      params.push(parseFloat(minPrice));
    }
    
    if (maxPrice) {
      query += ' AND price <= ?';
      countQuery += ' AND price <= ?';
      params.push(parseFloat(maxPrice));
    }
    
    if (ram) {
      query += ' AND JSON_EXTRACT(specs, "$.ram") = ?';
      countQuery += ' AND JSON_EXTRACT(specs, "$.ram") = ?';
      params.push(ram);
    }
    
    if (storage) {
      query += ' AND JSON_EXTRACT(specs, "$.storage") = ?';
      countQuery += ' AND JSON_EXTRACT(specs, "$.storage") = ?';
      params.push(storage);
    }
    
    // Get total count
    const [countResult] = await pool.execute(countQuery, params);
    const totalProducts = countResult[0].total;
    
    // Add pagination
    const offset = (page - 1) * limit;
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);
    
    // Get products
    console.log('🔍 Executing query:', query);
    console.log('📝 With params:', params);
    const [rows] = await pool.execute(query, params);
    
    console.log(`✅ Found ${rows.length} products, Total: ${totalProducts}`);
    
    // Parse JSON fields
    const products = rows.map(product => ({
      ...product,
      images: JSON.parse(product.images || '[]'),
      specs: JSON.parse(product.specs || '{}')
    }));
    
    res.json({
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalProducts / limit),
        totalProducts,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error fetching products' });
  }
});

app.get('/api/products/brands/list', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT DISTINCT brand FROM products ORDER BY brand');
    const brands = rows.map(row => row.brand);
    res.json({ brands });
  } catch (error) {
    console.error('Error fetching brands:', error);
    res.status(500).json({ message: 'Server error fetching brands' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute('SELECT * FROM products WHERE id = ?', [parseInt(id)]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const product = {
      ...rows[0],
      images: JSON.parse(rows[0].images || '[]'),
      specs: JSON.parse(rows[0].specs || '{}')
    };
    
    res.json({ product });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Server error fetching product' });
  }
});

// Admin product management routes
app.post('/api/products', async (req, res) => {
  try {
    console.log('🛍️ POST /api/products - Product creation via simple-server.js');
    console.log('📋 Request body:', req.body);
    
    const { name, brand, price, category, images, specs, description } = req.body;
    // Stock is optional - default to 999 (unlimited) if not provided
    const stockValue = (req.body.stock !== undefined && req.body.stock !== null && req.body.stock !== '') 
      ? parseInt(req.body.stock) 
      : 999;
    
    if (!name || !brand || !price || !category) {
      return res.status(400).json({ message: 'Name, brand, price, and category are required' });
    }

    const [result] = await pool.execute(
      'INSERT INTO products (name, brand, price, stock, category, images, specs, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        name,
        brand,
        parseFloat(price),
        stockValue,
        category,
        JSON.stringify(images || []),
        JSON.stringify(specs || {}),
        description || ''
      ]
    );

    const productId = result.insertId;
    
    // 🔔 ADD NOTIFICATION FUNCTIONALITY HERE!
    console.log(`🔔 Creating notifications for new product: ${name} (ID: ${productId})`);
    try {
      const notificationService = require('./services/notificationService');
      await notificationService.notifyNewProduct(productId, name, brand, parseFloat(price), category);
      console.log(`✅ Notification creation completed for product: ${name}`);
    } catch (notificationError) {
      console.error(`❌ Failed to create notifications for product ${name}:`, notificationError);
      // Don't fail the product creation if notifications fail
    }

    const newProduct = {
      id: productId,
      name,
      brand,
      price: parseFloat(price),
      stock: stockValue,
      category,
      images: images || [],
      specs: specs || {},
      description: description || ''
    };

    res.status(201).json({
      message: 'Product created successfully',
      product: newProduct
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error creating product' });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, brand, price, stock, category, images, specs, description } = req.body;
    
    // Check if product exists
    const [existing] = await pool.execute('SELECT * FROM products WHERE id = ?', [parseInt(id)]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Build update query dynamically
    const updates = [];
    const params = [];
    
    if (name !== undefined) { updates.push('name = ?'); params.push(name); }
    if (brand !== undefined) { updates.push('brand = ?'); params.push(brand); }
    if (price !== undefined) { updates.push('price = ?'); params.push(parseFloat(price)); }
    if (stock !== undefined) { updates.push('stock = ?'); params.push(parseInt(stock)); }
    if (category !== undefined) { updates.push('category = ?'); params.push(category); }
    if (images !== undefined) { updates.push('images = ?'); params.push(JSON.stringify(images)); }
    if (specs !== undefined) { updates.push('specs = ?'); params.push(JSON.stringify(specs)); }
    if (description !== undefined) { updates.push('description = ?'); params.push(description); }
    
    if (updates.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }
    
    params.push(parseInt(id));
    
    await pool.execute(
      `UPDATE products SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    // Get updated product
    const [updated] = await pool.execute('SELECT * FROM products WHERE id = ?', [parseInt(id)]);
    const product = {
      ...updated[0],
      images: JSON.parse(updated[0].images || '[]'),
      specs: JSON.parse(updated[0].specs || '{}')
    };

    res.json({
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error updating product' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get product before deletion
    const [existing] = await pool.execute('SELECT * FROM products WHERE id = ?', [parseInt(id)]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const deletedProduct = {
      ...existing[0],
      images: JSON.parse(existing[0].images || '[]'),
      specs: JSON.parse(existing[0].specs || '{}')
    };

    // Delete product
    await pool.execute('DELETE FROM products WHERE id = ?', [parseInt(id)]);

    res.json({
      message: 'Product deleted successfully',
      product: deletedProduct
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error deleting product' });
  }
});

// Cart routes
app.get('/api/cart', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const [rows] = await pool.execute(
      'SELECT products FROM cart WHERE user_id = ?',
      [userId]
    );
    
    let cart = { products: [], total: 0 };
    
    if (rows.length > 0) {
      let products = JSON.parse(rows[0].products || '[]');
      
      // Fetch actual product images for products that don't have images stored
      for (let i = 0; i < products.length; i++) {
        if (!products[i].image && products[i].productId) {
          try {
            const [productRows] = await pool.execute(
              'SELECT images FROM products WHERE id = ?',
              [products[i].productId]
            );
            if (productRows.length > 0 && productRows[0].images) {
              const images = JSON.parse(productRows[0].images || '[]');
              products[i].image = images[0] || '';
            }
          } catch (err) {
            // Silently fail
          }
        }
      }
      
      const total = products.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
      cart = { products, total };
    }

    res.json({ cart });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Server error fetching cart' });
  }
});

app.post('/api/cart/add', authenticateToken, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user.id;

    if (!productId || quantity < 1) {
      return res.status(400).json({ message: 'Valid product ID and quantity required' });
    }

    // Get product from database
    const [productRows] = await pool.execute(
      'SELECT * FROM products WHERE id = ?',
      [parseInt(productId)]
    );
    
    if (productRows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const product = {
      ...productRows[0],
      images: JSON.parse(productRows[0].images || '[]')
    };

    // Get existing cart
    const [cartRows] = await pool.execute(
      'SELECT products FROM cart WHERE user_id = ?',
      [userId]
    );
    
    let cartProducts = [];
    
    if (cartRows.length > 0) {
      cartProducts = JSON.parse(cartRows[0].products || '[]');
    }
    
    const existingItemIndex = cartProducts.findIndex(item => item.productId === parseInt(productId));

    if (existingItemIndex > -1) {
      // Update quantity
      cartProducts[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cartProducts.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0] || '',
        quantity: quantity
      });
    }

    // Save cart to database
    if (cartRows.length > 0) {
      await pool.execute(
        'UPDATE cart SET products = ? WHERE user_id = ?',
        [JSON.stringify(cartProducts), userId]
      );
    } else {
      await pool.execute(
        'INSERT INTO cart (user_id, products) VALUES (?, ?)',
        [userId, JSON.stringify(cartProducts)]
      );
    }

    res.json({ message: 'Item added to cart successfully' });

  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Server error adding item to cart' });
  }
});

app.put('/api/cart/update', authenticateToken, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    if (!productId || quantity < 0) {
      return res.status(400).json({ message: 'Valid product ID and quantity required' });
    }

    // Get existing cart
    const [cartRows] = await pool.execute(
      'SELECT products FROM cart WHERE user_id = ?',
      [userId]
    );
    
    if (cartRows.length === 0) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    let cartProducts = JSON.parse(cartRows[0].products || '[]');
    const itemIndex = cartProducts.findIndex(item => item.productId === parseInt(productId));
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    if (quantity === 0) {
      // Remove item
      cartProducts.splice(itemIndex, 1);
    } else {
      // Update quantity
      cartProducts[itemIndex].quantity = quantity;
    }

    // Update cart in database
    await pool.execute(
      'UPDATE cart SET products = ? WHERE user_id = ?',
      [JSON.stringify(cartProducts), userId]
    );

    res.json({ message: 'Cart updated successfully' });

  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ message: 'Server error updating cart' });
  }
});

app.delete('/api/cart/remove/:productId', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    // Get existing cart
    const [cartRows] = await pool.execute(
      'SELECT products FROM cart WHERE user_id = ?',
      [userId]
    );
    
    if (cartRows.length === 0) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    let cartProducts = JSON.parse(cartRows[0].products || '[]');
    const itemIndex = cartProducts.findIndex(item => item.productId === parseInt(productId));
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Remove item
    cartProducts.splice(itemIndex, 1);

    // Update cart in database
    await pool.execute(
      'UPDATE cart SET products = ? WHERE user_id = ?',
      [JSON.stringify(cartProducts), userId]
    );

    res.json({ message: 'Item removed from cart successfully' });

  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Server error removing item from cart' });
  }
});

app.delete('/api/cart/clear', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Clear cart in database
    await pool.execute(
      'DELETE FROM cart WHERE user_id = ?',
      [userId]
    );

    res.json({ message: 'Cart cleared successfully' });

  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: 'Server error clearing cart' });
  }
});

// Orders routes
app.get('/api/orders/my-orders', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const [rows] = await pool.execute(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    
    // Process orders and fetch missing product images
    const orders = await Promise.all(rows.map(async (order) => {
      let products = JSON.parse(order.products || '[]');
      
      // Fetch actual product images for products that don't have images stored
      for (let i = 0; i < products.length; i++) {
        if (!products[i].image && products[i].productId) {
          try {
            const [productRows] = await pool.execute(
              'SELECT images FROM products WHERE id = ?',
              [products[i].productId]
            );
            if (productRows.length > 0 && productRows[0].images) {
              const images = JSON.parse(productRows[0].images || '[]');
              products[i].image = images[0] || '';
            }
          } catch (err) {
            // Silently fail
          }
        }
      }
      
      return {
        ...order,
        products
      };
    }));
    
    res.json({
      success: true,
      orders,
      total: orders.length
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching user orders' 
    });
  }
});

app.get('/api/orders/admin/all', async (req, res) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;
    
    let query = 'SELECT * FROM orders WHERE 1=1';
    let countQuery = 'SELECT COUNT(*) as total FROM orders WHERE 1=1';
    const params = [];
    
    // Apply status filter
    if (status) {
      query += ' AND status = ?';
      countQuery += ' AND status = ?';
      params.push(status);
    }
    
    // Apply search filter (search in order ID)
    if (search) {
      query += ' AND id LIKE ?';
      countQuery += ' AND id LIKE ?';
      params.push(`%${search}%`);
    }
    
    // Get total count
    const [countResult] = await pool.execute(countQuery, params);
    const totalOrders = countResult[0].total;
    
    // Add pagination and ordering
    const offset = (page - 1) * limit;
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);
    
    // Get orders
    const [rows] = await pool.execute(query, params);
    
    const orders = rows.map(order => ({
      ...order,
      products: JSON.parse(order.products || '[]')
    }));
    
    res.json({
      success: true,
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching admin orders' 
    });
  }
});

app.post('/api/orders', authenticateToken, async (req, res) => {
  try {
    console.log('=== ORDER CREATION REQUEST ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('User ID:', req.user.id);
    console.log('User role:', req.user.role);
    
    const { items, products, total, totalAmount, shippingAddress, paymentMethod, status } = req.body;
    const userId = req.user.id;
    
    // Handle both old and new format
    const orderItems = items || products;
    const orderTotal = totalAmount || total;
    const orderStatus = status || 'pending';
    
    console.log('Processed order data:');
    console.log('- Items:', orderItems);
    console.log('- Total:', orderTotal);
    console.log('- Status:', orderStatus);
    
    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order items are required'
      });
    }

    if (!orderTotal || orderTotal <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid total amount is required'
      });
    }

    // Prepare shipping address string
    let shippingAddressStr = '';
    if (shippingAddress) {
      shippingAddressStr = `${shippingAddress.firstName} ${shippingAddress.lastName}\n${shippingAddress.address}\n${shippingAddress.city}, ${shippingAddress.postalCode}\n${shippingAddress.country}\nPhone: ${shippingAddress.phone}\nEmail: ${shippingAddress.email}`;
    }

    // Add payment_method column if it doesn't exist
    try {
      await pool.execute('ALTER TABLE orders ADD COLUMN payment_method VARCHAR(50) DEFAULT "cash"');
    } catch (error) {
      // Column already exists, ignore error
    }

    // Create order in database
    console.log('Inserting order into database...');
    const [result] = await pool.execute(
      'INSERT INTO orders (user_id, products, total, status, shipping_address, payment_method) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, JSON.stringify(orderItems), orderTotal, orderStatus, shippingAddressStr, paymentMethod || 'cash']
    );
    
    console.log('Order inserted with ID:', result.insertId);

    const newOrder = {
      id: result.insertId,
      user_id: userId,
      products: orderItems,
      total: orderTotal,
      status: orderStatus,
      shipping_address: shippingAddressStr,
      payment_method: paymentMethod || 'cash',
      created_at: new Date().toISOString()
    };

    // Clear user's cart after successful order
    console.log('Clearing user cart...');
    await pool.execute(
      'DELETE FROM cart WHERE user_id = ?',
      [userId]
    );
    console.log('Cart cleared successfully');

    console.log('Sending success response...');
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: newOrder
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error creating order' 
    });
  }
});

app.put('/api/orders/:id/status', async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const { status } = req.body;

    if (!['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be pending, confirmed, shipped, delivered, or cancelled'
      });
    }

    // Check if order exists and update
    const [result] = await pool.execute(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, orderId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Get updated order
    const [rows] = await pool.execute(
      'SELECT * FROM orders WHERE id = ?',
      [orderId]
    );
    
    const order = {
      ...rows[0],
      products: JSON.parse(rows[0].products || '[]')
    };

    res.json({
      success: true,
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error updating order status' 
    });
  }
});

app.get('/api/orders/:id', authenticateToken, async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';
    
    // Build query based on user role
    let query = 'SELECT * FROM orders WHERE id = ?';
    let params = [orderId];
    
    // Non-admin users can only see their own orders
    if (!isAdmin) {
      query += ' AND user_id = ?';
      params.push(userId);
    }
    
    const [rows] = await pool.execute(query, params);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    let products = JSON.parse(rows[0].products || '[]');
    
    // Fetch actual product images for products that don't have images stored
    for (let i = 0; i < products.length; i++) {
      if (!products[i].image && products[i].productId) {
        try {
          const [productRows] = await pool.execute(
            'SELECT images FROM products WHERE id = ?',
            [products[i].productId]
          );
          if (productRows.length > 0 && productRows[0].images) {
            const images = JSON.parse(productRows[0].images || '[]');
            products[i].image = images[0] || '';
          }
        } catch (err) {
          console.log('Could not fetch product image:', err.message);
        }
      }
    }

    const order = {
      ...rows[0],
      products
    };

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching order' 
    });
  }
});

// Admin Dashboard Routes

// Get dashboard statistics
app.get('/api/admin/dashboard/stats', async (req, res) => {
  try {
    // Get total users count
    const [usersCount] = await pool.execute('SELECT COUNT(*) as total FROM users');
    
    // Get total products count
    const [productsCount] = await pool.execute('SELECT COUNT(*) as total FROM products');
    
    // Get total orders count
    const [ordersCount] = await pool.execute('SELECT COUNT(*) as total FROM orders');
    
    // Get orders by status
    const [ordersByStatus] = await pool.execute(`
      SELECT status, COUNT(*) as count 
      FROM orders 
      GROUP BY status
    `);
    
    // Get recent orders
    const [recentOrders] = await pool.execute(`
      SELECT o.*, u.name as user_name 
      FROM orders o 
      JOIN users u ON o.user_id = u.id 
      ORDER BY o.created_at DESC 
      LIMIT 5
    `);
    
    // Calculate total revenue
    const [revenue] = await pool.execute(`
      SELECT SUM(total) as total_revenue 
      FROM orders 
      WHERE status != 'cancelled'
    `);

    const stats = {
      totalUsers: usersCount[0].total,
      totalProducts: productsCount[0].total,
      totalOrders: ordersCount[0].total,
      totalRevenue: revenue[0].total_revenue || 0,
      ordersByStatus: ordersByStatus.reduce((acc, item) => {
        acc[item.status] = item.count;
        return acc;
      }, {}),
      recentOrders: recentOrders.map(order => ({
        ...order,
        products: JSON.parse(order.products || '[]')
      }))
    };

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching dashboard statistics' 
    });
  }
});

// Users management routes
app.get('/api/users', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, role } = req.query;
    
    let query = 'SELECT id, name, email, phone, address, role, created_at FROM users WHERE 1=1';
    let countQuery = 'SELECT COUNT(*) as total FROM users WHERE 1=1';
    const params = [];
    
    // Apply search filter
    if (search) {
      query += ' AND (name LIKE ? OR email LIKE ?)';
      countQuery += ' AND (name LIKE ? OR email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    
    // Apply role filter
    if (role) {
      query += ' AND role = ?';
      countQuery += ' AND role = ?';
      params.push(role);
    }
    
    // Get total count
    const [countResult] = await pool.execute(countQuery, params);
    const totalUsers = countResult[0].total;
    
    // Add pagination
    const offset = (page - 1) * limit;
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);
    
    // Get users
    const [users] = await pool.execute(query, params);
    
    res.json({
      success: true,
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching users' 
    });
  }
});

// Create new user (admin only)
app.post('/api/users', async (req, res) => {
  try {
    const { name, email, password, phone, address, role = 'user' } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }
    
    // Check if user already exists
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    
    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password, phone, address, role) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, hashedPassword, phone || null, address || null, role]
    );

    const newUser = {
      id: result.insertId,
      name,
      email,
      phone: phone || null,
      address: address || null,
      role,
      created_at: new Date().toISOString()
    };

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: newUser
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error creating user' 
    });
  }
});

// Update user (admin only)
app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address, role } = req.body;
    
    // Check if user exists
    const [existingUser] = await pool.execute(
      'SELECT * FROM users WHERE id = ?',
      [parseInt(id)]
    );
    
    if (existingUser.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== existingUser[0].email) {
      const [emailCheck] = await pool.execute(
        'SELECT id FROM users WHERE email = ? AND id != ?',
        [email, parseInt(id)]
      );
      
      if (emailCheck.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use'
        });
      }
    }

    // Build update query dynamically
    const updates = [];
    const params = [];
    
    if (name !== undefined) { updates.push('name = ?'); params.push(name); }
    if (email !== undefined) { updates.push('email = ?'); params.push(email); }
    if (phone !== undefined) { updates.push('phone = ?'); params.push(phone); }
    if (address !== undefined) { updates.push('address = ?'); params.push(address); }
    if (role !== undefined) { updates.push('role = ?'); params.push(role); }
    
    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }
    
    params.push(parseInt(id));
    
    // Update user in database
    await pool.execute(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    // Get updated user
    const [updatedUser] = await pool.execute(
      'SELECT id, name, email, phone, address, role, created_at FROM users WHERE id = ?',
      [parseInt(id)]
    );
    
    res.json({
      success: true,
      message: 'User updated successfully',
      user: updatedUser[0]
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error updating user' 
    });
  }
});

// Delete user (admin only)
app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user exists
    const [existingUser] = await pool.execute(
      'SELECT * FROM users WHERE id = ?',
      [parseInt(id)]
    );
    
    if (existingUser.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Don't allow deleting the last admin
    if (existingUser[0].role === 'admin') {
      const [adminCount] = await pool.execute(
        'SELECT COUNT(*) as count FROM users WHERE role = "admin"'
      );
      
      if (adminCount[0].count <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete the last admin user'
        });
      }
    }

    // Delete user (this will cascade delete orders and cart due to foreign key constraints)
    await pool.execute('DELETE FROM users WHERE id = ?', [parseInt(id)]);

    res.json({
      success: true,
      message: 'User deleted successfully',
      user: {
        id: existingUser[0].id,
        name: existingUser[0].name,
        email: existingUser[0].email,
        role: existingUser[0].role
      }
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error deleting user' 
    });
  }
});

// Get single user (admin only)
app.get('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [users] = await pool.execute(
      'SELECT id, name, email, phone, address, role, created_at FROM users WHERE id = ?',
      [parseInt(id)]
    );
    
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: users[0]
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching user' 
    });
  }
});

// Serve static files from the React frontend build FIRST
const frontendBuildPath = path.join(__dirname, '..', 'rym-gsm-frontend', 'dist');
console.log('🔍 Checking for frontend build at:', frontendBuildPath);
console.log('📂 Frontend build exists:', fs.existsSync(frontendBuildPath));

if (fs.existsSync(frontendBuildPath)) {
  app.use(express.static(frontendBuildPath));
  console.log('📁 Serving frontend from:', frontendBuildPath);
}

// Debug middleware to log ALL requests
app.use((req, res, next) => {
  console.log(`📝 ${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Use routes - ORDER MATTERS! More specific routes first
app.use('/api/auth', authRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/comparison', comparisonRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin/notifications', adminNotificationRoutes);
app.use('/api', cartRoutes);
app.use('/api', orderRoutes);
app.use('/api', reviewRoutes);
app.use('/api', searchRoutes);
app.use('/api', wishlistRoutes);
app.use('/api', productsRoutes); // Products last because it has catch-all /:id route

console.log('🔗 Notification routes mounted at: /api/notifications');

// Handle React routing - serve index.html for all non-API routes
if (fs.existsSync(frontendBuildPath)) {
  app.get('*', (req, res) => {
    console.log('🏠 Serving index.html for:', req.path);
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  });
} else {
  // 404 handler for API-only mode
  app.use('*', (req, res) => {
    res.status(404).json({ message: 'API endpoint not found' });
  });
}

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    error: err.message
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Rym GSM API server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log('✅ Database connected - using MySQL database');
});

module.exports = app;
