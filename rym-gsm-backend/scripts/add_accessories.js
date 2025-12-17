const addProduct = require('./add_single_product');

// Sample accessories data - modify as needed
const accessories = [
  {
    name: "Casque Bluetooth Sans Fil",
    brand: "Sony",
    price: 89.99,
    stock: 50,
    category: "accessory",
    specs: {
      type: "Casque Bluetooth",
      battery: "30 heures d'autonomie",
      connectivité: "Bluetooth 5.0",
      "réduction de bruit": "Active (ANC)",
      color: "Noir",
      currency: "Dt"
    },
    description: "Casque Bluetooth haute qualité avec réduction de bruit active. Autonomie exceptionnelle de 30 heures. Confort optimal pour un usage prolongé."
  },
  {
    name: "Écouteurs Sans Fil True Wireless",
    brand: "Samsung",
    price: 59.99,
    stock: 75,
    category: "accessory",
    specs: {
      type: "Écouteurs True Wireless",
      battery: "6h + 18h avec étui",
      connectivité: "Bluetooth 5.2",
      "résistance à l'eau": "IPX4",
      color: "Blanc",
      currency: "Dt"
    },
    description: "Écouteurs sans fil Samsung avec son stéréo de qualité supérieure. Conception ergonomique et résistance à l'eau. Parfait pour le sport et la vie quotidienne."
  },
  {
    name: "Powerbank 20000mAh",
    brand: "Xiaomi",
    price: 45.99,
    stock: 100,
    category: "accessory",
    specs: {
      type: "Batterie Externe",
      capacité: "20000mAh",
      "ports de charge": "2x USB-A + 1x USB-C",
      "charge rapide": "18W",
      color: "Noir",
      currency: "Dt"
    },
    description: "Powerbank haute capacité Xiaomi. Recharge rapide jusqu'à 18W. Compatible avec tous les smartphones. Idéal pour les longs voyages."
  },
  {
    name: "Coque de Protection iPhone 15 Pro",
    brand: "Spigen",
    price: 29.99,
    stock: 60,
    category: "accessory",
    specs: {
      type: "Coque de Protection",
      compatibilité: "iPhone 15 Pro",
      protection: "Anti-choc, Anti-rayures",
      material: "Polycarbonate",
      color: "Transparent",
      currency: "Dt"
    },
    description: "Coque de protection transparente Spigen pour iPhone 15 Pro. Protection maximale tout en conservant l'esthétique du téléphone. Design élégant et durable."
  },
  {
    name: "Chargeur Rapide USB-C 25W",
    brand: "Samsung",
    price: 19.99,
    stock: 150,
    category: "accessory",
    specs: {
      type: "Chargeur Rapide",
      puissance: "25W",
      port: "USB-C",
      "charge rapide": "Super Fast Charging",
      cable: "Non inclus",
      currency: "Dt"
    },
    description: "Chargeur rapide Samsung 25W avec technologie Super Fast Charging. Compatible avec tous les appareils USB-C. Compact et efficace."
  },
  {
    name: "Câble USB-C vers USB-C 2m",
    brand: "Anker",
    price: 12.99,
    stock: 200,
    category: "accessory",
    specs: {
      type: "Câble de Charge",
      longueur: "2 mètres",
      connecteurs: "USB-C vers USB-C",
      "charge rapide": "Jusqu'à 100W",
      material: "Nylon tressé",
      currency: "Dt"
    },
    description: "Câble USB-C haute qualité Anker de 2 mètres. Supporte la charge rapide jusqu'à 100W. Nylon tressé pour une durabilité maximale."
  },
  {
    name: "Support Voiture Magnétique",
    brand: "ESR",
    price: 24.99,
    stock: 80,
    category: "accessory",
    specs: {
      type: "Support Voiture",
      fixation: "Magnétique",
      rotation: "360°",
      "compatible téléphones": "Tous",
      color: "Noir",
      currency: "Dt"
    },
    description: "Support magnétique pour voiture avec fixation par ventouse. Rotation à 360°. Compatible avec tous les téléphones. Installation simple et rapide."
  },
  {
    name: "Écran de Protection Verre Trempé",
    brand: "ZAGG",
    price: 34.99,
    stock: 120,
    category: "accessory",
    specs: {
      type: "Protection d'Écran",
      material: "Verre Trempé 9H",
      épaisseur: "0.3mm",
      compatibilité: "Tous modèles",
      "anti-empreintes": "Oui",
      currency: "Dt"
    },
    description: "Protection d'écran en verre trempé ZAGG. Résistance maximale aux rayures et aux chocs. Protection anti-empreintes. Facile à installer."
  },
  {
    name: "Enceinte Bluetooth Portable",
    brand: "JBL",
    price: 79.99,
    stock: 45,
    category: "accessory",
    specs: {
      type: "Enceinte Bluetooth",
      puissance: "20W",
      battery: "12 heures",
      connectivité: "Bluetooth 5.1",
      "résistance à l'eau": "IPX7",
      color: "Noir",
      currency: "Dt"
    },
    description: "Enceinte Bluetooth portable JBL avec son puissant de 20W. Résistance à l'eau IPX7. Autonomie de 12 heures. Parfait pour les événements en extérieur."
  },
  {
    name: "Stylet Actif S Pen",
    brand: "Samsung",
    price: 49.99,
    stock: 30,
    category: "accessory",
    specs: {
      type: "Stylet",
      compatibilité: "Galaxy Note, Tab S",
      pression: "4096 niveaux",
      "reconnaissance du geste": "Oui",
      battery: "Incluse",
      currency: "Dt"
    },
    description: "Stylet actif Samsung S Pen pour Galaxy Note et Tab S. Précision maximale avec 4096 niveaux de pression. Reconnaissance des gestes. Parfait pour le dessin et la prise de notes."
  }
];

// Function to add all accessories
async function addAllAccessories() {
  console.log('🚀 Starting to add accessories...\n');
  
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < accessories.length; i++) {
    const accessory = accessories[i];
    try {
      console.log(`📦 Adding: ${accessory.name} (${i + 1}/${accessories.length})`);
      const id = await addProduct(accessory);
      console.log(`✅ Successfully added "${accessory.name}" with ID: ${id}\n`);
      successCount++;
    } catch (error) {
      console.error(`❌ Failed to add "${accessory.name}":`, error.message, '\n');
      errorCount++;
    }
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`✨ Completed! ${successCount} accessories added successfully`);
  if (errorCount > 0) {
    console.log(`⚠️  ${errorCount} accessories failed to add`);
  }
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

// Run if executed directly
if (require.main === module) {
  addAllAccessories()
    .then(() => {
      console.log('\n✅ All accessories processed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { accessories, addAllAccessories };


