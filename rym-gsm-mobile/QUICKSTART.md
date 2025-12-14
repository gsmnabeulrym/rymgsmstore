# RYM GSM Mobile - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies
```bash
cd rym-gsm-mobile
npm install
```

### Step 2: Configure Backend URL

Open `src/config/api.js` and update the API URL:

**For local testing:**
```javascript
const API_URL = 'http://YOUR_COMPUTER_IP:5000/api';
```

Find your IP:
- Windows: `ipconfig` (look for IPv4 Address)
- Mac/Linux: `ifconfig` or `ip addr`

**For production:**
```javascript
const API_URL = 'https://your-backend.onrender.com/api';
```

### Step 3: Start the App
```bash
npm start
```

### Step 4: Test on Your Phone

1. **Install Expo Go:**
   - Android: [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)

2. **Scan QR Code:**
   - Android: Open Expo Go and scan QR code
   - iOS: Open Camera app and scan QR code

3. **Start Testing!** 🎉

---

## 📱 Features to Test

### ✅ Home Screen
- View featured products
- Browse categories
- See promotional banners

### ✅ Products
- Search products
- Filter by category
- View product details
- Add to cart

### ✅ Cart
- Update quantities
- Remove items
- View total

### ✅ Checkout
- Enter shipping info
- Place order
- View confirmation

### ✅ Authentication
- Register new account
- Login
- View profile
- See order history

---

## 🔧 Troubleshooting

### Can't connect to backend?

**Problem:** "Network request failed" or "Cannot connect"

**Solution:**
1. Make sure backend is running (`npm start` in backend folder)
2. Use your computer's IP address, NOT `localhost`
3. Make sure phone and computer are on the same WiFi
4. Check firewall settings

Example:
```javascript
// ❌ Wrong
const API_URL = 'http://localhost:5000/api';

// ✅ Correct
const API_URL = 'http://192.168.1.100:5000/api';
```

### App won't start?

```bash
# Clear cache and restart
expo start -c
```

### Dependencies issues?

```bash
# Reinstall everything
rm -rf node_modules
npm install
```

---

## 📦 Building for Production

### Android APK

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build APK
eas build --platform android --profile preview
```

### iOS App (Mac only)

```bash
eas build --platform ios --profile preview
```

---

## 🎨 Customization

### Change Colors

Edit `src/theme/colors.js`:
```javascript
export const colors = {
  primary: {
    600: '#YOUR_COLOR',  // Main brand color
  },
  // ... more colors
};
```

### Change Logo

Replace logo in your screens or add to `assets/` folder.

### Add Features

All screens are in `src/screens/` - edit them to add new features!

---

## 📞 Need Help?

- Check `README.md` for detailed documentation
- Review code comments in each file
- Test on Expo Go before building production app

---

## 🎯 Next Steps

1. ✅ Test all features on your phone
2. ✅ Update backend URL for production
3. ✅ Customize colors and branding
4. ✅ Add your logo and app icon
5. ✅ Build APK/IPA for distribution
6. ✅ Publish to Google Play / App Store

**Your RYM GSM mobile app is ready! 🚀**
