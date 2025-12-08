const express = require('express');
const { pool } = require('../config/database');
const router = express.Router();

// Helper function to safely execute queries
async function safeQuery(query, params = []) {
  try {
    console.log('🔍 Executing query:', query);
    console.log('🔍 With params:', params);
    const [rows] = await pool.execute(query, params);
    console.log('✅ Query result:', rows);
    return rows;
  } catch (error) {
    console.log(`❌ Comparison query failed: ${error.message}`);
    console.log('❌ Query was:', query);
    console.log('❌ Params were:', params);
    return [];
  }
}

// GET /api/comparison/products/:ids - Get multiple products for comparison
router.get('/products/:ids', async (req, res) => {
  try {
    const { ids } = req.params;
    const productIds = ids.split(',').map(id => parseInt(id)).filter(id => !isNaN(id));
    
    if (productIds.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'No valid product IDs provided' 
      });
    }

    if (productIds.length > 4) {
      return res.status(400).json({ 
        success: false, 
        error: 'Maximum 4 products can be compared at once' 
      });
    }

    console.log(`🔍 Fetching products for comparison: ${productIds.join(', ')}`);

    // Create placeholders for the IN clause
    const placeholders = productIds.map(() => '?').join(',');
    
    const products = await safeQuery(`
      SELECT 
        id,
        name,
        brand,
        price,
        original_price,
        description,
        images,
        stock_quantity,
        category,
        specs,
        created_at
      FROM products 
      WHERE id IN (${placeholders})
      ORDER BY id
    `, productIds);

    // Parse specifications and images JSON for each product
    const processedProducts = products.map(product => {
      let specs = {};
      let images = [];
      
      try {
        specs = product.specs ? JSON.parse(product.specs) : {};
      } catch (error) {
        console.log(`Failed to parse specs for product ${product.id}`);
        specs = {};
      }
      
      try {
        images = product.images ? JSON.parse(product.images) : [];
      } catch (error) {
        console.log(`Failed to parse images for product ${product.id}`);
        images = [];
      }

      return {
        ...product,
        specifications: specs,
        images: images,
        image_url: images[0] || '/api/placeholder/200/200',
        discount: product.original_price && product.original_price > product.price ? 
          Math.round(((product.original_price - product.price) / product.original_price) * 100) : 0
      };
    });

    console.log(`✅ Found ${processedProducts.length} products for comparison`);
    
    res.json({ 
      success: true, 
      data: processedProducts,
      count: processedProducts.length
    });

  } catch (error) {
    console.error('❌ Error fetching comparison products:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch products for comparison',
      details: error.message 
    });
  }
});

// GET /api/comparison/similar/:id - Get similar products for comparison suggestions
router.get('/similar/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const productId = parseInt(id);

    if (isNaN(productId)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid product ID' 
      });
    }

    console.log(`🔍 Finding similar products to compare with product ${productId}`);

    // First get the current product's brand and category
    const currentProduct = await safeQuery(`
      SELECT brand, category, price FROM products WHERE id = ?
    `, [productId]);

    if (currentProduct.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Product not found' 
      });
    }

    const { brand, category, price } = currentProduct[0];

    // Find similar products (same category, similar price range, different brands for variety)
    const similarProducts = await safeQuery(`
      SELECT 
        id,
        name,
        brand,
        price,
        original_price,
        images,
        category
      FROM products 
      WHERE id != ? 
        AND category = ?
        AND price BETWEEN ? AND ?
      ORDER BY 
        CASE WHEN brand != ? THEN 0 ELSE 1 END,
        ABS(price - ?) ASC
      LIMIT 6
    `, [
      productId, 
      category, 
      price * 0.7, // 30% lower
      price * 1.5, // 50% higher
      brand,
      price
    ]);

    // Process similar products to parse images
    const processedSimilarProducts = similarProducts.map(product => {
      let images = [];
      try {
        images = product.images ? JSON.parse(product.images) : [];
      } catch (error) {
        images = [];
      }
      
      return {
        ...product,
        image_url: images[0] || '/api/placeholder/200/200'
      };
    });

    console.log(`✅ Found ${similarProducts.length} similar products`);
    
    res.json({ 
      success: true, 
      data: processedSimilarProducts,
      count: processedSimilarProducts.length
    });

  } catch (error) {
    console.error('❌ Error fetching similar products:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch similar products',
      details: error.message 
    });
  }
});

// POST /api/comparison/save - Save comparison for later (optional feature)
router.post('/save', async (req, res) => {
  try {
    const { productIds, comparisonName, userId } = req.body;

    if (!productIds || !Array.isArray(productIds) || productIds.length < 2) {
      return res.status(400).json({ 
        success: false, 
        error: 'At least 2 products required for comparison' 
      });
    }

    console.log(`💾 Saving comparison: ${comparisonName || 'Unnamed'}`);

    // For now, we'll just return success - you can implement database storage later
    res.json({ 
      success: true, 
      message: 'Comparison saved successfully',
      comparisonId: Date.now() // Temporary ID
    });

  } catch (error) {
    console.error('❌ Error saving comparison:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to save comparison',
      details: error.message 
    });
  }
});

// GET /api/comparison/features - Get all available features for comparison
router.get('/features', async (req, res) => {
  try {
    console.log('📋 Fetching available comparison features');

    // Get all unique specification keys from products
    const products = await safeQuery(`
      SELECT specs FROM products WHERE specs IS NOT NULL AND specs != ''
    `);

    const allFeatures = new Set();
    
    products.forEach(product => {
      try {
        const specs = JSON.parse(product.specs);
        Object.keys(specs).forEach(key => allFeatures.add(key));
      } catch (error) {
        // Skip invalid JSON
      }
    });

    // Define feature categories and their display names
    const featureCategories = {
      'Basic Info': ['brand', 'model', 'price', 'category'],
      'Display': ['screen_size', 'resolution', 'display_type', 'refresh_rate'],
      'Performance': ['processor', 'ram', 'storage', 'gpu', 'chipset'],
      'Camera': ['main_camera', 'front_camera', 'camera_features', 'video_recording'],
      'Battery & Charging': ['battery_capacity', 'charging_speed', 'wireless_charging'],
      'Connectivity': ['network', '5g_support', 'wifi', 'bluetooth', 'nfc'],
      'Design': ['dimensions', 'weight', 'build_material', 'colors', 'water_resistance'],
      'Operating System': ['os', 'os_version', 'ui'],
      'Other Features': ['fingerprint', 'face_unlock', 'sensors', 'audio_features']
    };

    const availableFeatures = Array.from(allFeatures);

    console.log(`✅ Found ${availableFeatures.length} comparison features`);
    
    res.json({ 
      success: true, 
      data: {
        categories: featureCategories,
        allFeatures: availableFeatures
      }
    });

  } catch (error) {
    console.error('❌ Error fetching comparison features:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch comparison features',
      details: error.message 
    });
  }
});

module.exports = router;
