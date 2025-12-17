const axios = require('axios');

const API_URL = 'https://www.rymgsm.com/api';

const productData = {
  name: "Samsung Galaxy Watch8 Classic 46mm",
  brand: "Samsung",
  price: 1699,
  stock: 20, // Default stock
  category: "watch",
  images: [], // Empty images as requested
  specs: {
    "size": "46mm",
    "screen_type": "Super AMOLED",
    "colors": "16M",
    "ram": "2 Go",
    "storage": "64 Go",
    "available_memory": "49.0 Go",
    "os": "Wear OS Powered by Samsung",
    "connectivity": "Wi-Fi, Bluetooth",
    "wifi": "802.11 a/b/g/n 2.4+5GHz",
    "bluetooth_profiles": "A2DP, AVRCP, HFP, HSP",
    "location_technology": "GPS, Glonass, Beidou, Galileo",
    "battery_life": "Up to 40 Hours (typical usage)",
    "removable_battery": "No",
    "warranty": "1 Year",
    "currency": "Dt"
  },
  description: "Samsung Galaxy Watch8 Classic 46mm. Écran Super AMOLED 16M couleurs. Performances avancées avec 2 Go RAM et 64 Go Stockage. Connectivité complète Wi-Fi + Bluetooth avec GPS multi-systèmes. Autonomie jusqu'à 40 heures. Garantie 1 an."
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
    console.log('🚀 Adding Samsung Galaxy Watch8 Classic 46mm...');
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
