const express = require('express');
const { query } = require('../config/database');
const router = express.Router();

// GET /api/products/search/suggestions - Get search suggestions
router.get('/products/search/suggestions', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.json({ products: [], brands: [], categories: [] });
    }

    const searchTerm = `%${q}%`;
    const prefixTerm = `${q}%`;

    // Search products
    const products = await query(`
      SELECT id, name, price, brand, images 
      FROM products 
      WHERE (LOWER(name) LIKE LOWER(?) OR LOWER(description) LIKE LOWER(?) OR LOWER(brand) LIKE LOWER(?)) 
      AND stock > 0 
      ORDER BY 
        CASE 
          WHEN LOWER(name) LIKE LOWER(?) THEN 1
          WHEN LOWER(brand) LIKE LOWER(?) THEN 2
          ELSE 3
        END,
        name ASC
      LIMIT 8
    `, [searchTerm, searchTerm, searchTerm, prefixTerm, prefixTerm]);

    // Parse images for products
    const productsWithImages = products.map(product => ({
      ...product,
      images: typeof product.images === 'string' ? JSON.parse(product.images || '[]') : (product.images || [])
    }));

    // Search brands
    const brands = await query(`
      SELECT DISTINCT brand 
      FROM products 
      WHERE LOWER(brand) LIKE LOWER(?) 
      AND stock > 0 
      ORDER BY brand ASC 
      LIMIT 6
    `, [searchTerm]);

    // Search categories
    const categories = await query(`
      SELECT DISTINCT category 
      FROM products 
      WHERE LOWER(category) LIKE LOWER(?) 
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
    const brands = await query(`
      SELECT brand, COUNT(*) as count 
      FROM products 
      WHERE stock > 0 
      GROUP BY brand 
      ORDER BY brand ASC
    `);

    // Get category counts
    const categoryCounts = await query(`
      SELECT category, COUNT(*) as count 
      FROM products 
      WHERE stock > 0 
      GROUP BY category
    `);

    // Get brand counts
    const brandCounts = await query(`
      SELECT brand, COUNT(*) as count 
      FROM products 
      WHERE stock > 0 
      GROUP BY brand
    `);

    // Get RAM and storage options from specs - fetch all products and extract unique values
    const allProducts = await query(`
      SELECT specs FROM products WHERE stock > 0
    `);

    // Extract unique RAM and storage values from specs
    const ramSet = new Set();
    const storageSet = new Set();
    
    allProducts.forEach(product => {
      const specs = typeof product.specs === 'string' ? JSON.parse(product.specs || '{}') : (product.specs || {});
      if (specs.ram) ramSet.add(specs.ram);
      if (specs.storage) storageSet.add(specs.storage);
    });

    const ramOptions = Array.from(ramSet).filter(r => r && r !== 'null');
    const storageOptions = Array.from(storageSet).filter(s => s && s !== 'null');

    // Format response
    const response = {
      brands: brands.map(b => b.brand),
      brandCounts: {},
      counts: {},
      ram: ramOptions,
      storage: storageOptions
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
