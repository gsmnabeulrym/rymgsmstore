const db = require('../config/database');

async function addProduct(productData) {
  try {
    const {
      name,
      brand,
      price,
      stock = 10, // Default stock
      category = 'phone',
      images = [], // Default empty images
      specs,
      description
    } = productData;

    // Ensure specs has currency 'Dt' if not provided
    if (specs && !specs.currency) {
      specs.currency = 'Dt';
    }

    // Remove color from specs if present (user will add pictures later)
    if (specs && specs.color) {
      delete specs.color;
    }

    const sql = `
      INSERT INTO products (name, brand, price, stock, category, images, specs, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.pool.execute(sql, [
      name,
      brand,
      price,
      stock,
      category,
      JSON.stringify(images),
      JSON.stringify(specs),
      description
    ]);

    console.log(`✅ Product "${name}" added successfully! ID: ${result.insertId}`);
    return result.insertId;
  } catch (error) {
    console.error('❌ Error adding product:', error);
    throw error;
  }
}

// If run directly from command line, use the product data
if (require.main === module) {
  // Get product data from command line arguments or use example
  const productData = process.argv[2] 
    ? JSON.parse(process.argv[2])
    : null;

  if (!productData) {
    console.error('❌ Please provide product data as JSON string');
    console.log('Usage: node add_single_product.js \'{"name":"Phone Name","brand":"Brand","price":999,"specs":{...}}\'');
    process.exit(1);
  }

  addProduct(productData)
    .then(() => {
      console.log('✅ Product added successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Failed to add product:', error);
      process.exit(1);
    });
}

module.exports = addProduct;
