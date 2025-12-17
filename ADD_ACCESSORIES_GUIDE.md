# 📱 Guide: How to Add Accessories to Your Store

## 🎯 Quick Start Options

You have **3 ways** to add accessories to your store:

---

## Option 1: Use the Admin Panel (Recommended) 🌐

1. **Login as Admin**:
   - Go to your website: `https://rymgsm.com/admin`
   - Login with admin credentials

2. **Navigate to Products**:
   - Click on "Products" in the admin menu
   - Click the "Add Product" button (+)

3. **Fill in Accessory Details**:
   - **Product Name**: e.g., "Casque Bluetooth Sans Fil"
   - **Brand**: e.g., "Sony", "Samsung", "Xiaomi"
   - **Price**: in TND (e.g., 89.99)
   - **Stock**: (optional, leave empty for unlimited)
   - **Category**: Select "Accessoire" from dropdown
   - **Description**: Full product description
   - **Images**: Upload or add image URLs (comma-separated)

4. **Specs** (Optional - for accessories, you can leave these empty or fill if needed):
   - The current form has phone-specific fields (RAM, Storage, etc.)
   - For accessories, these fields are optional
   - You can leave them blank or use them creatively (e.g., put specs in "Description" field)

5. **Save**: Click "Create Product"

---

## Option 2: Use the Command Line Script (Fast) ⚡

### Single Accessory:
```bash
cd rym-gsm-backend
node scripts/add_product.js "Nom du Produit" "Marque" 99.99 50 accessory "Type:Casque" "Battery:30h" "Description complète ici"
```

### Example:
```bash
node scripts/add_product.js "Casque Bluetooth Sony" "Sony" 89.99 50 accessory "Type:Casque Bluetooth" "Battery:30 heures" "Connectivité:Bluetooth 5.0" "Casque haute qualité avec réduction de bruit active"
```

**Format for accessories:**
- `name` `brand` `price` `stock` `accessory` `spec1:value1` `spec2:value2` ... `description`

### Bulk Add (Pre-configured Accessories):
```bash
cd rym-gsm-backend
node scripts/add_accessories.js
```

This will add 10 pre-configured popular accessories to your store!

---

## Option 3: Add via API (For Developers) 🔧

If you want to add accessories programmatically:

```javascript
POST /api/products
Headers: {
  Authorization: "Bearer YOUR_ADMIN_TOKEN"
}
Body: {
  "name": "Casque Bluetooth",
  "brand": "Sony",
  "price": 89.99,
  "stock": 50,
  "category": "accessory",
  "images": ["/images/accessories/casque1.jpg"],
  "specs": {
    "type": "Casque Bluetooth",
    "battery": "30 heures",
    "connectivité": "Bluetooth 5.0"
  },
  "description": "Casque Bluetooth haute qualité..."
}
```

---

## 📋 Popular Accessories to Add

### 1. **Écouteurs & Casques**
- Écouteurs True Wireless
- Casques Bluetooth
- Écouteurs filaires

### 2. **Chargeurs & Câbles**
- Chargeurs rapides (USB-C, Lightning)
- Câbles de charge (USB-C, Lightning, Micro-USB)
- Powerbanks / Batteries externes

### 3. **Protection**
- Coques de protection (rigides, souples, transparentes)
- Protections d'écran (verre trempé)
- Étuis et housses

### 4. **Supports & Accessoires Auto**
- Supports voiture (magnétiques, ventouse)
- Support bureau
- Support mur

### 5. **Autres Accessoires**
- Enceintes Bluetooth
- Stylos actifs (S Pen, Apple Pencil)
- Objectifs photo
- Trépieds
- Cartes mémoire
- Adaptateurs (USB-C to HDMI, etc.)

---

## 💡 Tips for Adding Accessories

1. **Good Descriptions**: Write detailed, SEO-friendly descriptions
   - Include key features
   - Mention compatibility
   - Add keywords like "Tunisie", "Nabeul", brand names

2. **Quality Images**: 
   - Use high-resolution images
   - Show product from multiple angles
   - Use white or transparent background

3. **Accurate Specs**: 
   - Be specific about compatibility
   - Include technical details (battery life, connectivity, etc.)
   - Mention color options if applicable

4. **Competitive Pricing**: 
   - Research competitor prices
   - Offer good value
   - Consider bundle deals

5. **SEO Keywords**: 
   - Use keywords like "accessoire téléphone Tunisie"
   - Include brand names
   - Add location: "Nabeul", "Tunisie"

---

## 🚀 Quick Example: Adding an Accessory via Script

```bash
# Example: Add a Powerbank
node scripts/add_product.js "Powerbank 20000mAh" "Xiaomi" 45.99 100 accessory "Capacité:20000mAh" "Ports:2x USB-A + 1x USB-C" "Charge Rapide:18W" "Powerbank haute capacité Xiaomi. Recharge rapide jusqu'à 18W. Compatible avec tous les smartphones."
```

---

## ✅ After Adding Accessories

1. **Verify in Admin Panel**: Check that the accessory appears correctly
2. **Test on Frontend**: View the product on your website
3. **Add Images**: Upload product images for better visibility
4. **Update Inventory**: Monitor stock levels
5. **SEO**: The product will automatically be included in your sitemap!

---

## 📞 Need Help?

If you need to add many accessories or customize the process:
- Modify `scripts/add_accessories.js` with your own products
- Use the admin panel for manual additions
- Contact support for bulk imports

---

**Happy Selling! 🎉**


