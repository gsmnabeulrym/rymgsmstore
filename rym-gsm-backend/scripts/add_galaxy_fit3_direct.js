// Direct database connection script for adding Galaxy Fit 3
require('dotenv').config();
const { query } = require('../config/database');

const productData = {
  name: "Samsung Galaxy Fit 3",
  brand: "Samsung",
  price: 249,
  stock: 20,
  category: "watch",
  images: JSON.stringify([]),
  specs: JSON.stringify({
    "RAM": "16 MB",
    "Stockage": "256 MB",
    "Bluetooth": "v5.3",
    "Dimensions": "42.9 x 28.8 x 9.9 mm",
    "Poids": "36.8 g",
    "Système d'exploitation": "FreeRTOS",
    "Taille écran": "1.6\"",
    "Résolution": "256 x 402",
    "Technologie écran": "AMOLED",
    "Profondeur de couleur": "16M",
    "Capteurs": "Accéléromètre, baromètre, capteur gyroscopique, capteur optique de fréquence cardiaque, capteur de luminosité",
    "Batterie": "208 mAh",
    "Autonomie": "Jusqu'à 13 jours",
    "Garantie": "1 an",
    "currency": "Dt"
  }),
  description: "Samsung Galaxy Fit 3 - Montre connectée avec écran AMOLED 1.6\" (256x402), Bluetooth 5.3, capteurs complets (FC, accéléro, gyro, baro), autonomie jusqu'à 13 jours. Garantie 1 an. Idéal pour le suivi fitness et santé."
};

async function addProduct() {
  try {
    console.log('🚀 Adding Samsung Galaxy Fit 3 to database...\n');
    
    const sql = `
      INSERT INTO products (name, brand, price, stock, category, images, specs, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const result = await query(sql, [
      productData.name,
      productData.brand,
      productData.price,
      productData.stock,
      productData.category,
      productData.images,
      productData.specs,
      productData.description
    ]);
    
    const productId = result.insertId || result[0]?.id || 'N/A';
    
    console.log('✅ Product added successfully!');
    console.log(`📱 Product ID: ${productId}`);
    console.log(`📦 Product: ${productData.name}`);
    console.log(`💰 Price: ${productData.price} DT`);
    console.log(`🏷️  Category: ${productData.category}`);
    console.log('\n✨ You can now add images via the admin panel at /admin/products');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error adding product:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Database connection failed. Make sure:');
      console.error('   1. DATABASE_URL is set in .env file (for Render PostgreSQL)');
      console.error('   2. Or local MySQL is running (for local development)');
      console.error('   3. Or add the product via admin panel at /admin/products');
    }
    process.exit(1);
  }
}

addProduct();


