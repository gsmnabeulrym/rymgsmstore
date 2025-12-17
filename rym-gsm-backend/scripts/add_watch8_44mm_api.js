const axios = require('axios');

const API_URL = 'https://www.rymgsm.com/api';

const productData = {
  name: "Samsung Galaxy Watch8 44mm",
  brand: "Samsung",
  price: 1299,
  stock: 20, // Default stock
  category: "watch",
  images: [], // Empty images as requested
  specs: {
    "size": "44mm",
    "screen_type": "Super AMOLED",
    "resolution": "438 x 438 px",
    "processor": "Penta-Core (1.6GHz, 1.5GHz)",
    "ram": "2 Go",
    "storage": "32 Go",
    "os": "Wear OS Powered by Samsung",
    "connectivity": "Wi-Fi, Bluetooth v5.3, NFC, GPS, Glonass, Beidou, Galileo",
    "network": "Wi-Fi, Bluetooth",
    "resistance": "5 ATM",
    "battery": "325 mAh",
    "battery_life": "Up to 40 hours",
    "sensors": "Accelerometer, Barometer, Bioelectrical Impedance Analysis Sensor, Electrical Heart Sensor, Gyro Sensor, Geomagnetic Sensor, Infrared Temperature Sensor, Light Sensor, Optical Heart Rate Sensor",
    "currency": "Dt"
  },
  description: "Montre connectée Samsung Galaxy Watch8 44mm. Technologie de l'écran : Super AMOLED, Résolution : 438 x 438px. Processeur Penta-Core puissant, 2Go RAM et 32Go Stockage. Autonomie jusqu'à 40 heures. Résistance 5 ATM. Capteurs complets santé et sport (ECG, BIA, Température, FC, etc.). Livraison Gratuite."
};

async function addProduct() {
  try {
    console.log('🔐 Logging in as admin...');
    // 1. Login to get token
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@rymgsm.com',
      password: 'password'
    });

    const token = loginRes.data.token;
    console.log('✅ Login successful! Token obtained.');

    // 2. Add product
    console.log('🚀 Adding Samsung Galaxy Watch8 44mm...');
    const productRes = await axios.post(`${API_URL}/products`, productData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('✅ Product added successfully!');
    console.log('📦 Response:', productRes.data);
    
    // 3. Verify it exists
    console.log('🔍 Verifying product...');
    const verifyRes = await axios.get(`${API_URL}/products/${productRes.data.productId || productRes.data.id}`);
    console.log('✅ Verified! Product details:', verifyRes.data);

  } catch (error) {
    console.error('❌ Error:', error.response ? error.response.data : error.message);
  }
}

addProduct();
