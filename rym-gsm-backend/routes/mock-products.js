const express = require('express');
const router = express.Router();

// Mock products data
const mockProducts = [
  {
    id: 1,
    name: "iPhone 15 Pro",
    brand: "Apple",
    price: 999.99,
    stock: 25,
    category: "phone",
    images: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500",
      "https://images.unsplash.com/photo-1511707171631-9ed2a79be0f3?w=500"
    ],
    specs: {
      ram: "8GB",
      storage: "128GB",
      camera: "48MP Main, 12MP Ultra Wide, 12MP Telephoto",
      battery: "3274 mAh",
      display: "6.1-inch Super Retina XDR",
      processor: "A17 Pro chip"
    },
    description: "The latest iPhone with titanium design and advanced camera system."
  },
  {
    id: 2,
    name: "Samsung Galaxy S24 Ultra",
    brand: "Samsung",
    price: 1199.99,
    stock: 20,
    category: "phone",
    images: [
      "https://images.unsplash.com/photo-1511707171631-9ed2a79be0f3?w=500",
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500"
    ],
    specs: {
      ram: "12GB",
      storage: "256GB",
      camera: "200MP Main, 12MP Ultra Wide, 10MP Telephoto, 10MP Periscope",
      battery: "5000 mAh",
      display: "6.8-inch Dynamic AMOLED 2X",
      processor: "Snapdragon 8 Gen 3"
    },
    description: "Premium Android flagship with S Pen and advanced AI features."
  },
  {
    id: 3,
    name: "Google Pixel 8 Pro",
    brand: "Google",
    price: 899.99,
    stock: 15,
    category: "phone",
    images: [
      "https://images.unsplash.com/photo-1511707171631-9ed2a79be0f3?w=500",
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500"
    ],
    specs: {
      ram: "12GB",
      storage: "128GB",
      camera: "50MP Main, 48MP Ultra Wide, 48MP Telephoto",
      battery: "5050 mAh",
      display: "6.7-inch LTPO OLED",
      processor: "Google Tensor G3"
    },
    description: "AI-powered smartphone with exceptional camera capabilities."
  },
  {
    id: 4,
    name: "AirPods Pro (2nd Gen)",
    brand: "Apple",
    price: 249.99,
    stock: 50,
    category: "accessory",
    images: [
      "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500"
    ],
    specs: {
      battery: "Up to 6 hours listening time",
      connectivity: "Bluetooth 5.3",
      features: "Active Noise Cancellation, Spatial Audio, Adaptive Transparency",
      case: "MagSafe Charging Case"
    },
    description: "Premium wireless earbuds with active noise cancellation."
  }
];

// Get all products
router.get('/', (req, res) => {
  const { search, brand, category, minPrice, maxPrice, ram, storage, page = 1, limit = 12 } = req.query;
  
  let filteredProducts = [...mockProducts];
  
  // Apply filters
  if (search) {
    filteredProducts = filteredProducts.filter(product => 
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  if (brand) {
    filteredProducts = filteredProducts.filter(product => product.brand === brand);
  }
  
  if (category) {
    filteredProducts = filteredProducts.filter(product => product.category === category);
  }
  
  if (minPrice) {
    filteredProducts = filteredProducts.filter(product => product.price >= parseFloat(minPrice));
  }
  
  if (maxPrice) {
    filteredProducts = filteredProducts.filter(product => product.price <= parseFloat(maxPrice));
  }
  
  if (ram) {
    filteredProducts = filteredProducts.filter(product => product.specs.ram === ram);
  }
  
  if (storage) {
    filteredProducts = filteredProducts.filter(product => product.specs.storage === storage);
  }
  
  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  
  res.json({
    products: paginatedProducts,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(filteredProducts.length / limit),
      totalProducts: filteredProducts.length,
      limit: parseInt(limit)
    }
  });
});

// Get single product
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const product = mockProducts.find(p => p.id === parseInt(id));
  
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  
  res.json({ product });
});

// Get brands - moved to match frontend expectation
router.get('/brands/list', (req, res) => {
  const brands = [...new Set(mockProducts.map(p => p.brand))].sort();
  res.json({ brands });
});

// Alternative route for brands (keeping both for compatibility)
router.get('/brands', (req, res) => {
  const brands = [...new Set(mockProducts.map(p => p.brand))].sort();
  res.json({ brands });
});

// Admin endpoints for product management

// Create new product (admin only)
router.post('/', (req, res) => {
  try {
    const { name, brand, price, stock, category, images, specs, description } = req.body;
    
    if (!name || !brand || !price || !category) {
      return res.status(400).json({ message: 'Name, brand, price, and category are required' });
    }

    const newProduct = {
      id: mockProducts.length + 1,
      name,
      brand,
      price: parseFloat(price),
      stock: parseInt(stock) || 0,
      category,
      images: images || [],
      specs: specs || {},
      description: description || ''
    };

    mockProducts.push(newProduct);

    res.status(201).json({
      message: 'Product created successfully',
      product: newProduct
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error creating product' });
  }
});

// Update product (admin only)
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, brand, price, stock, category, images, specs, description } = req.body;
    
    const productIndex = mockProducts.findIndex(p => p.id === parseInt(id));
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update product fields
    if (name !== undefined) mockProducts[productIndex].name = name;
    if (brand !== undefined) mockProducts[productIndex].brand = brand;
    if (price !== undefined) mockProducts[productIndex].price = parseFloat(price);
    if (stock !== undefined) mockProducts[productIndex].stock = parseInt(stock);
    if (category !== undefined) mockProducts[productIndex].category = category;
    if (images !== undefined) mockProducts[productIndex].images = images;
    if (specs !== undefined) mockProducts[productIndex].specs = specs;
    if (description !== undefined) mockProducts[productIndex].description = description;

    res.json({
      message: 'Product updated successfully',
      product: mockProducts[productIndex]
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error updating product' });
  }
});

// Delete product (admin only)
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const productIndex = mockProducts.findIndex(p => p.id === parseInt(id));
    
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const deletedProduct = mockProducts.splice(productIndex, 1)[0];

    res.json({
      message: 'Product deleted successfully',
      product: deletedProduct
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error deleting product' });
  }
});

module.exports = router;
