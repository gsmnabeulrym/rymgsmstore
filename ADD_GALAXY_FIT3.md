# 📱 Ajouter Samsung Galaxy Fit 3

## Option 1: Via Admin Panel (Recommandé) 🌐

1. **Allez sur votre site**: `https://rymgsm.com/admin/products`
2. **Cliquez sur "Add Product" (+ button)**
3. **Remplissez le formulaire**:

   - **Product Name**: `Samsung Galaxy Fit 3`
   - **Brand**: `Samsung`
   - **Price (Dt)**: `249`
   - **Stock (optional)**: `20` (ou laissez vide pour illimité)
   - **Category**: `Montre Connectée` (watch)
   - **Description**:
     ```
     Samsung Galaxy Fit 3 - Montre connectée avec écran AMOLED 1.6" (256x402), Bluetooth 5.3, capteurs complets (FC, accéléro, gyro, baro), autonomie jusqu'à 13 jours. Garantie 1 an. Idéal pour le suivi fitness et santé.
     ```
   
   - **Images**: Ajoutez les images du produit (upload ou URLs)
   
   - **Specs** (dans les champs disponibles):
     - **RAM**: `16 MB`
     - **Storage**: `256 MB`
     - **Display**: `1.6" AMOLED 256x402`
     - **Battery**: `208 mAh (jusqu'à 13 jours)`
     - **Processor**: `FreeRTOS`
     - **Camera**: (laissez vide ou mettez les capteurs: `Accéléro, Baro, Gyro, FC optique`)
   
4. **Cliquez sur "Create Product"**

---

## Option 2: Via API (si vous avez un token admin) 🔧

### Avec cURL:
```bash
curl -X POST https://rymgsm.com/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d @rym-gsm-backend/scripts/galaxy_fit3_product.json
```

### Avec le fichier JSON créé:
Le fichier `rym-gsm-backend/scripts/galaxy_fit3_product.json` contient toutes les données.

---

## Option 3: Via Script Local (si base de données locale) 💻

Si votre base de données locale fonctionne:

```bash
cd rym-gsm-backend
node scripts/add_galaxy_fit3.js
```

---

## 📋 Détails du Produit

| Champ | Valeur |
|-------|--------|
| **Nom** | Samsung Galaxy Fit 3 |
| **Marque** | Samsung |
| **Prix** | 249 DT |
| **Catégorie** | watch (Montre Connectée) |
| **Stock** | 20 (ajustable) |
| **Garantie** | 1 an |
| **Écran** | 1.6" AMOLED (256x402) |
| **Batterie** | 208 mAh (jusqu'à 13 jours) |
| **Bluetooth** | v5.3 |
| **RAM** | 16 MB |
| **Stockage** | 256 MB |

---

## ✅ Après l'ajout

1. **Vérifiez** que le produit apparaît dans `/admin/products`
2. **Ajoutez des images** pour une meilleure visibilité
3. **Testez** en visitant la page produit sur le frontend
4. **Le produit sera automatiquement inclus** dans votre sitemap SEO!

---

**Bon ajout! 🎉**


