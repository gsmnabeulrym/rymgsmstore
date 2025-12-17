const axios = require('axios');

const API_URL = 'https://www.rymgsm.com/api';

const productData = {
  name: "Samsung Galaxy Watch FE (40mm, Bluetooth)",
  brand: "Samsung",
  price: 799,
  stock: 20, // Default stock
  category: "watch",
  images: [], // Empty images as requested
  specs: {
    "model": "SM-R861NIDAMEA",
    "size": "40mm",
    "screen_size": "1.2 inch",
    "screen_type": "Super AMOLED",
    "resolution": "396 x 396",
    "processor": "Exynos W920",
    "ram": "1.5 GB",
    "storage": "16 GB",
    "os": "Wear OS 5 Powered by Samsung",
    "connectivity": "Bluetooth, GPS",
    "dimensions": "39.3 x 40.4 x 9.8 mm",
    "battery": "247 mAh",
    "battery_life": "Up to 40 hours (AOD off)",
    "sensors": "Heart Rate, ECG, Blood Pressure, GPS",
    "currency": "Dt"
  },
  description: "La Samsung Galaxy Watch FE sera disponible en une seule taille 40mm avec un écran OLED de 1,2\". C'est une montre connectée abordable et polyvalente : Wear OS 5, SoC Exynos W920, 1,5 Go de RAM et 16 Go de stockage. Son écran circulaire Super AMOLED de 1,2 pouce est accompagné de fonctionnalités et capteurs, permettant notamment de suivre la fréquence cardiaque, la mesure ECG, la tension artérielle, ou encore de choisir entre plus de 100 séances d'entraînement. Référence: SM-R861NIDAMEA."
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
    console.log('🚀 Adding Samsung Galaxy Watch FE...');
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
