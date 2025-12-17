const axios = require('axios');

const API_URL = 'https://www.rymgsm.com/api';

const productData = {
  name: "Micro Casque Sans Fil JBL Tune 520BT - Noir",
  brand: "JBL",
  price: 199,
  stock: 20, // Default stock
  category: "accessory", 
  images: [], // Empty images as requested
  specs: {
    "Référence": "JBLT520BTBLKEU",
    "Connectivité": "Sans Fil Bluetooth 5.3",
    "Diamètre de Casque": "33 mm",
    "Réponse en Fréquence": "20 Hz - 20 kHz",
    "Sensibilité": "102 dB SPL à 1 kHz 1 mW",
    "Impédance": "30 ohms",
    "Temps de charge": "2 heures",
    "Temps de jeu maximum": "57 heures",
    "Fonctionnalités": "Microphone intégré, Son de basse pur JBL, Connexion multipoint, Pliable",
    "Couleur": "Noir",
    "Garantie": "1 an",
    "Devise": "DT"
  },
  description: "Micro Casque JBL Tune 520BT. Son JBL Pure Bass. Autonomie jusqu'à 57 heures avec charge rapide (2h). Bluetooth 5.3. Design léger, confortable et pliable. Connexion multipoint pour passer facilement d'un appareil à l'autre. Microphone intégré pour appels mains libres. Référence: JBLT520BTBLKEU."
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
    console.log('🚀 Adding JBL Tune 520BT...');
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
