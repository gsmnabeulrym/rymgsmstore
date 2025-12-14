const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const notificationService = require('../services/notificationService');

const router = express.Router();

// Get all products with filters and search
router.get('/', async (req, res) => {
  try {
    const { 
      search, 
      brand, 
      category, 
      minPrice, 
      maxPrice, 
      ram, 
      storage,
      minRating,
      sort = 'newest',
      page = 1, 
      limit = 12 
    } = req.query;

    let query = 'SELECT * FROM products WHERE 1=1';
    const queryParams = [];

    // Search by name or description
    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ?)';
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    // Filter by brand (can be comma-separated list)
    if (brand) {
      const brands = brand.split(',').map(b => b.trim());
      if (brands.length === 1) {
        query += ' AND brand = ?';
        queryParams.push(brands[0]);
      } else {
        query += ` AND brand IN (${brands.map(() => '?').join(',')})`;
        queryParams.push(...brands);
      }
    }

    // Filter by category
    if (category) {
      query += ' AND category = ?';
      queryParams.push(category);
    }

    // Filter by price range
    if (minPrice) {
      query += ' AND price >= ?';
      queryParams.push(minPrice);
    }
    if (maxPrice) {
      query += ' AND price <= ?';
      queryParams.push(maxPrice);
    }

    // Filter by RAM (can be comma-separated list)
    if (ram) {
      const ramOptions = ram.split(',').map(r => r.trim());
      if (ramOptions.length === 1) {
        query += ' AND JSON_EXTRACT(specs, "$.ram") = ?';
        queryParams.push(ramOptions[0]);
      } else {
        query += ` AND JSON_EXTRACT(specs, "$.ram") IN (${ramOptions.map(() => '?').join(',')})`;
        queryParams.push(...ramOptions);
      }
    }

    // Filter by storage (can be comma-separated list)
    if (storage) {
      const storageOptions = storage.split(',').map(s => s.trim());
      if (storageOptions.length === 1) {
        query += ' AND JSON_EXTRACT(specs, "$.storage") = ?';
        queryParams.push(storageOptions[0]);
      } else {
        query += ` AND JSON_EXTRACT(specs, "$.storage") IN (${storageOptions.map(() => '?').join(',')})`;
        queryParams.push(...storageOptions);
      }
    }

    // Filter by minimum rating
    if (minRating) {
      query += ` AND id IN (
        SELECT product_id FROM reviews 
        WHERE status = 'approved' 
        GROUP BY product_id 
        HAVING AVG(rating) >= ?
      )`;
      queryParams.push(minRating);
    }

    // Add sorting
    let orderBy = 'created_at DESC'; // default: newest
    switch (sort) {
      case 'price-low':
        orderBy = 'price ASC';
        break;
      case 'price-high':
        orderBy = 'price DESC';
        break;
      case 'name':
        orderBy = 'name ASC';
        break;
      case 'rating':
        orderBy = `(
          SELECT COALESCE(AVG(rating), 0) 
          FROM reviews 
          WHERE product_id = products.id AND status = 'approved'
        ) DESC`;
        break;
      case 'oldest':
        orderBy = 'created_at ASC';
        break;
    }
    query += ` ORDER BY ${orderBy}`;
    
    const offset = (page - 1) * limit;
    query += ' LIMIT ? OFFSET ?';
    queryParams.push(parseInt(limit), offset);

    const products = await query(query, queryParams);

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM products WHERE 1=1';
    const countParams = [];

    if (search) {
      countQuery += ' AND (name LIKE ? OR description LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`);
    }
    if (brand) {
      countQuery += ' AND brand = ?';
      countParams.push(brand);
    }
    if (category) {
      countQuery += ' AND category = ?';
      countParams.push(category);
    }
    if (minPrice) {
      countQuery += ' AND price >= ?';
      countParams.push(minPrice);
    }
    if (maxPrice) {
      countQuery += ' AND price <= ?';
      countParams.push(maxPrice);
    }
    if (ram) {
      countQuery += ' AND JSON_EXTRACT(specs, "$.ram") = ?';
      countParams.push(ram);
    }
    if (storage) {
      countQuery += ' AND JSON_EXTRACT(specs, "$.storage") = ?';
      countParams.push(storage);
    }

    const countResult = await query(countQuery, countParams);
    const total = countResult[0].total;

    // Parse JSON fields - handle both string (MySQL) and object (PostgreSQL JSONB)
    const formattedProducts = products.map(product => ({
      ...product,
      images: typeof product.images === 'string' ? JSON.parse(product.images || '[]') : (product.images || []),
      specs: typeof product.specs === 'string' ? JSON.parse(product.specs || '{}') : (product.specs || {})
    }));

    res.json({
      products: formattedProducts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalProducts: total,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error fetching products' });
  }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const products = await query(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );

    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = products[0];
    product.images = typeof product.images === 'string' ? JSON.parse(product.images || '[]') : (product.images || []);
    product.specs = typeof product.specs === 'string' ? JSON.parse(product.specs || '{}') : (product.specs || {});

    res.json({ product });

  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error fetching product' });
  }
});

// Get unique brands for filter
router.get('/brands/list', async (req, res) => {
  try {
    const brands = await query(
      'SELECT DISTINCT brand FROM products ORDER BY brand'
    );

    res.json({ brands: brands.map(b => b.brand) });
  } catch (error) {
    console.error('Get brands error:', error);
    res.status(500).json({ message: 'Server error fetching brands' });
  }
});

// Create product (Admin only)
router.post('/', authenticateToken, requireAdmin, [
  body('name').trim().isLength({ min: 1 }).withMessage('Product name required'),
  body('brand').trim().isLength({ min: 1 }).withMessage('Brand required'),
  body('price').isFloat({ min: 0 }).withMessage('Valid price required'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Valid stock quantity required'),
  body('category').isIn(['phone', 'accessory', 'watch', 'tablet', 'laptop']).withMessage('Valid category required'),
  body('images').isArray().withMessage('Images array required'),
  body('specs').isObject().withMessage('Specs object required')
], async (req, res) => {
  try {
    console.log('🛍️ POST /api/products - Admin creating new product');
    console.log('👤 User:', req.user);
    console.log('📋 Request body:', req.body);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, brand, price, category, images, specs, description } = req.body;
    // Stock is optional - default to 999 (unlimited) if not provided or empty
    const stock = (req.body.stock !== undefined && req.body.stock !== null && req.body.stock !== '') 
      ? parseInt(req.body.stock) 
      : 999;

    const result = await query(
      'INSERT INTO products (name, brand, price, stock, category, images, specs, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, brand, price, stock, category, JSON.stringify(images), JSON.stringify(specs), description || null]
    );

    const productId = result.insertId;

    // Notify all users about the new product
    console.log(`🔔 Creating notifications for new product: ${name} (ID: ${productId})`);
    try {
      await notificationService.notifyNewProduct(productId, name, brand, price, category);
      console.log(`✅ Notification creation completed for product: ${name}`);
    } catch (notificationError) {
      console.error(`❌ Failed to create notifications for product ${name}:`, notificationError);
      // Don't fail the product creation if notifications fail
    }

    res.status(201).json({
      message: 'Product created successfully',
      product: {
        id: productId,
        name,
        brand,
        price,
        stock,
        category,
        images,
        specs,
        description
      }
    });

  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error creating product' });
  }
});

// Update product (Admin only)
router.put('/:id', authenticateToken, requireAdmin, [
  body('name').optional().trim().isLength({ min: 1 }).withMessage('Product name required'),
  body('brand').optional().trim().isLength({ min: 1 }).withMessage('Brand required'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Valid price required'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Valid stock quantity required'),
  body('category').optional().isIn(['phone', 'accessory', 'watch', 'tablet', 'laptop']).withMessage('Valid category required'),
  body('images').optional().isArray().withMessage('Images array required'),
  body('specs').optional().isObject().withMessage('Specs object required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, brand, price, stock, category, images, specs, description } = req.body;

    // Check if product exists and get current values
    const existingProducts = await query(
      'SELECT id, name, price, stock FROM products WHERE id = ?',
      [id]
    );

    if (existingProducts.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const currentProduct = existingProducts[0];

    // Build update query dynamically
    const updateFields = [];
    const updateValues = [];

    if (name !== undefined) {
      updateFields.push('name = ?');
      updateValues.push(name);
    }
    if (brand !== undefined) {
      updateFields.push('brand = ?');
      updateValues.push(brand);
    }
    if (price !== undefined) {
      updateFields.push('price = ?');
      updateValues.push(price);
    }
    if (stock !== undefined) {
      updateFields.push('stock = ?');
      updateValues.push(stock);
    }
    if (category !== undefined) {
      updateFields.push('category = ?');
      updateValues.push(category);
    }
    if (images !== undefined) {
      updateFields.push('images = ?');
      updateValues.push(JSON.stringify(images));
    }
    if (specs !== undefined) {
      updateFields.push('specs = ?');
      updateValues.push(JSON.stringify(specs));
    }
    if (description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(description);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    updateValues.push(id);

    await query(
      `UPDATE products SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    // Check for significant changes and notify users
    if (price !== undefined && price < currentProduct.price) {
      // Price drop notification
      await notificationService.notifyProductModification(
        id, 
        currentProduct.name, 
        'price_drop', 
        currentProduct.price, 
        price
      );
    }

    if (stock !== undefined && currentProduct.stock === 0 && stock > 0) {
      // Back in stock notification
      await notificationService.notifyProductModification(
        id, 
        currentProduct.name, 
        'back_in_stock', 
        0, 
        stock
      );
    }

    res.json({ message: 'Product updated successfully' });

  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error updating product' });
  }
});

// Delete product (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      'DELETE FROM products WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });

  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error deleting product' });
  }
});

module.exports = router;
