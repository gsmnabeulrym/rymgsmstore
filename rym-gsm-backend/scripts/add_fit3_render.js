// Direct PostgreSQL connection to Render to add Galaxy Fit 3
const { Client } = require('pg');

const DATABASE_URL = 'postgresql://rym_gsm_user:mfr6ddBRD26Hml2k8QH50VOI2aiQgMgg@dpg-d4rak3je5dus73f5iir0-a.frankfurt-postgres.render.com/rym_gsm';

const productData = {
  name: "Samsung Galaxy Fit 3",
  brand: "Samsung",
  price: 249,
  stock: 20,
  category: "watch",
  images: JSON.stringify([]),
  specs: JSON.stringify({
    "ram": "16 MB",
    "storage": "256 MB",
    "bluetooth": "Bluetooth v5.3",
    "dimensions": "42.9 x 28.8 x 9.9 mm",
    "poids": "36.8 g",
    "os": "FreeRTOS",
    "ecran": "1.6\" AMOLED",
    "resolution": "256 x 402",
    "couleurs": "16M",
    "capteurs": "Accéléromètre, baromètre, capteur gyroscopique, capteur optique de fréquence cardiaque, capteur de luminosité",
    "batterie": "208 mAh",
    "autonomie": "Jusqu'à 13 jours",
    "garantie": "1 an",
    "currency": "Dt"
  }),
  description: "Samsung Galaxy Fit 3 - Montre connectée avec écran AMOLED 1.6\" (256x402), Bluetooth 5.3, capteurs complets (FC, accéléro, gyro, baro), autonomie jusqu'à 13 jours. Garantie 1 an. Idéal pour le suivi fitness et santé."
};

async function addProduct() {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
      requestCert: true
    }
  });

  try {
    console.log('🔌 Connecting to Render PostgreSQL...');
    await client.connect();
    console.log('✅ Connected!\n');

    console.log('🚀 Adding Samsung Galaxy Fit 3 to database...\n');

    const sql = `
      INSERT INTO products (name, brand, price, stock, category, images, specs, description)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
    `;

    const result = await client.query(sql, [
      productData.name,
      productData.brand,
      productData.price,
      productData.stock,
      productData.category,
      productData.images,
      productData.specs,
      productData.description
    ]);

    const productId = result.rows[0].id;

    console.log('✅ Product added successfully!');
    console.log(`📱 Product ID: ${productId}`);
    console.log(`📦 Product: ${productData.name}`);
    console.log(`💰 Price: ${productData.price} DT`);
    console.log(`🏷️  Category: ${productData.category}`);
    console.log(`\n🌐 View at: https://www.rymgsm.com/products/${productId}`);
    console.log('\n✨ You can add images via the admin panel at /admin/products');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    await client.end();
    process.exit(0);
  }
}

addProduct();
