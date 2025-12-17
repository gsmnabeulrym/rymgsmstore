const axios = require('axios');

const API_URL = 'https://www.rymgsm.com/api';

const productData = {
  name: "Micro Casque Sans Fil JBL Tune 720BT - Noir",
  brand: "JBL",
  price: 299,
  stock: 20, // Default stock
  category: "accessory", 
  images: [], // Empty images as requested
  specs: {
    "Référence": "JBLT720BTBLK",
    "Connectivité": "Sans Fil Bluetooth 5.3",
    "Diamètre de Casque": "40 mm",
    "Réponse en Fréquence": "20 Hz - 20 kHz",
    "Sensibilité": "101 dB",
    "Impédance": "32 ohms",
    "Batterie": "Intégrée",
    "Temps de charge": "2 heures",
    "Temps de jeu maximum": "76 heures",
    "Fonctionnalités": "Commande des appels et de la musique sur écouteur, Pliable, Conception légère et confortable",
    "Couleur": "Noir",
    "Garantie": "1 an",
    "Devise": "Dt"
  },
  description: "Micro Casque JBL Tune 720BT. Son JBL Pure Bass. Autonomie jusqu'à 76 heures avec charge rapide (2h). Bluetooth 5.3 multipoint. Conception légère, confortable et pliable. Commande des appels et assistants vocaux. Référence: JBLT720BTBLK."
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
    console.log('🚀 Adding JBL Tune 720BT...');
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
