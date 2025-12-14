import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../config/api';

const ComparisonContext = createContext();

export const useComparison = () => {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
};

export const ComparisonProvider = ({ children }) => {
  const [comparisonList, setComparisonList] = useState([]);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load comparison list from localStorage on mount
  useEffect(() => {
    const savedComparison = localStorage.getItem('phoneComparison');
    if (savedComparison) {
      try {
        const parsed = JSON.parse(savedComparison);
        setComparisonList(parsed);
      } catch (error) {
        console.error('Failed to parse saved comparison:', error);
        localStorage.removeItem('phoneComparison');
      }
    }
  }, []);

  // Save to localStorage whenever comparison list changes
  useEffect(() => {
    localStorage.setItem('phoneComparison', JSON.stringify(comparisonList));
  }, [comparisonList]);

  // Add product to comparison
  const addToComparison = (product) => {
    if (comparisonList.length >= 4) {
      alert('You can compare maximum 4 products at once');
      return false;
    }

    if (comparisonList.find(item => item.id === product.id)) {
      alert('This product is already in comparison');
      return false;
    }

    setComparisonList(prev => [...prev, product]);
    
    // Show success message
    const message = `${product.name} added to comparison (${comparisonList.length + 1}/4)`;
    console.log('✅', message);
    
    return true;
  };

  // Remove product from comparison
  const removeFromComparison = (productId) => {
    setComparisonList(prev => prev.filter(item => item.id !== productId));
  };

  // Clear all comparisons
  const clearComparison = () => {
    setComparisonList([]);
    setIsComparisonOpen(false);
  };

  // Check if product is in comparison
  const isInComparison = (productId) => {
    return comparisonList.some(item => item.id === productId);
  };

  // Get detailed comparison data from API
  const getComparisonData = async () => {
    if (comparisonList.length === 0) {
      return [];
    }
    
    setLoading(true);
    try {
      const productIds = comparisonList.map(item => item.id).join(',');
      const response = await api.get(`/comparison/products/${productIds}`);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to fetch comparison data');
      }
    } catch (error) {
      console.error('❌ Error fetching comparison data:', error);
      alert('Failed to load comparison data. Please try again.');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Get similar products for suggestions
  const getSimilarProducts = async (productId) => {
    try {
      const response = await api.get(`/comparison/similar/${productId}`);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to fetch similar products');
      }
    } catch (error) {
      console.error('❌ Error fetching similar products:', error);
      return [];
    }
  };

  // Open comparison view
  const openComparison = () => {
    if (comparisonList.length < 2) {
      alert('Please add at least 2 products to compare');
      return;
    }
    setIsComparisonOpen(true);
  };

  // Close comparison view
  const closeComparison = () => {
    setIsComparisonOpen(false);
  };

  const value = {
    // State
    comparisonList,
    isComparisonOpen,
    loading,
    
    // Actions
    addToComparison,
    removeFromComparison,
    clearComparison,
    isInComparison,
    getComparisonData,
    getSimilarProducts,
    openComparison,
    closeComparison,
    
    // Computed values
    comparisonCount: comparisonList.length,
    canCompare: comparisonList.length >= 2,
    isFull: comparisonList.length >= 4
  };

  return (
    <ComparisonContext.Provider value={value}>
      {children}
    </ComparisonContext.Provider>
  );
};
