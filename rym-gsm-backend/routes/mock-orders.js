const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Middleware to authenticate user
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
    req.user = { id: decoded.userId };
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// Mock orders data
let mockOrders = [
  {
    id: 1,
    user_id: 1,
    products: [
      { product_id: 1, name: 'iPhone 15 Pro', price: 999, quantity: 1 },
      { product_id: 2, name: 'Samsung Galaxy S24', price: 899, quantity: 1 }
    ],
    total: 1898,
    status: 'pending',
    created_at: new Date('2024-01-15T10:30:00Z')
  },
  {
    id: 2,
    user_id: 1,
    products: [
      { product_id: 3, name: 'Google Pixel 8', price: 699, quantity: 1 }
    ],
    total: 699,
    status: 'shipped',
    created_at: new Date('2024-01-10T14:20:00Z')
  }
];

// Get all orders (admin only)
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      orders: mockOrders,
      total: mockOrders.length
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching orders' 
    });
  }
});

// Get all orders for admin with filters (admin only)
router.get('/admin/all', (req, res) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;
    let filteredOrders = [...mockOrders];
    
    // Apply search filter
    if (search) {
      filteredOrders = filteredOrders.filter(order => 
        order.id.toString().includes(search) ||
        order.products.some(product => 
          product.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
    
    // Apply status filter
    if (status) {
      filteredOrders = filteredOrders.filter(order => order.status === status);
    }
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      orders: paginatedOrders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredOrders.length / limit),
        totalOrders: filteredOrders.length,
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

// Get user's orders
router.get('/my-orders', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const userOrders = mockOrders.filter(order => order.user_id === userId);
    
    res.json({
      success: true,
      orders: userOrders,
      total: userOrders.length
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching user orders' 
    });
  }
});

// Create new order
router.post('/', authenticateToken, (req, res) => {
  try {
    const { products, total, shippingAddress, paymentMethod, status } = req.body;
    const userId = req.user.id;
    
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Products are required'
      });
    }

    if (!total || total <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid total amount is required'
      });
    }

    const newOrder = {
      id: mockOrders.length + 1,
      user_id: userId,
      products,
      total,
      shipping_address: shippingAddress ? `${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.postalCode}, ${shippingAddress.country}` : null,
      payment_method: paymentMethod || 'cash',
      status: status || 'pending',
      created_at: new Date()
    };

    mockOrders.push(newOrder);

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

// Update order status (admin only)
router.put('/:id/status', (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const { status } = req.body;

    if (!['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be pending, confirmed, shipped, delivered, or cancelled'
      });
    }

    const orderIndex = mockOrders.findIndex(order => order.id === orderId);
    
    if (orderIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    mockOrders[orderIndex].status = status;

    res.json({
      success: true,
      message: 'Order status updated successfully',
      order: mockOrders[orderIndex]
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error updating order status' 
    });
  }
});

// Get order by ID
router.get('/:id', (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const order = mockOrders.find(order => order.id === orderId);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

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

module.exports = router;
