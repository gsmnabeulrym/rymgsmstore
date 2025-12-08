const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Mock cart data (in a real app, this would be in a database)
let mockCarts = {};

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

// Get user's cart
router.get('/', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const cart = mockCarts[userId] || { products: [], total: 0 };

    res.json({ cart });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Server error fetching cart' });
  }
});

// Add item to cart
router.post('/add', authenticateToken, (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user.id;

    if (!productId || quantity < 1) {
      return res.status(400).json({ message: 'Valid product ID and quantity required' });
    }

    // Mock product data (in real app, fetch from database)
    const mockProducts = {
      1: { id: 1, name: "iPhone 15 Pro", price: 999.99, image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500" },
      2: { id: 2, name: "Samsung Galaxy S24 Ultra", price: 1199.99, image: "https://images.unsplash.com/photo-1511707171631-9ed2a79be0f3?w=500" },
      3: { id: 3, name: "Google Pixel 8 Pro", price: 899.99, image: "https://images.unsplash.com/photo-1511707171631-9ed2a79be0f3?w=500" },
      4: { id: 4, name: "AirPods Pro (2nd Gen)", price: 249.99, image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500" }
    };

    const product = mockProducts[productId];
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Get or create cart
    if (!mockCarts[userId]) {
      mockCarts[userId] = { products: [], total: 0 };
    }

    const cart = mockCarts[userId];
    const existingItemIndex = cart.products.findIndex(item => item.productId === productId);

    if (existingItemIndex > -1) {
      // Update quantity
      cart.products[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.products.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity
      });
    }

    // Calculate total
    cart.total = cart.products.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    res.json({ message: 'Item added to cart successfully' });

  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Server error adding item to cart' });
  }
});

// Update item quantity in cart
router.put('/update', authenticateToken, (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    if (!productId || quantity < 0) {
      return res.status(400).json({ message: 'Valid product ID and quantity required' });
    }

    const cart = mockCarts[userId];
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.products.findIndex(item => item.productId === productId);
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    if (quantity === 0) {
      // Remove item
      cart.products.splice(itemIndex, 1);
    } else {
      // Update quantity
      cart.products[itemIndex].quantity = quantity;
    }

    // Calculate total
    cart.total = cart.products.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    res.json({ message: 'Cart updated successfully' });

  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ message: 'Server error updating cart' });
  }
});

// Remove item from cart
router.delete('/remove/:productId', authenticateToken, (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const cart = mockCarts[userId];
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.products.findIndex(item => item.productId === parseInt(productId));
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Remove item
    cart.products.splice(itemIndex, 1);

    // Calculate total
    cart.total = cart.products.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    res.json({ message: 'Item removed from cart successfully' });

  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Server error removing item from cart' });
  }
});

// Clear cart
router.delete('/clear', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    mockCarts[userId] = { products: [], total: 0 };

    res.json({ message: 'Cart cleared successfully' });

  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: 'Server error clearing cart' });
  }
});

module.exports = router;
