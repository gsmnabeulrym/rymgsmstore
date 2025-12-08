const pool = require('../config/database');

const sampleProducts = [
  {
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
    name: "OnePlus 12",
    brand: "OnePlus",
    price: 799.99,
    stock: 18,
    category: "phone",
    images: [
      "https://images.unsplash.com/photo-1511707171631-9ed2a79be0f3?w=500",
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500"
    ],
    specs: {
      ram: "12GB",
      storage: "256GB",
      camera: "50MP Main, 48MP Ultra Wide, 64MP Periscope",
      battery: "5400 mAh",
      display: "6.82-inch LTPO AMOLED",
      processor: "Snapdragon 8 Gen 3"
    },
    description: "Flagship killer with fast charging and premium build quality."
  },
  {
    name: "AirPods Pro (2nd Gen)",
    brand: "Apple",
    price: 249.99,
    stock: 50,
    category: "accessory",
    images: [
      "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500",
      "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500"
    ],
    specs: {
      battery: "Up to 6 hours listening time",
      connectivity: "Bluetooth 5.3",
      features: "Active Noise Cancellation, Spatial Audio, Adaptive Transparency",
      case: "MagSafe Charging Case"
    },
    description: "Premium wireless earbuds with active noise cancellation."
  },
  {
    name: "Samsung Galaxy Buds2 Pro",
    brand: "Samsung",
    price: 229.99,
    stock: 40,
    category: "accessory",
    images: [
      "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500",
      "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500"
    ],
    specs: {
      battery: "Up to 5 hours listening time",
      connectivity: "Bluetooth 5.3",
      features: "Active Noise Cancellation, 360 Audio, Voice Detect",
      case: "Wireless Charging Case"
    },
    description: "High-quality wireless earbuds with superior sound quality."
  },
  {
    name: "iPhone 15",
    brand: "Apple",
    price: 799.99,
    stock: 30,
    category: "phone",
    images: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500",
      "https://images.unsplash.com/photo-1511707171631-9ed2a79be0f3?w=500"
    ],
    specs: {
      ram: "6GB",
      storage: "128GB",
      camera: "48MP Main, 12MP Ultra Wide",
      battery: "3349 mAh",
      display: "6.1-inch Super Retina XDR",
      processor: "A16 Bionic chip"
    },
    description: "The standard iPhone 15 with Dynamic Island and USB-C."
  },
  {
    name: "Samsung Galaxy S24",
    brand: "Samsung",
    price: 799.99,
    stock: 22,
    category: "phone",
    images: [
      "https://images.unsplash.com/photo-1511707171631-9ed2a79be0f3?w=500",
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500"
    ],
    specs: {
      ram: "8GB",
      storage: "128GB",
      camera: "50MP Main, 12MP Ultra Wide, 10MP Telephoto",
      battery: "4000 mAh",
      display: "6.2-inch Dynamic AMOLED 2X",
      processor: "Snapdragon 8 Gen 3"
    },
    description: "Compact flagship with AI-powered features and long battery life."
  }
];

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');
    
    // Clear existing products
    await pool.execute('DELETE FROM products');
    console.log('Cleared existing products');
    
    // Insert sample products
    for (const product of sampleProducts) {
      await pool.execute(
        'INSERT INTO products (name, brand, price, stock, category, images, specs, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          product.name,
          product.brand,
          product.price,
          product.stock,
          product.category,
          JSON.stringify(product.images),
          JSON.stringify(product.specs),
          product.description
        ]
      );
    }
    
    console.log(`Successfully seeded ${sampleProducts.length} products`);
    console.log('Database seeding completed!');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    process.exit();
  }
}

seedDatabase();
