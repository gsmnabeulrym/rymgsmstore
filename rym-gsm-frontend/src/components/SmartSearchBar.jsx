import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, TrendingUp, Smartphone, Laptop, Headphones } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../config/api';

const SmartSearchBar = ({ className = "", onSearch, placeholder = "Rechercher t\u00e9l\u00e9phones, accessoires..." }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Fetch search suggestions
  const { data: suggestions, isLoading: suggestionsLoading } = useQuery({
    queryKey: ['search-suggestions', query],
    queryFn: async () => {
      if (query.length < 2) return { products: [], brands: [], categories: [] };
      const response = await api.get(`/products/search/suggestions?q=${encodeURIComponent(query)}`);
      return response.data;
    },
    enabled: query.length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Popular searches and categories
  const popularSearches = [
    'iPhone 15', 'Samsung Galaxy', 'Xiaomi', 'Headphones', 'Charger', 'Case'
  ];

  const quickCategories = [
    { name: 'T\u00e9l\u00e9phones', icon: <Smartphone className="w-4 h-4" />, query: 'category:phone' },
    { name: 'Ordinateurs', icon: <Laptop className="w-4 h-4" />, query: 'category:laptop' },
    { name: 'Accessoires', icon: <Headphones className="w-4 h-4" />, query: 'category:accessory' }
  ];

  // Handle search submission
  const handleSearch = (searchQuery = query) => {
    if (!searchQuery.trim()) return;

    // Save to recent searches
    const newRecentSearches = [
      searchQuery,
      ...recentSearches.filter(s => s !== searchQuery)
    ].slice(0, 5);
    
    setRecentSearches(newRecentSearches);
    localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));

    // Navigate to products page with search
    navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    setIsOpen(false);
    setQuery('');

    // Call parent callback if provided
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setIsOpen(true);
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  // Clear search
  const clearSearch = () => {
    setQuery('');
    setIsOpen(false);
    searchRef.current?.focus();
  };

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Search Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
          {/* Loading State */}
          {suggestionsLoading && query.length >= 2 && (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Recherche en cours...</p>
            </div>
          )}

          {/* Search Suggestions */}
          {suggestions && query.length >= 2 && !suggestionsLoading && (
            <div className="p-2">
              {/* Product Suggestions */}
              {suggestions.products?.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2">
                    Produits
                  </h4>
                  {suggestions.products.slice(0, 5).map((product) => (
                    <button
                      key={product.id}
                      onClick={() => navigate(`/products/${product.id}`)}
                      className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors text-left"
                    >
                      <img
                        src={product.images?.[0] || 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=40&h=40&fit=crop'}
                        alt={product.name}
                        className="w-8 h-8 object-cover rounded"
                      />
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {product.price} Dt • {product.brand}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Brand Suggestions */}
              {suggestions.brands?.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2">
                    Marques
                  </h4>
                  <div className="flex flex-wrap gap-2 px-3">
                    {suggestions.brands.slice(0, 6).map((brand) => (
                      <button
                        key={brand}
                        onClick={() => handleSearch(`brand:${brand}`)}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* No Results */}
          {suggestions && query.length >= 2 && !suggestionsLoading && 
           suggestions.products?.length === 0 && suggestions.brands?.length === 0 && (
            <div className="p-4 text-center">
              <p className="text-gray-500">Aucun r\u00e9sultat trouv\u00e9 pour "{query}"</p>
              <button
                onClick={() => handleSearch()}
                className="mt-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                Rechercher quand m\u00eame
              </button>
            </div>
          )}

          {/* Recent Searches & Popular */}
          {(!query || query.length < 2) && (
            <div className="p-2">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between px-3 py-2">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Recherches Récentes
                    </h4>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs text-gray-400 hover:text-gray-600"
                    >
                      Effacer
                    </button>
                  </div>
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(search)}
                      className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors text-left"
                    >
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{search}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Quick Categories */}
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2">
                  Catégories
                </h4>
                {quickCategories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => handleSearch(category.query)}
                    className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors text-left"
                  >
                    {category.icon}
                    <span className="text-sm text-gray-700">{category.name}</span>
                  </button>
                ))}
              </div>

              {/* Popular Searches */}
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Recherches Populaires
                </h4>
                <div className="flex flex-wrap gap-2 px-3 pb-2">
                  {popularSearches.map((search) => (
                    <button
                      key={search}
                      onClick={() => handleSearch(search)}
                      className="px-3 py-1 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded-full text-sm transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SmartSearchBar;
