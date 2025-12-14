# RYM GSM Mobile App

React Native mobile application for RYM GSM phone store built with Expo.

## Features

- 📱 **Native Mobile Experience** - iOS & Android support
- 🛍️ **Product Browsing** - Browse products by categories with filters
- 🔍 **Search** - Search products by name, brand, or category
- 🛒 **Shopping Cart** - Add/remove products, update quantities
- 💳 **Checkout** - Complete order with shipping information
- 👤 **User Authentication** - Login/Register functionality
- 📦 **Order History** - View past orders and status
- 🎨 **Modern UI** - Beautiful design matching the website

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your phone (for testing)

## Installation

1. Navigate to the mobile app directory:
```bash
cd rym-gsm-mobile
```

2. Install dependencies:
```bash
npm install
```

3. Update API URL in `src/config/api.js`:
```javascript
const API_URL = 'https://your-backend-url.onrender.com/api';
```

## Running the App

### Development Mode

Start the Expo development server:
```bash
npm start
```

This will open Expo DevTools in your browser. You can then:
- Scan the QR code with Expo Go app (Android)
- Scan the QR code with Camera app (iOS)
- Press `a` to open in Android emulator
- Press `i` to open in iOS simulator (Mac only)

### Run on Android
```bash
npm run android
```

### Run on iOS (Mac only)
```bash
npm run ios
```

### Run on Web
```bash
npm run web
```

## Project Structure

```
rym-gsm-mobile/
├── src/
│   ├── config/
│   │   └── api.js              # API configuration
│   ├── contexts/
│   │   ├── AuthContext.js      # Authentication state
│   │   └── CartContext.js      # Cart state management
│   ├── navigation/
│   │   └── AppNavigator.js     # Navigation setup
│   ├── screens/
│   │   ├── HomeScreen.js       # Home page
│   │   ├── ProductsScreen.js   # Products listing
│   │   ├── ProductDetailsScreen.js
│   │   ├── CartScreen.js       # Shopping cart
│   │   ├── CheckoutScreen.js   # Checkout process
│   │   ├── LoginScreen.js      # Login
│   │   ├── RegisterScreen.js   # Registration
│   │   ├── ProfileScreen.js    # User profile
│   │   └── OrdersScreen.js     # Order history
│   └── theme/
│       └── colors.js           # Color palette
├── App.js                      # Main app component
└── package.json

```

## Building for Production

### Android APK

1. Configure app.json with your app details
2. Build APK:
```bash
expo build:android
```

### iOS App

1. Configure app.json with your app details
2. Build IPA (requires Apple Developer account):
```bash
expo build:ios
```

### Using EAS Build (Recommended)

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Configure EAS:
```bash
eas build:configure
```

3. Build for Android:
```bash
eas build --platform android
```

4. Build for iOS:
```bash
eas build --platform ios
```

## Publishing to App Stores

### Google Play Store
1. Create a Google Play Developer account ($25 one-time fee)
2. Build signed APK/AAB with EAS
3. Upload to Google Play Console
4. Fill in store listing details
5. Submit for review

### Apple App Store
1. Create Apple Developer account ($99/year)
2. Build IPA with EAS
3. Upload to App Store Connect
4. Fill in app information
5. Submit for review

## Configuration

### Update Backend URL

Edit `src/config/api.js`:
```javascript
const API_URL = __DEV__ 
  ? 'http://YOUR_LOCAL_IP:5000/api'  // For local testing
  : 'https://your-backend.onrender.com/api';  // For production
```

**Note:** For local testing on physical device, use your computer's local IP address instead of `localhost`.

### App Icon & Splash Screen

1. Replace `assets/icon.png` with your app icon (1024x1024)
2. Replace `assets/splash.png` with your splash screen
3. Run:
```bash
expo prebuild
```

## Testing

### On Physical Device
1. Install Expo Go from App Store/Play Store
2. Run `npm start`
3. Scan QR code with Expo Go (Android) or Camera (iOS)

### On Emulator
- **Android:** Start Android Studio emulator, then `npm run android`
- **iOS:** Start Xcode simulator (Mac only), then `npm run ios`

## Troubleshooting

### Cannot connect to backend
- Make sure backend is running
- Use your computer's local IP instead of localhost
- Check firewall settings

### Build errors
```bash
# Clear cache
expo start -c

# Reinstall dependencies
rm -rf node_modules
npm install
```

### Navigation issues
```bash
# Reinstall navigation packages
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
```

## Tech Stack

- **React Native** - Mobile framework
- **Expo** - Development platform
- **React Navigation** - Navigation library
- **Axios** - HTTP client
- **AsyncStorage** - Local storage
- **Expo Linear Gradient** - Gradient backgrounds
- **Expo Vector Icons** - Icon library

## License

© 2024 RYM GSM Nabeul. All rights reserved.
