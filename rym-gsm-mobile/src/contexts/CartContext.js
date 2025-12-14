import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../config/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      loadLocalCart();
    }
  }, [user]);

  const loadLocalCart = async () => {
    try {
      const localCart = await AsyncStorage.getItem('cart');
      if (localCart) {
        setCart(JSON.parse(localCart));
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const saveLocalCart = async (cartData) => {
    try {
      await AsyncStorage.setItem('cart', JSON.stringify(cartData));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  const fetchCart = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await api.get('/cart');
      // Backend returns { cart: { products: [...], total: ... } }
      const cartData = response.data.cart || response.data;
      const products = cartData.products || cartData.items || [];
      setCart(products);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      if (user) {
        // Backend uses /cart/add endpoint
        await api.post('/cart/add', { productId, quantity });
        // Refetch cart to get updated data with product details
        await fetchCart();
        return { success: true };
      } else {
        // Local cart for guests - need to fetch product details
        try {
          const productResponse = await api.get(`/products/${productId}`);
          const product = productResponse.data;
          
          const existingItemIndex = cart.findIndex(item => 
            item.productId === productId || item.product_id === productId
          );
          
          let newCart;
          if (existingItemIndex > -1) {
            newCart = cart.map((item, index) =>
              index === existingItemIndex
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          } else {
            newCart = [...cart, { 
              productId: product.id,
              product_id: product.id,
              name: product.name,
              price: product.price,
              image: product.images?.[0] || '',
              images: product.images || [],
              brand: product.brand,
              quantity 
            }];
          }
          
          setCart(newCart);
          await saveLocalCart(newCart);
          return { success: true };
        } catch (err) {
          console.error('Error fetching product for cart:', err);
          return { success: false, message: 'Produit introuvable' };
        }
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Échec de l\'ajout au panier' 
      };
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      if (user) {
        // Backend uses /cart/update endpoint
        await api.put('/cart/update', { productId, quantity });
        await fetchCart();
      } else {
        if (quantity <= 0) {
          return removeFromCart(productId);
        }
        const newCart = cart.map(item =>
          (item.productId === productId || item.product_id === productId) 
            ? { ...item, quantity } 
            : item
        );
        setCart(newCart);
        await saveLocalCart(newCart);
      }
      return { success: true };
    } catch (error) {
      console.error('Update quantity error:', error);
      return { success: false, message: 'Échec de la mise à jour' };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      if (user) {
        // Backend uses /cart/remove/:productId endpoint
        await api.delete(`/cart/remove/${productId}`);
        await fetchCart();
      } else {
        const newCart = cart.filter(item => 
          item.productId !== productId && item.product_id !== productId
        );
        setCart(newCart);
        await saveLocalCart(newCart);
      }
      return { success: true };
    } catch (error) {
      console.error('Remove from cart error:', error);
      return { success: false, message: 'Échec de la suppression' };
    }
  };

  const clearCart = async () => {
    try {
      if (user) {
        await api.delete('/cart/clear');
      }
      setCart([]);
      await AsyncStorage.removeItem('cart');
      return { success: true };
    } catch (error) {
      console.error('Clear cart error:', error);
      return { success: false };
    }
  };

  const cartCount = cart.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0);
  const cartTotal = cart.reduce((sum, item) => {
    const price = parseFloat(item.price) || parseFloat(item.product?.price) || 0;
    const quantity = parseInt(item.quantity) || 0;
    return sum + (price * quantity);
  }, 0);

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      cartCount,
      cartTotal,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
