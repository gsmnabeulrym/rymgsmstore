# 🚀 Instructions pour Ajouter Samsung Galaxy Fit 3

## Option 1: Via Admin Panel (Le Plus Simple) ✅

1. Allez sur: `https://rymgsm.com/admin/products` (ou votre URL Render)
2. Cliquez sur "Add Product" (+)
3. Remplissez:
   - **Name**: `Samsung Galaxy Fit 3`
   - **Brand**: `Samsung`
   - **Price**: `249`
   - **Stock**: `20`
   - **Category**: `watch` (Montre Connectée)
   - **Description**: (voir ci-dessous)
   - **Specs**: RAM: `16 MB`, Storage: `256 MB`, Display: `1.6" AMOLED`, Battery: `208 mAh`
4. Cliquez "Create Product"

**Description à copier:**
```
Samsung Galaxy Fit 3 - Montre connectée avec écran AMOLED 1.6" (256x402), Bluetooth 5.3, capteurs complets (FC, accéléro, gyro, baro), autonomie jusqu'à 13 jours. Garantie 1 an. Idéal pour le suivi fitness et santé.
```

---

## Option 2: Via Script sur Render Shell

Si vous voulez exécuter le script directement sur Render:

1. **Connectez-vous à Render Shell** (via Render Dashboard)
2. **Naviguez vers le dossier backend**:
   ```bash
   cd rym-gsm-backend
   ```
3. **Exécutez le script**:
   ```bash
   node scripts/add_galaxy_fit3_direct.js
   ```

Le script utilisera automatiquement le DATABASE_URL de Render.

---

## Option 3: Via Script Local (si DATABASE_URL est configuré)

Si vous avez DATABASE_URL dans votre `.env` local:

```bash
cd rym-gsm-backend
node scripts/add_galaxy_fit3_direct.js
```

---

## 📋 Données du Produit

- **Nom**: Samsung Galaxy Fit 3
- **Marque**: Samsung
- **Prix**: 249 DT
- **Stock**: 20
- **Catégorie**: watch
- **Garantie**: 1 an
- **Écran**: 1.6" AMOLED (256x402)
- **Batterie**: 208 mAh (jusqu'à 13 jours)

---

**Note**: Les images peuvent être ajoutées plus tard via le panneau admin en éditant le produit.


