require('dotenv').config();
const { Pool } = require('pg');

// Production PostgreSQL connection - use EXTERNAL URL for local access (outside Render)
// Internal URL: dpg-d4rak3je5dus73f5iir0-a (only works inside Render)
// External URL: dpg-d4rak3je5dus73f5iir0-a.frankfurt-postgres.render.com (works from anywhere)
const DATABASE_URL = process.env.DATABASE_URL || 'postgres://rym_gsm_user:mfr6ddBRD26Hml2k8QH50VOI2aiQgMgg@dpg-d4rak3je5dus73f5iir0-a.frankfurt-postgres.render.com:5432/rym_gsm';

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 30000,
  idleTimeoutMillis: 30000
});

// Realistic French review comments for phones
const positiveComments = [
  "Excellent téléphone ! La qualité de l'écran est incroyable et la batterie tient toute la journée. Je recommande vivement.",
  "Très satisfait de mon achat. Le rapport qualité-prix est excellent. Livraison rapide par RYM GSM.",
  "Super produit ! Les photos sont magnifiques et le téléphone est très fluide. Merci RYM GSM !",
  "Je suis vraiment content de cet achat. Le design est élégant et les performances sont au top.",
  "Parfait pour mon usage quotidien. L'appareil photo est excellent et la batterie dure longtemps.",
  "Meilleur achat que j'ai fait cette année ! Le téléphone est rapide et l'écran est superbe.",
  "Qualité exceptionnelle ! Je recommande ce produit à tous mes amis. Service client RYM GSM au top.",
  "Très bon téléphone, conforme à la description. Livraison rapide et produit bien emballé.",
  "J'adore ce téléphone ! Il est beau, performant et la caméra prend des photos incroyables.",
  "Excellent rapport qualité-prix. Le téléphone fonctionne parfaitement depuis plusieurs mois.",
  "Super expérience d'achat chez RYM GSM. Le produit est arrivé rapidement et en parfait état.",
  "Ce téléphone dépasse mes attentes ! L'écran est magnifique et les performances sont excellentes.",
  "Très content de mon nouveau téléphone. La qualité de construction est impressionnante.",
  "Produit de qualité supérieure. Je suis très satisfait de mon achat chez RYM GSM.",
  "Le meilleur téléphone que j'ai eu ! Rapide, beau et avec une excellente autonomie.",
  "Achat parfait ! Le téléphone est exactement comme décrit. Merci pour le service rapide.",
  "Incroyable qualité d'écran et de son. Ce téléphone vaut vraiment son prix.",
  "Je recommande fortement ce produit. Excellent service et produit de haute qualité.",
  "Téléphone magnifique avec des fonctionnalités top. Très satisfait de RYM GSM.",
  "Super achat ! Le téléphone est fluide, la batterie est excellente et le design est moderne."
];

const goodComments = [
  "Bon téléphone dans l'ensemble. Quelques petits détails à améliorer mais je suis satisfait.",
  "Produit correct pour le prix. La livraison était rapide et le service client réactif.",
  "Téléphone fonctionnel et fiable. Rien d'extraordinaire mais fait bien le travail.",
  "Satisfait de mon achat. Le téléphone répond à mes besoins quotidiens sans problème.",
  "Bon rapport qualité-prix. Le téléphone est performant pour un usage normal.",
  "Produit conforme à mes attentes. La batterie pourrait être un peu meilleure.",
  "Téléphone correct avec une bonne autonomie. L'appareil photo est acceptable.",
  "Je suis content de mon achat. Le téléphone fonctionne bien depuis plusieurs semaines.",
  "Bon produit pour le prix demandé. Service RYM GSM professionnel.",
  "Téléphone solide et fiable. Je le recommande pour un usage quotidien standard."
];

const averageComments = [
  "Produit moyen. Fait le travail mais rien d'exceptionnel. Service client correct.",
  "Téléphone basique mais fonctionnel. Convient pour un usage simple.",
  "Correct pour le prix. Quelques lenteurs parfois mais globalement acceptable."
];

// Tunisian names for reviewers
const reviewerNames = [
  "Ahmed Ben Ali", "Fatma Trabelsi", "Mohamed Gharbi", "Amira Bouazizi", "Youssef Mansouri",
  "Salma Hamdi", "Karim Jebali", "Mariem Chaabane", "Nizar Belhadj", "Ines Maalej",
  "Sami Dridi", "Rania Khelifi", "Hichem Sassi", "Nour Mejri", "Walid Bouzid",
  "Sonia Ferchichi", "Riadh Ayari", "Asma Guesmi", "Mehdi Riahi", "Hajer Souissi",
  "Amine Lahmar", "Rim Bouslama", "Fares Mahjoub", "Olfa Kchaou", "Bilel Hammami",
  "Cyrine Belhaj", "Zied Arfaoui", "Emna Jaziri", "Oussama Khemiri", "Malek Saidi"
];

async function seedReviews() {
  try {
    console.log('🔌 Connecting to PostgreSQL database...');
    await pool.connect();
    console.log('✅ Connected successfully!');

    // Get all products
    const productsResult = await pool.query('SELECT id, name FROM products');
    const products = productsResult.rows;
    console.log(`📦 Found ${products.length} products`);

    if (products.length === 0) {
      console.log('❌ No products found in database. Please add products first.');
      process.exit(1);
    }

    // Get all users (we'll create fake users if needed)
    const usersResult = await pool.query('SELECT id, name FROM users');
    let users = usersResult.rows;
    console.log(`👥 Found ${users.length} existing users`);

    // Create fake reviewer users if we don't have enough
    const minUsers = 15;
    if (users.length < minUsers) {
      console.log(`📝 Creating ${minUsers - users.length} fake reviewer users...`);
      
      for (let i = users.length; i < minUsers; i++) {
        const name = reviewerNames[i % reviewerNames.length];
        const email = `reviewer${i + 1}@rymgsm.com`;
        const password = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'; // hashed 'password'
        
        try {
          const insertResult = await pool.query(
            'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name',
            [name, email, password, 'user']
          );
          users.push(insertResult.rows[0]);
        } catch (err) {
          // User might already exist, skip
          if (!err.message.includes('duplicate')) {
            console.log(`⚠️ Could not create user ${name}: ${err.message}`);
          }
        }
      }
      
      // Refresh users list
      const refreshedUsers = await pool.query('SELECT id, name FROM users WHERE role = $1', ['user']);
      users = refreshedUsers.rows;
      console.log(`👥 Now have ${users.length} users for reviews`);
    }

    // Check existing reviews
    const existingReviews = await pool.query('SELECT COUNT(*) as count FROM reviews');
    console.log(`📊 Existing reviews: ${existingReviews.rows[0].count}`);

    // Clear existing reviews if any
    if (parseInt(existingReviews.rows[0].count) > 0) {
      console.log('🗑️ Clearing existing reviews...');
      await pool.query('DELETE FROM reviews');
    }

    // Generate reviews for each product
    let totalReviews = 0;
    console.log('\n🌱 Seeding reviews for each product...\n');

    for (const product of products) {
      // Random number of reviews per product (3-8)
      const numReviews = Math.floor(Math.random() * 6) + 3;
      const usedUserIds = new Set();

      for (let i = 0; i < numReviews && i < users.length; i++) {
        // Pick a random user that hasn't reviewed this product yet
        let user;
        let attempts = 0;
        do {
          user = users[Math.floor(Math.random() * users.length)];
          attempts++;
        } while (usedUserIds.has(user.id) && attempts < 20);

        if (usedUserIds.has(user.id)) continue;
        usedUserIds.add(user.id);

        // Generate rating (weighted towards positive: 60% 5-star, 25% 4-star, 10% 3-star, 5% lower)
        const ratingRoll = Math.random();
        let rating;
        let comment;

        if (ratingRoll < 0.60) {
          rating = 5;
          comment = positiveComments[Math.floor(Math.random() * positiveComments.length)];
        } else if (ratingRoll < 0.85) {
          rating = 4;
          comment = goodComments[Math.floor(Math.random() * goodComments.length)];
        } else if (ratingRoll < 0.95) {
          rating = 3;
          comment = averageComments[Math.floor(Math.random() * averageComments.length)];
        } else {
          rating = Math.random() < 0.5 ? 2 : 4;
          comment = goodComments[Math.floor(Math.random() * goodComments.length)];
        }

        // Random date within last 6 months
        const daysAgo = Math.floor(Math.random() * 180);
        const reviewDate = new Date();
        reviewDate.setDate(reviewDate.getDate() - daysAgo);

        try {
          await pool.query(
            `INSERT INTO reviews (product_id, user_id, rating, comment, status, created_at, updated_at) 
             VALUES ($1, $2, $3, $4, $5, $6, $6)`,
            [product.id, user.id, rating, comment, 'approved', reviewDate.toISOString()]
          );
          totalReviews++;
        } catch (err) {
          console.log(`⚠️ Could not create review for product ${product.id}: ${err.message}`);
        }
      }

      console.log(`  ✅ ${product.name}: ${usedUserIds.size} reviews added`);
    }

    console.log(`\n🎉 Successfully seeded ${totalReviews} reviews for ${products.length} products!`);

    // Show summary
    const summary = await pool.query(`
      SELECT 
        COUNT(*) as total_reviews,
        ROUND(AVG(rating), 2) as avg_rating,
        COUNT(DISTINCT product_id) as products_with_reviews
      FROM reviews
    `);
    
    console.log('\n📊 Summary:');
    console.log(`   Total reviews: ${summary.rows[0].total_reviews}`);
    console.log(`   Average rating: ${summary.rows[0].avg_rating} ⭐`);
    console.log(`   Products with reviews: ${summary.rows[0].products_with_reviews}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding reviews:', error);
    process.exit(1);
  }
}

seedReviews();
