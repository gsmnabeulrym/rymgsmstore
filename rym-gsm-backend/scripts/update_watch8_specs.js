const axios = require('axios');

const API_URL = 'https://www.rymgsm.com/api';
const PRODUCT_ID = 94; // Samsung Galaxy Watch8 Classic 46mm

const updatedSpecs = {
  "Technologie écran": "Super AMOLED",
  "Taille écran": "46mm",
  "Nombre de couleurs": "16M",
  "Résolution": "438 x 438 px",
  "Système d'exploitation": "Wear OS Powered by Samsung",
  "Processeur": "Penta-Core (1.6GHz, 1.5GHz)",
  "RAM": "2 Go",
  "Stockage": "64 Go",
  "Mémoire disponible": "49.0 Go",
  "Réseau": "Wi-Fi, Bluetooth",
  "Connectivité": "Wi-Fi 802.11 a/b/g/n 2.4+5GHz, Bluetooth v5.3, NFC, GPS, Glonass, Beidou, Galileo",
  "Profils Bluetooth": "A2DP, AVRCP, HFP, HSP",
  "Capteurs": "Accéléromètre, Baromètre, Analyse d'impédance bioélectrique, Capteur électrique de fréquence cardiaque (ECG), Gyroscope, Géomagnétique, Température infrarouge, Luminosité, Capteur optique de fréquence cardiaque",
  "Batterie": "325 mAh",
  "Autonomie": "Jusqu'à 40 heures (utilisation typique)",
  "Batterie amovible": "Non",
  "Résistance": "5 ATM",
  "Garantie": "1 An"
};

async function updateProduct() {
  try {
    console.log('🔐 Logging in as admin...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@rymgsm.com',
      password: 'password'
    });

    const token = loginRes.data.token;
    console.log('✅ Login successful!');

    console.log(`🚀 Updating specs for Product ID ${PRODUCT_ID}...`);
    
    // First get current product to preserve name/price/etc if needed, 
    // but PUT usually updates only what is sent if implemented that way.
    // However, our backend implementation replaces fields if they are sent.
    // We will send just the fields we want to update.
    
    const updatePayload = {
      specs: updatedSpecs
    };

    const updateRes = await axios.put(`${API_URL}/products/${PRODUCT_ID}`, updatePayload, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('✅ Product updated successfully!');
    console.log('📦 Updated Product:', updateRes.data.product);

  } catch (error) {
    console.error('❌ Error:', error.response ? error.response.data : error.message);
  }
}

updateProduct();
