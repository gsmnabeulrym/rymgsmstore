const db = require('../config/database');

async function checkSpecs() {
  try {
    const [rows] = await db.pool.execute('SELECT id, name, category, specs FROM products WHERE id >= 142 ORDER BY id');
    
    rows.forEach(row => {
      const specs = JSON.parse(row.specs);
      const specKeys = Object.keys(specs).filter(k => k !== 'currency');
      const specCount = specKeys.length;
      
      console.log(`\nID ${row.id}: ${row.name} (${row.category})`);
      console.log(`  Specs count: ${specCount}`);
      
      if (specCount === 0) {
        console.log('  ❌ NO SPECS SAVED!');
      } else {
        console.log('  ✅ Has specs:');
        specKeys.forEach(key => {
          console.log(`    - ${key}: ${specs[key]}`);
        });
      }
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkSpecs();

