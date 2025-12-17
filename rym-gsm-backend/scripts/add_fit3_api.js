const axios = require('axios');

const API_URL = 'https://www.rymgsm.com/api';

const productData = {
  name: "Samsung Galaxy Fit 3",
  brand: "Samsung",
  price: 249,
  stock: 20,
  category: "watch", // Changed to watch as it's a fitness tracker/watch
  images: [], // Empty images as requested
  specs: {
    "ram": "16 MB",
    "storage": "256 MB",
    "bluetooth": "Bluetooth v5.3",
    "dimensions": "42.9 x 28.8 x 9.9 mm",
    "weight": "36.8 g",
    "os": "FreeRTOS",
    "screen_size": "1.6 inch",
    "screen_type": "AMOLED",
    "resolution": "256 x 402",
    "colors": "16M",
    "sensors": "Accelerometer, Barometer, Gyro Sensor, Optical Heart Rate Sensor, Light Sensor",
    "battery": "208 mAh",
    "battery_life": "Up to 13 Days",
    "warranty": "1 Year",
    "currency": "Dt"
  },
  description: "Samsung Galaxy Fit 3 - Smart watch with 1.6\" AMOLED display (256x402), Bluetooth 5.3, complete sensors (HR, accel, gyro, baro), up to 13 days battery life. 1 Year Warranty. Ideal for fitness and health tracking."
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
    console.log('🚀 Adding Samsung Galaxy Fit 3...');
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
    if (error.response && error.response.status === 401) {
      console.log('💡 Tip: Admin credentials might be changed in production.');
    }
  }
}

addProduct();
