const axios = require('axios');

const API_URL = 'https://www.rymgsm.com/api';

const productsToUpdate = [
  {
    id: 91, // Fit 3
    specs: {
      "Mémoire RAM": "16 MB",
      "Stockage": "256 MB",
      "Connectivité": "Bluetooth v5.3",
      "Dimensions": "42.9 x 28.8 x 9.9 mm",
      "Poids": "36.8 g",
      "Système d'exploitation": "FreeRTOS",
      "Taille écran": "1.6\"",
      "Technologie écran": "AMOLED",
      "Résolution": "256 x 402",
      "Nombre de couleurs": "16M",
      "Capteurs": "Accéléromètre, baromètre, capteur gyroscopique, capteur optique de fréquence cardiaque, capteur de luminosité",
      "Batterie": "208 mAh",
      "Autonomie": "Jusqu'à 13 jours",
      "Garantie": "1 an"
    }
  },
  {
    id: 92, // Watch FE
    specs: {
      "Modèle": "SM-R861NIDAMEA",
      "Taille écran": "40mm",
      "Technologie écran": "Super AMOLED",
      "Résolution": "396 x 396",
      "Processeur": "Exynos W920",
      "Mémoire RAM": "1.5 Go",
      "Stockage": "16 Go",
      "Système d'exploitation": "Wear OS 5 Powered by Samsung",
      "Connectivité": "Bluetooth, GPS",
      "Dimensions": "39.3 x 40.4 x 9.8 mm",
      "Batterie": "247 mAh",
      "Autonomie": "Jusqu'à 40 heures (AOD éteint)",
      "Capteurs": "Fréquence cardiaque, ECG, Tension artérielle, GPS"
    }
  },
  {
    id: 93, // Watch8 44mm
    specs: {
      "Taille écran": "44mm",
      "Technologie écran": "Super AMOLED",
      "Résolution": "438 x 438 px",
      "Processeur": "Penta-Core (1.6GHz, 1.5GHz)",
      "Mémoire RAM": "2 Go",
      "Stockage": "32 Go",
      "Système d'exploitation": "Wear OS Powered by Samsung",
      "Connectivité": "Wi-Fi 802.11 a/b/g/n 2.4+5GHz, Bluetooth v5.3, NFC, GPS, Glonass, Beidou, Galileo",
      "Réseau": "Wi-Fi, Bluetooth",
      "Résistance": "5 ATM",
      "Batterie": "325 mAh",
      "Autonomie": "Jusqu'à 40 heures",
      "Capteurs": "Accéléromètre, Baromètre, Analyse d'impédance bioélectrique, Capteur électrique de fréquence cardiaque, Gyroscope, Géomagnétique, Température infrarouge, Luminosité, Capteur optique de fréquence cardiaque"
    }
  }
];

async function updateAllProducts() {
  try {
    console.log('🔐 Logging in as admin...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@rymgsm.com',
      password: 'password'
    });
    const token = loginRes.data.token;
    console.log('✅ Login successful!');

    for (const product of productsToUpdate) {
      console.log(`🚀 Updating specs for Product ID ${product.id}...`);
      try {
        await axios.put(`${API_URL}/products/${product.id}`, { specs: product.specs }, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log(`✅ Product ${product.id} updated successfully!`);
      } catch (e) {
        console.error(`❌ Failed to update ${product.id}:`, e.message);
      }
    }

  } catch (error) {
    console.error('❌ Login Error:', error.message);
  }
}

updateAllProducts();
