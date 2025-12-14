const addProduct = require('./add_single_product');

// Get product data from arguments
const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('❌ Please provide product details');
  console.log('\nUsage for PHONES:');
  console.log('node add_product.js <name> <brand> <price> <stock> <category> <ram> <storage> <display> <camera> <battery> <os> <processor> [description]');
  console.log('\nUsage for ACCESSORIES (flexible specs):');
  console.log('node add_product.js <name> <brand> <price> <stock> accessory [spec1:value1] [spec2:value2] ... [description]');
  console.log('\nExamples:');
  console.log('Phone: node add_product.js "Galaxy A07" Samsung 399 25 phone "4GB" "128GB" "6.5-inch HD+" "50MP Main" "5000 mAh" "Android 12" "Helio P35" "Description"');
  console.log('Accessory: node add_product.js "Wireless Earbuds" Samsung 99 50 accessory "Type:True Wireless" "Battery:6h" "Charging:USB-C" "Description"');
  process.exit(1);
}

// Parse arguments
const name = args[0];
const brand = args[1];
const price = parseFloat(args[2]);
const stock = parseInt(args[3]) || 9999; // Default to unlimited
const category = args[4]?.toLowerCase() || 'phone'; // Default to phone if not specified

// Validate category
if (category !== 'phone' && category !== 'accessory' && category !== 'watch' && category !== 'tablet' && category !== 'laptop') {
  console.error(`❌ Invalid category: ${category}. Must be 'phone', 'accessory', 'watch', 'tablet', or 'laptop'`);
  process.exit(1);
}

let specs = {};
let description = '';

if (category === 'phone') {
  // Phone specs format
  const ram = args[5];
  const storage = args[6];
  const display = args[7];
  const camera = args[8];
  const battery = args[9];
  const os = args[10];
  const processor = args[11];
  description = args.slice(12).join(' ') || '';

  specs = {
    ram: ram,
    storage: storage,
    display: display,
    camera: camera,
    battery: battery,
    os: os,
    processor: processor,
    currency: 'Dt'
  };
} else {
  // Accessory specs format - flexible key:value pairs
  const specArgs = args.slice(5);
  
  // Find where description starts (if any)
  let descStartIndex = specArgs.length;
  for (let i = 0; i < specArgs.length; i++) {
    // If an arg doesn't contain ':', it might be part of description
    if (!specArgs[i].includes(':')) {
      descStartIndex = i;
      break;
    }
  }

  // Parse specs (key:value format)
  for (let i = 0; i < descStartIndex; i++) {
    const specArg = specArgs[i];
    if (specArg.includes(':')) {
      const [key, ...valueParts] = specArg.split(':');
      const value = valueParts.join(':'); // In case value contains ':'
      specs[key.trim()] = value.trim();
    }
  }

  // Remaining args are description
  description = specArgs.slice(descStartIndex).join(' ') || '';
  
  specs.currency = 'Dt';
}

const productData = {
  name,
  brand,
  price,
  stock,
  category,
  images: [], // Empty images array - user will add pictures later
  specs,
  description
};

// Add the product
addProduct(productData)
  .then((id) => {
    console.log(`\n✅ Successfully added product with ID: ${id}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error adding product:', error.message);
    process.exit(1);
  });

