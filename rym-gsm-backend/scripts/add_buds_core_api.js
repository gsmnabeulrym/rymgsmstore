const axios = require('axios');

const API_URL = 'https://www.rymgsm.com/api';

const productData = {
  name: "Samsung Galaxy Buds core",
  brand: "Samsung",
  price: 149,
  stock: 20, // Default stock
  category: "accessory", // Changed to accessory as it's earbuds
  images: [], // Empty images as requested
  specs: {
    "Référence": "SM-R410NZWAMEA",
    "Version Bluetooth": "Bluetooth v5.4",
    "Capacité de la batterie (écouteurs)": "65 mAh",
    "Capacité de la batterie (boîtier)": "500 mAh",
    "Autonomie (ANC activé)": "Jusqu'à 20 heures",
    "Autonomie (ANC désactivé)": "Jusqu'à 35 heures",
    "Suppression active du bruit (ANC)": "Oui",
    "Durabilité": "IP54",
    "Samsung Find": "Oui",
    "Capteurs": "Capteur à effet Hall, capteur de proximité, capteur tactile",
    "Devise": "TND"
  },
  description: "Samsung Galaxy Buds core. Écouteurs sans fil avec suppression active du bruit (ANC). Autonomie impressionnante jusqu'à 35 heures (ANC désactivé). Bluetooth v5.4. Résistance IP54. Référence: SM-R410NZWAMEA."
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
    console.log('🚀 Adding Samsung Galaxy Buds core...');
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
