const express = require('express');
const router = express.Router();
const { query, getDbType } = require('../config/database');

// Generate dynamic sitemap.xml with all products
router.get('/sitemap.xml', async (req, res) => {
  try {
    const siteUrl = 'https://rymgsm.com';
    const dbType = getDbType();
    
    // Get all products with their updated dates
    let productsQuery;
    if (dbType === 'postgres') {
      productsQuery = `
        SELECT id, name, category, updated_at, created_at
        FROM products
        WHERE stock > 0
        ORDER BY updated_at DESC, created_at DESC
      `;
    } else {
      productsQuery = `
        SELECT id, name, category, updated_at, created_at
        FROM products
        WHERE stock > 0
        ORDER BY updated_at DESC, created_at DESC
      `;
    }
    
    const products = await query(productsQuery);
    
    // Get unique categories
    const categories = await query(`
      SELECT DISTINCT category 
      FROM products 
      WHERE stock > 0 AND category IS NOT NULL
    `);
    
    // Get unique brands
    const brands = await query(`
      SELECT DISTINCT brand 
      FROM products 
      WHERE stock > 0 AND brand IS NOT NULL
    `);
    
    // Current date for lastmod
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Build sitemap XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  
  <!-- Home Page - Highest Priority -->
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="fr-TN" href="${siteUrl}/" />
    <xhtml:link rel="alternate" hreflang="fr" href="${siteUrl}/" />
    <xhtml:link rel="alternate" hreflang="ar-TN" href="${siteUrl}/" />
  </url>
  
  <!-- Products Listing Page -->
  <url>
    <loc>${siteUrl}/products</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Category Pages -->
`;
    
    // Add category pages
    categories.forEach(cat => {
      const category = cat.category || cat.CATEGORY;
      const categorySlug = encodeURIComponent(category.toLowerCase());
      const categoryLastMod = currentDate;
      
      xml += `  <url>
    <loc>${siteUrl}/products?category=${categorySlug}</loc>
    <lastmod>${categoryLastMod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
`;
    });
    
    // Add brand pages
    brands.forEach(brandObj => {
      const brand = brandObj.brand || brandObj.BRAND;
      if (brand) {
        const brandSlug = encodeURIComponent(brand.toLowerCase().replace(/\s+/g, '-'));
        xml += `  <url>
    <loc>${siteUrl}/products?brand=${brandSlug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`;
      }
    });
    
    // Add individual product pages
    products.forEach(product => {
      const productId = product.id || product.ID;
      const productName = (product.name || product.NAME || '').replace(/[<>]/g, '');
      const updatedAt = product.updated_at || product.UPDATED_AT || product.created_at || product.CREATED_AT;
      
      let lastmod = currentDate;
      if (updatedAt) {
        const date = new Date(updatedAt);
        if (!isNaN(date.getTime())) {
          lastmod = date.toISOString().split('T')[0];
        }
      }
      
      xml += `  <url>
    <loc>${siteUrl}/products/${productId}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
`;
      
      // Add product image if available
      // Note: You can enhance this to include actual product images
      xml += `    <image:image>
      <image:loc>${siteUrl}/images/phones/rymgsmlogo.png</image:loc>
      <image:title>${productName}</image:title>
      <image:caption>${productName} - RYM GSM Nabeul</image:caption>
    </image:image>
`;
      
      xml += `  </url>
`;
    });
    
    // Add other important pages
    xml += `  
  <!-- Contact Page -->
  <url>
    <loc>${siteUrl}/contact</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  
  <!-- Login/Register (lower priority, but still indexed) -->
  <url>
    <loc>${siteUrl}/login</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
  
  <url>
    <loc>${siteUrl}/register</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
  
</urlset>`;
    
    res.set('Content-Type', 'text/xml');
    res.send(xml);
    
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).send('Error generating sitemap');
  }
});

module.exports = router;

