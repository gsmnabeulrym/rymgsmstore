const express = require('express');
const { query } = require('../config/database');
const router = express.Router();

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

// POST /api/seed-reviews - Seed reviews for all products (admin only, one-time use)
router.post('/', async (req, res) => {
  try {
    // Optional: Add a secret key check for security
    const { secret } = req.body;
    if (secret !== 'rym-gsm-seed-2024') {
      return res.status(403).json({ message: 'Invalid secret key' });
    }

    console.log('🌱 Starting review seeding process...');

    // Get all products
    const products = await query('SELECT id, name FROM products');
    console.log(`📦 Found ${products.length} products`);

    if (products.length === 0) {
      return res.status(400).json({ message: 'No products found in database' });
    }

    // Get all users
    let users = await query('SELECT id, name FROM users');
    console.log(`👥 Found ${users.length} existing users`);

    // Create fake reviewer users - always create them with unique timestamps
    const minUsers = 20;
    console.log(`📝 Creating ${minUsers} fake reviewer users...`);
    
    const timestamp = Date.now();
    for (let i = 0; i < minUsers; i++) {
      const name = reviewerNames[i % reviewerNames.length];
      const email = `reviewer_${timestamp}_${i}@rymgsm.com`;
      const password = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';
      
      try {
        await query(
          'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
          [name, email, password, 'user']
        );
        console.log(`✅ Created user: ${name}`);
      } catch (err) {
        console.log(`⚠️ Could not create user ${name}: ${err.message}`);
      }
    }
    
    // Refresh users list - get ALL users
    users = await query('SELECT id, name FROM users');
    console.log(`👥 Now have ${users.length} users for reviews`);
    
    // If still no users, return error with details
    if (users.length === 0) {
      return res.status(400).json({ 
        message: 'No users available to create reviews. User creation failed.',
        debug: { timestamp, minUsers }
      });
    }

    // Check existing reviews
    const existingReviews = await query('SELECT COUNT(*) as count FROM reviews');
    const existingCount = parseInt(existingReviews[0].count);
    console.log(`📊 Existing reviews: ${existingCount}`);

    // Clear existing reviews if any
    if (existingCount > 0) {
      console.log('🗑️ Clearing existing reviews...');
      await query('DELETE FROM reviews');
    }

    // Generate reviews for each product
    let totalReviews = 0;
    let errors = [];

    // Shuffle users to get random assignment
    const shuffledUsers = [...users].sort(() => Math.random() - 0.5);

    for (const product of products) {
      // Random number of reviews per product (3-7)
      const numReviews = Math.floor(Math.random() * 5) + 3;

      for (let i = 0; i < numReviews && i < shuffledUsers.length; i++) {
        const user = shuffledUsers[i];

        // Generate rating (weighted towards positive)
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
          rating = 4;
          comment = goodComments[Math.floor(Math.random() * goodComments.length)];
        }

        try {
          await query(
            `INSERT INTO reviews (product_id, user_id, rating, comment) VALUES (?, ?, ?, ?)`,
            [product.id, user.id, rating, comment]
          );
          totalReviews++;
        } catch (err) {
          errors.push({ product: product.id, user: user.id, error: err.message });
          console.log(`⚠️ Review error: ${err.message}`);
        }
      }
    }

    console.log(`\n🎉 Successfully seeded ${totalReviews} reviews for ${products.length} products!`);
    if (errors.length > 0) {
      console.log(`⚠️ ${errors.length} errors occurred`);
    }

    // Get summary
    const summary = await query(`
      SELECT 
        COUNT(*) as total_reviews
      FROM reviews
    `);

    res.json({
      success: true,
      message: `Successfully seeded ${totalReviews} reviews for ${products.length} products`,
      stats: {
        totalReviews: parseInt(summary[0].total_reviews),
        productsWithReviews: products.length,
        usersCount: users.length,
        errorsCount: errors.length,
        sampleErrors: errors.slice(0, 5)
      }
    });

  } catch (error) {
    console.error('❌ Error seeding reviews:', error);
    res.status(500).json({ message: 'Error seeding reviews', error: error.message });
  }
});

// GET /api/seed-reviews/status - Check review status
router.get('/status', async (req, res) => {
  try {
    const reviewCount = await query('SELECT COUNT(*) as count FROM reviews');
    const productCount = await query('SELECT COUNT(*) as count FROM products');
    const userCount = await query('SELECT COUNT(*) as count FROM users');
    const avgRating = await query('SELECT ROUND(AVG(rating), 2) as avg FROM reviews');

    res.json({
      totalReviews: parseInt(reviewCount[0].count),
      totalProducts: parseInt(productCount[0].count),
      totalUsers: parseInt(userCount[0].count),
      averageRating: parseFloat(avgRating[0].avg) || 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Error checking status', error: error.message });
  }
});

// GET /api/seed-reviews/debug - Debug info
router.get('/debug', async (req, res) => {
  try {
    const users = await query('SELECT id, name, email, role FROM users LIMIT 10');
    const products = await query('SELECT id, name FROM products LIMIT 5');
    const reviews = await query('SELECT id, product_id, user_id, rating FROM reviews LIMIT 5');
    
    res.json({
      users: users,
      products: products,
      reviews: reviews,
      counts: {
        users: users.length,
        products: products.length,
        reviews: reviews.length
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error debugging', error: error.message });
  }
});

// GET /api/seed-reviews/test-insert - Test single review insert
router.get('/test-insert', async (req, res) => {
  try {
    // Get first user and first product
    const users = await query('SELECT id FROM users LIMIT 1');
    const products = await query('SELECT id FROM products LIMIT 1');
    
    if (users.length === 0 || products.length === 0) {
      return res.json({ error: 'No users or products found', users: users.length, products: products.length });
    }
    
    const userId = users[0].id;
    const productId = products[0].id;
    
    // Try to insert a test review
    try {
      const result = await query(
        'INSERT INTO reviews (product_id, user_id, rating, comment, status) VALUES (?, ?, ?, ?, ?)',
        [productId, userId, 5, 'Test review from seed script', 'approved']
      );
      
      // Check if it was inserted
      const check = await query('SELECT COUNT(*) as count FROM reviews');
      
      res.json({
        success: true,
        insertResult: result,
        userId: userId,
        productId: productId,
        reviewCount: check[0].count
      });
    } catch (insertErr) {
      res.json({
        success: false,
        error: insertErr.message,
        userId: userId,
        productId: productId
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error testing insert', error: error.message });
  }
});

module.exports = router;
