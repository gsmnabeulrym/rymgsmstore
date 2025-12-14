import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../theme/colors';

// Screens
import HomeScreen from '../screens/HomeScreen';
import ProductsScreen from '../screens/ProductsScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ProfileScreen from '../screens/ProfileScreen';
import OrdersScreen from '../screens/OrdersScreen';
import OrderDetailsScreen from '../screens/OrderDetailsScreen';
import WishlistScreen from '../screens/WishlistScreen';
import ContactScreen from '../screens/ContactScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import AddressesScreen from '../screens/AddressesScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeTabs = () => {
  const { user } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'ProductsTab') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'CartTab') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary[600],
        tabBarInactiveTintColor: colors.gray[400],
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen} 
        options={{ tabBarLabel: 'Accueil' }}
      />
      <Tab.Screen 
        name="ProductsTab" 
        component={ProductsScreen} 
        options={{ tabBarLabel: 'Produits' }}
      />
      <Tab.Screen 
        name="CartTab" 
        component={CartScreen} 
        options={{ tabBarLabel: 'Panier' }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={user ? ProfileScreen : LoginScreen} 
        options={{ tabBarLabel: user ? 'Profil' : 'Connexion' }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.primary[600],
          },
          headerTintColor: colors.white,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Main" 
          component={HomeTabs} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="ProductDetails" 
          component={ProductDetailsScreen}
          options={{ title: 'Détails du Produit' }}
        />
        <Stack.Screen 
          name="Checkout" 
          component={CheckoutScreen}
          options={{ title: 'Commander' }}
        />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{ title: 'Connexion' }}
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen}
          options={{ title: 'Inscription' }}
        />
        <Stack.Screen 
          name="Orders" 
          component={OrdersScreen}
          options={{ title: 'Mes Commandes' }}
        />
        <Stack.Screen 
          name="OrderDetails" 
          component={OrderDetailsScreen}
          options={{ title: 'Détails Commande' }}
        />
        <Stack.Screen 
          name="Wishlist" 
          component={WishlistScreen}
          options={{ title: 'Liste de Souhaits' }}
        />
        <Stack.Screen 
          name="Contact" 
          component={ContactScreen}
          options={{ title: 'Contact' }}
        />
        <Stack.Screen 
          name="Notifications" 
          component={NotificationsScreen}
          options={{ title: 'Notifications' }}
        />
        <Stack.Screen 
          name="EditProfile" 
          component={EditProfileScreen}
          options={{ title: 'Modifier le Profil' }}
        />
        <Stack.Screen 
          name="Addresses" 
          component={AddressesScreen}
          options={{ title: 'Mes Adresses' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
