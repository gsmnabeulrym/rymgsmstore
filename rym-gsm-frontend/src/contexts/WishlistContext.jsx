import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../config/api';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();

  // Load wishlist on mount and auth changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlistFromServer();
    } else {
      loadWishlistFromStorage();
    }
  }, [isAuthenticated]);

  // Load wishlist from localStorage (for guest users)
  const loadWishlistFromStorage = () => {
    try {
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) {
        const wishlistData = JSON.parse(savedWishlist);
        setWishlist(wishlistData);
        setWishlistCount(wishlistData.length);
      } else {
        setWishlist([]);
        setWishlistCount(0);
      }
    } catch (error) {
      console.error('Error loading wishlist from storage:', error);
      setWishlist([]);
      setWishlistCount(0);
    }
  };

  // Save wishlist to localStorage (for guest users)
  const saveWishlistToStorage = (wishlistData) => {
    try {
      localStorage.setItem('wishlist', JSON.stringify(wishlistData));
    } catch (error) {
      console.error('Error saving wishlist to storage:', error);
    }
  };

  // Fetch wishlist from server (for authenticated users)
  const fetchWishlistFromServer = async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    try {
      const response = await api.get('/wishlist');
      const wishlistData = response.data.wishlist || [];
      setWishlist(wishlistData);
      setWishlistCount(wishlistData.length);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      // Fallback to localStorage
      loadWishlistFromStorage();
    } finally {
      setIsLoading(false);
    }
  };

  // Add product to wishlist
  const addToWishlist = async (product) => {
    try {
      // Check if product already in wishlist
      const isAlreadyInWishlist = wishlist.some(item => item.id === product.id);
      if (isAlreadyInWishlist) {
        toast.error('Product already in wishlist');
        return { success: false, message: 'Product already in wishlist' };
      }

      if (isAuthenticated) {
        // Save to server
        const response = await api.post('/wishlist/add', { productId: product.id });
        if (response.data.success) {
          const newWishlist = [...wishlist, product];
          setWishlist(newWishlist);
          setWishlistCount(newWishlist.length);
          toast.success('Added to wishlist ❤️');
          return { success: true };
        }
      } else {
        // Save to localStorage
        const newWishlist = [...wishlist, product];
        setWishlist(newWishlist);
        setWishlistCount(newWishlist.length);
        saveWishlistToStorage(newWishlist);
        toast.success('Added to wishlist ❤️');
        return { success: true };
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add to wishlist');
      return { success: false, message: error.response?.data?.message || 'Failed to add to wishlist' };
    }
  };

  // Remove product from wishlist
  const removeFromWishlist = async (productId) => {
    try {
      if (isAuthenticated) {
        // Remove from server
        const response = await api.delete(`/wishlist/remove/${productId}`);
        if (response.data.success) {
          const newWishlist = wishlist.filter(item => item.id !== productId);
          setWishlist(newWishlist);
          setWishlistCount(newWishlist.length);
          toast.success('Removed from wishlist');
          return { success: true };
        }
      } else {
        // Remove from localStorage
        const newWishlist = wishlist.filter(item => item.id !== productId);
        setWishlist(newWishlist);
        setWishlistCount(newWishlist.length);
        saveWishlistToStorage(newWishlist);
        toast.success('Removed from wishlist');
        return { success: true };
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove from wishlist');
      return { success: false, message: error.response?.data?.message || 'Failed to remove from wishlist' };
    }
  };

  // Toggle product in wishlist
  const toggleWishlist = async (product) => {
    const isInWishlist = wishlist.some(item => item.id === product.id);
    if (isInWishlist) {
      return await removeFromWishlist(product.id);
    } else {
      return await addToWishlist(product);
    }
  };

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  // Clear entire wishlist
  const clearWishlist = async () => {
    try {
      if (isAuthenticated) {
        const response = await api.delete('/wishlist/clear');
        if (response.data.success) {
          setWishlist([]);
          setWishlistCount(0);
          toast.success('Wishlist cleared');
          return { success: true };
        }
      } else {
        setWishlist([]);
        setWishlistCount(0);
        localStorage.removeItem('wishlist');
        toast.success('Wishlist cleared');
        return { success: true };
      }
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      toast.error('Failed to clear wishlist');
      return { success: false, message: error.response?.data?.message || 'Failed to clear wishlist' };
    }
  };

  // Get wishlist summary for sharing
  const getWishlistSummary = () => {
    const totalItems = wishlist.length;
    const totalValue = wishlist.reduce((sum, item) => sum + parseFloat(item.price || 0), 0);
    return {
      totalItems,
      totalValue: totalValue.toFixed(2),
      items: wishlist.map(item => ({
        name: item.name,
        price: item.price,
        id: item.id
      }))
    };
  };

  // Share wishlist via WhatsApp
  const shareWishlist = () => {
    const summary = getWishlistSummary();
    const whatsappNumber = "+21626419140";
    
    let message = `Hi! I'd like to inquire about these products from my wishlist:\n\n`;
    
    wishlist.forEach((item, index) => {
      message += `${index + 1}. ${item.name} - ${item.price} Dt\n`;
      message += `   Link: ${window.location.origin}/products/${item.id}\n\n`;
    });
    
    message += `Total Items: ${summary.totalItems}\n`;
    message += `Total Value: ${summary.totalValue} Dt\n\n`;
    message += `Please let me know about availability and any special offers!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const value = {
    wishlist,
    wishlistCount,
    isLoading,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist,
    getWishlistSummary,
    shareWishlist,
    fetchWishlistFromServer
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContext;
