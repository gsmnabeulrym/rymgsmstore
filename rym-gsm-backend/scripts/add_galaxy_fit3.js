const addProduct = require('./add_single_product');

const productData = {
  name: "Samsung Galaxy Fit 3",
  brand: "Samsung",
  price: 249,
  stock: 20,
  category: "watch",
  images: [], // You can add images later via admin panel
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

addProduct(productData)
  .then((id) => {
    console.log(`\n✅ Samsung Galaxy Fit 3 ajouté avec succès! ID: ${id}`);
    console.log(`\n📱 Produit: Samsung Galaxy Fit 3`);
    console.log(`💰 Prix: 249 DT`);
    console.log(`📦 Stock: 20`);
    console.log(`\n✨ Vous pouvez maintenant ajouter des images via le panneau admin.`);
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Erreur lors de l\'ajout du produit:', error.message);
    console.error(error);
    process.exit(1);
  });


