import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Search, X, Clock, TrendingUp, Smartphone, Laptop, Headphones, Loader2, SearchCheck } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../config/api';

const MAX_RECENT_SEARCHES = 5;

// Custom debounce function
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const EnhancedSearchBar = ({ className = "", onSearch, placeholder = "Search for phones, accessories..." }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(-1);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('recentSearches');
      if (saved) {
        setRecentSearches(JSON.parse(saved).slice(0, MAX_RECENT_SEARCHES));
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
      localStorage.removeItem('recentSearches');
    }
  }, []);

  // Debounced search function
  const debouncedSearch = useRef(
    debounce((searchQuery, refetchFn) => {
      if (searchQuery.trim().length >= 2) {
        refetchFn();
      }
    }, 300)
  ).current;

  // Fetch search suggestions
  const {
    data: suggestions = { products: [], brands: [], categories: [] },
    isLoading: suggestionsLoading,
    error: suggestionsError,
    refetch,
  } = useQuery({
    queryKey: ['search-suggestions', query],
    queryFn: async () => {
      if (query.length < 2) return { products: [], brands: [], categories: [] };
      try {
        const response = await api.get(`/products/search/suggestions?q=${encodeURIComponent(query)}`);
        console.log('Search suggestions response:', response.data);
        return response.data;
      } catch (error) {
        console.error('Search API error:', error);
        // Return empty results on error instead of showing error message
        return { products: [], brands: [], categories: [] };
      }
    },
    enabled: false, // We'll trigger this manually
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Update search when query changes
  useEffect(() => {
    if (query.trim().length >= 2) {
      debouncedSearch(query, refetch);
    } else {
      setActiveIndex(-1);
    }
  }, [query, refetch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close search when navigating away and clear query
  useEffect(() => {
    setIsOpen(false);
    setQuery('');
    setActiveIndex(-1);
  }, [location.pathname]);

  // Popular searches and categories
  const popularSearches = useMemo(() => [
    'iPhone 15', 'Samsung Galaxy', 'Xiaomi', 'Headphones', 'Charger', 'Case'
  ], []);

  const quickCategories = useMemo(() => [
    { name: 'Phones', icon: <Smartphone className="w-4 h-4" />, category: 'phone' },
    { name: 'Accessories', icon: <Headphones className="w-4 h-4" />, category: 'accessory' }
  ], []);

  // Save search to recent searches
  const saveToRecentSearches = useCallback((searchTerm) => {
    if (!searchTerm.trim()) return;
    
    setRecentSearches(prev => {
      const updated = [
        searchTerm,
        ...prev.filter(item => item.toLowerCase() !== searchTerm.toLowerCase())
      ].slice(0, MAX_RECENT_SEARCHES);
      
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Handle search submission
  const handleSearch = useCallback((searchQuery = query) => {
    const searchTerm = typeof searchQuery === 'string' ? searchQuery.trim() : '';
    if (!searchTerm) return;

    console.log('Searching for:', searchTerm);

    // Parse special search formats (category:phone, brand:Apple, etc.)
    let searchUrl = '/products?';
    
    if (searchTerm.startsWith('category:')) {
      const category = searchTerm.replace('category:', '').trim();
      searchUrl += `category=${encodeURIComponent(category)}`;
      console.log('Category search:', category);
    } else if (searchTerm.startsWith('brand:')) {
      const brand = searchTerm.replace('brand:', '').trim();
      searchUrl += `brand=${encodeURIComponent(brand)}`;
      console.log('Brand search:', brand);
    } else {
      searchUrl += `search=${encodeURIComponent(searchTerm)}`;
      console.log('Text search:', searchTerm);
    }

    saveToRecentSearches(searchTerm);
    console.log('Navigating to:', searchUrl);
    navigate(searchUrl);
    setIsOpen(false);
    setActiveIndex(-1);
    
    // Clear query after navigation
    setTimeout(() => setQuery(''), 100);
    
    if (onSearch) {
      onSearch(searchTerm);
    }
  }, [query, navigate, onSearch, saveToRecentSearches]);

  // Handle category click
  const handleCategoryClick = useCallback((category) => {
    console.log('Category clicked:', category);
    const searchUrl = `/products?category=${encodeURIComponent(category)}`;
    console.log('Navigating to:', searchUrl);
    navigate(searchUrl);
    setIsOpen(false);
    setQuery('');
    setActiveIndex(-1);
    
    if (onSearch) {
      onSearch(category);
    }
  }, [navigate, onSearch]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (!isOpen) return;

    const items = [
      ...(suggestions?.products || []).map(p => ({ type: 'product', ...p })),
      ...(suggestions?.brands || []).map(b => ({ type: 'brand', ...b })),
      ...(suggestions?.categories || []).map(c => ({ type: 'category', ...c })),
      ...(query.length < 2 ? [] : [{ type: 'search', query }])
    ];

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(prev => (prev < items.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < items.length) {
          const item = items[activeIndex];
          handleSearch(item.query || item.name || query);
        } else if (query.trim()) {
          handleSearch();
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
      default:
        break;
    }
  }, [isOpen, suggestions, query, activeIndex, handleSearch]);

  // Clear search
  const clearSearch = useCallback((e) => {
    e?.stopPropagation();
    setQuery('');
    setActiveIndex(-1);
    inputRef.current?.focus();
  }, []);

  // Clear recent searches
  const clearRecentSearches = useCallback((e) => {
    e.stopPropagation();
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  }, []);

  // Check if we should show suggestions
  const showSuggestions = isOpen && (query.length > 0 || recentSearches.length > 0);
  const hasResults = Boolean(
    suggestions?.products?.length || 
    suggestions?.brands?.length || 
    suggestions?.categories?.length
  );

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value.length > 0) {
              setIsOpen(true);
            }
          }}
          onFocus={() => {
            setIsOpen(true);
            setIsFocused(true);
          }}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls="search-suggestions"
          role="combobox"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {showSuggestions && (
        <div 
          className="absolute z-50 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
          id="search-suggestions"
          role="listbox"
        >
          {suggestionsLoading ? (
            <div className="p-4 text-center text-gray-500">
              <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
              <p>Searching...</p>
            </div>
          ) : suggestionsError ? (
            <div className="p-4 text-center text-red-500">
              Failed to load suggestions. Please try again.
            </div>
          ) : query.length < 2 ? (
            <div className="p-4">
              {recentSearches.length > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2 px-2">
                    <h3 className="text-sm font-medium text-gray-500">Recent Searches</h3>
                    <button 
                      onClick={clearRecentSearches}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Clear all
                    </button>
                  </div>
                  <ul>
                    {recentSearches.map((search, index) => (
                      <li key={index}>
                        <button
                          onClick={() => handleSearch(search)}
                          className={`w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center ${activeIndex === index ? 'bg-gray-50' : ''}`}
                        >
                          <Clock className="h-4 w-4 text-gray-400 mr-2" />
                          <span>{search}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2 px-2">Popular Searches</h3>
                <div className="flex flex-wrap gap-2 px-2">
                  {popularSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(search)}
                      className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2 px-2">Shop by Category</h3>
                <div className="space-y-1">
                  {quickCategories.map((cat, index) => (
                    <button
                      key={cat.name}
                      onClick={() => handleCategoryClick(cat.category)}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center ${activeIndex === index + recentSearches.length ? 'bg-gray-50' : ''}`}
                    >
                      <span className="text-blue-600 mr-2">{cat.icon}</span>
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : hasResults ? (
            <div>
              {suggestions.products.length > 0 && (
                <div className="border-b border-gray-100">
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-2 bg-gray-50">Products</h3>
                  <ul>
                    {suggestions.products.map((product, index) => (
                      <li key={product.id}>
                        <button
                          onClick={() => handleSearch(product.name)}
                          className={`w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center ${activeIndex === index ? 'bg-gray-50' : ''}`}
                        >
                          <SearchCheck className="h-4 w-4 text-gray-400 mr-2" />
                          <span>{product.name}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {suggestions.brands.length > 0 && (
                <div className="border-b border-gray-100">
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-2 bg-gray-50">Brands</h3>
                  <div className="flex flex-wrap p-2">
                    {suggestions.brands.map((brand, index) => (
                      <button
                        key={brand.id}
                        onClick={() => handleSearch(`brand:${brand.name}`)}
                        className={`text-sm px-3 py-1 m-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 ${activeIndex === index + suggestions.products.length ? 'bg-gray-200' : ''}`}
                      >
                        {brand.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {suggestions.categories.length > 0 && (
                <div>
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-2 bg-gray-50">Categories</h3>
                  <div className="p-2">
                    {suggestions.categories.map((category, index) => {
                      const offset = suggestions.products.length + suggestions.brands.length;
                      return (
                        <button
                          key={category.id}
                          onClick={() => handleSearch(`category:${category.slug}`)}
                          className={`w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center ${activeIndex === offset + index ? 'bg-gray-50' : ''}`}
                        >
                          <span className="text-blue-600 mr-2">
                            {category.name === 'Phones' ? (
                              <Smartphone className="h-4 w-4" />
                            ) : category.name === 'Laptops' ? (
                              <Laptop className="h-4 w-4" />
                            ) : (
                              <Headphones className="h-4 w-4" />
                            )}
                          </span>
                          <span>{category.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              
              <div className="border-t border-gray-100 p-2 bg-gray-50">
                <button
                  onClick={() => handleSearch(query)}
                  className="w-full text-left px-4 py-2 text-blue-600 hover:bg-gray-100 rounded flex items-center justify-between"
                >
                  <span>Search for "{query}"</span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Enter</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No results found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default React.memo(EnhancedSearchBar);
