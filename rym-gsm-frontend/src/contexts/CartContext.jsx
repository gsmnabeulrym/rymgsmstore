import { createContext, useContext, useState, useEffect } from 'react';
import api from '../config/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ products: [], total: 0 });
  const [cartCount, setCartCount] = useState(0);
  const { isAuthenticated } = useAuth();

  // Fetch cart from server when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart({ products: [], total: 0 });
      setCartCount(0);
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      const response = await api.get('/cart');
      setCart(response.data.cart);
      setCartCount(response.data.cart.products.length);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      await api.post('/cart/add', { productId, quantity });
      await fetchCart();
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to add to cart' 
      };
    }
  };

  const updateCartItem = async (productId, quantity) => {
    try {
      await api.put('/cart/update', { productId, quantity });
      await fetchCart();
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update cart' 
      };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await api.delete(`/cart/remove/${productId}`);
      await fetchCart();
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to remove from cart' 
      };
    }
  };

  const clearCart = async () => {
    try {
      await api.delete('/cart/clear');
      setCart({ products: [], total: 0 });
      setCartCount(0);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to clear cart' 
      };
    }
  };

  const value = {
    cart,
    cartCount,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    fetchCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
