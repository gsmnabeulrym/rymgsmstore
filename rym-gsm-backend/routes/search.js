const express = require('express');
const { pool } = require('../config/database');
const router = express.Router();

// GET /api/products/search/suggestions - Get search suggestions
router.get('/products/search/suggestions', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.json({ products: [], brands: [], categories: [] });
    }

    const searchTerm = `%${q}%`;

    // Search products
    const [products] = await pool.execute(`
      SELECT id, name, price, brand, images 
      FROM products 
      WHERE (name LIKE ? OR description LIKE ? OR brand LIKE ?) 
      AND stock > 0 
      ORDER BY 
        CASE 
          WHEN name LIKE ? THEN 1
          WHEN brand LIKE ? THEN 2
          ELSE 3
        END,
        name ASC
      LIMIT 8
    `, [searchTerm, searchTerm, searchTerm, `${q}%`, `${q}%`]);

    // Parse images for products
    const productsWithImages = products.map(product => ({
      ...product,
      images: product.images ? product.images.split(',').map(img => img.trim()) : []
    }));

    // Search brands
    const [brands] = await pool.execute(`
      SELECT DISTINCT brand 
      FROM products 
      WHERE brand LIKE ? 
      AND stock > 0 
      ORDER BY brand ASC 
      LIMIT 6
    `, [searchTerm]);

    // Search categories
    const [categories] = await pool.execute(`
      SELECT DISTINCT category 
      FROM products 
      WHERE category LIKE ? 
      AND stock > 0 
      ORDER BY category ASC 
      LIMIT 4
    `, [searchTerm]);

    res.json({
      products: productsWithImages,
      brands: brands.map(b => b.brand),
      categories: categories.map(c => c.category)
    });

  } catch (error) {
    console.error('Error fetching search suggestions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/products/filters/options - Get filter options for advanced filtering
router.get('/products/filters/options', async (req, res) => {
  try {
    // Get all brands
    const [brands] = await pool.execute(`
      SELECT brand, COUNT(*) as count 
      FROM products 
      WHERE stock > 0 
      GROUP BY brand 
      ORDER BY brand ASC
    `);

    // Get category counts
    const [categoryCounts] = await pool.execute(`
      SELECT category, COUNT(*) as count 
      FROM products 
      WHERE stock > 0 
      GROUP BY category
    `);

    // Get brand counts
    const [brandCounts] = await pool.execute(`
      SELECT brand, COUNT(*) as count 
      FROM products 
      WHERE stock > 0 
      GROUP BY brand
    `);

    // Get RAM options (from specs JSON)
    const [ramOptions] = await pool.execute(`
      SELECT DISTINCT JSON_UNQUOTE(JSON_EXTRACT(specs, '$.ram')) as ram
      FROM products 
      WHERE JSON_EXTRACT(specs, '$.ram') IS NOT NULL 
      AND stock > 0
      ORDER BY 
        CASE 
          WHEN JSON_UNQUOTE(JSON_EXTRACT(specs, '$.ram')) LIKE '%GB' 
          THEN CAST(SUBSTRING_INDEX(JSON_UNQUOTE(JSON_EXTRACT(specs, '$.ram')), 'GB', 1) AS UNSIGNED)
          ELSE 0 
        END ASC
    `);

    // Get storage options (from specs JSON)
    const [storageOptions] = await pool.execute(`
      SELECT DISTINCT JSON_UNQUOTE(JSON_EXTRACT(specs, '$.storage')) as storage
      FROM products 
      WHERE JSON_EXTRACT(specs, '$.storage') IS NOT NULL 
      AND stock > 0
      ORDER BY 
        CASE 
          WHEN JSON_UNQUOTE(JSON_EXTRACT(specs, '$.storage')) LIKE '%GB' 
          THEN CAST(SUBSTRING_INDEX(JSON_UNQUOTE(JSON_EXTRACT(specs, '$.storage')), 'GB', 1) AS UNSIGNED)
          WHEN JSON_UNQUOTE(JSON_EXTRACT(specs, '$.storage')) LIKE '%TB' 
          THEN CAST(SUBSTRING_INDEX(JSON_UNQUOTE(JSON_EXTRACT(specs, '$.storage')), 'TB', 1) AS UNSIGNED) * 1000
          ELSE 0 
        END ASC
    `);

    // Format response
    const response = {
      brands: brands.map(b => b.brand),
      brandCounts: {},
      counts: {},
      ram: ramOptions.map(r => r.ram).filter(r => r && r !== 'null'),
      storage: storageOptions.map(s => s.storage).filter(s => s && s !== 'null')
    };

    // Add brand counts
    brandCounts.forEach(item => {
      response.brandCounts[item.brand] = item.count;
    });

    // Add category counts
    categoryCounts.forEach(item => {
      response.counts[item.category] = item.count;
    });

    res.json(response);

  } catch (error) {
    console.error('Error fetching filter options:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
