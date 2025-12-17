const axios = require('axios');

// Product data
const productData = {
  name: "Samsung Galaxy Fit 3",
  brand: "Samsung",
  price: 249,
  stock: 20,
  category: "watch",
  images: [],
  specs: {
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
  },
  description: "Samsung Galaxy Fit 3 - Montre connectée avec écran AMOLED 1.6\" (256x402), Bluetooth 5.3, capteurs complets (FC, accéléro, gyro, baro), autonomie jusqu'à 13 jours. Garantie 1 an. Idéal pour le suivi fitness et santé."
};

// Get API URL from environment or use default
const API_URL = process.env.API_URL || process.env.VITE_API_URL || 'http://localhost:5001/api';

async function addProductViaAPI() {
  console.log('🚀 Adding Samsung Galaxy Fit 3 via API...\n');
  console.log(`📍 API URL: ${API_URL}\n`);
  
  try {
    // Try to add via API
    const response = await axios.post(`${API_URL}/products`, productData, {
      headers: {
        'Content-Type': 'application/json',
        // Note: This would need an admin token in production
        // 'Authorization': `Bearer ${process.env.ADMIN_TOKEN}`
      }
    });

    console.log('✅ Product added successfully!');
    console.log(`📱 Product ID: ${response.data.product?.id || 'N/A'}`);
    console.log(`📦 Product: ${productData.name}`);
    console.log(`💰 Price: ${productData.price} DT`);
    console.log('\n✨ You can now add images via the admin panel.');
    
  } catch (error) {
    if (error.response) {
      console.error('❌ API Error:', error.response.status, error.response.data);
      console.error('\n💡 Note: You may need to add this product via the admin panel at /admin/products');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('❌ Connection refused. The API server is not running or not accessible.');
      console.error('\n💡 Try one of these:');
      console.error('   1. Make sure your backend server is running');
      console.error('   2. Add the product via admin panel at /admin/products');
      console.error('   3. Set API_URL environment variable if using different URL');
    } else {
      console.error('❌ Error:', error.message);
    }
  }
}

// Run if executed directly
if (require.main === module) {
  addProductViaAPI();
}

module.exports = addProductViaAPI;


