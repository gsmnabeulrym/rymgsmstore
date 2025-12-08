import React, { useState, useEffect } from 'react';
import { 
  Filter, X, ChevronDown, ChevronUp, Smartphone, Laptop, 
  Headphones, Camera, Watch, Sliders, Check, Star
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../config/api';

const AdvancedFilters = ({ filters, onFiltersChange, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    brand: true,
    specs: false,
    rating: false
  });

  // Fetch filter options from backend
  const { data: filterOptions } = useQuery({
    queryKey: ['filter-options'],
    queryFn: async () => {
      const response = await api.get('/products/filters/options');
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const categories = [
    { id: 'phone', name: 'T\u00e9l\u00e9phones', icon: <Smartphone className="w-4 h-4" />, count: filterOptions?.counts?.phone || 0 },
    { id: 'laptop', name: 'Ordinateurs', icon: <Laptop className="w-4 h-4" />, count: filterOptions?.counts?.laptop || 0 },
    { id: 'watch', name: 'Montres', icon: <Watch className="w-4 h-4" />, count: filterOptions?.counts?.watch || 0 },
    { id: 'accessory', name: 'Accessoires', icon: <Headphones className="w-4 h-4" />, count: filterOptions?.counts?.accessory || 0 },
    { id: 'camera', name: 'Appareils Photo', icon: <Camera className="w-4 h-4" />, count: filterOptions?.counts?.camera || 0 }
  ];

  const ramOptions = ['4GB', '6GB', '8GB', '12GB', '16GB', '32GB'];
  const storageOptions = ['64GB', '128GB', '256GB', '512GB', '1TB', '2TB'];
  const priceRanges = [
    { id: 'under-500', label: 'Moins de 500 Dt', min: 0, max: 500 },
    { id: '500-1000', label: '500 - 1000 Dt', min: 500, max: 1000 },
    { id: '1000-2000', label: '1000 - 2000 Dt', min: 1000, max: 2000 },
    { id: '2000-3000', label: '2000 - 3000 Dt', min: 2000, max: 3000 },
    { id: 'over-3000', label: 'Plus de 3000 Dt', min: 3000, max: 999999 }
  ];

  // Handle filter changes
  const handleFilterChange = (key, value, checked = null) => {
    const newFilters = { ...filters };

    if (key === 'category') {
      newFilters.category = newFilters.category === value ? '' : value;
    } else if (key === 'priceRange') {
      if (newFilters.priceRange === value) {
        delete newFilters.priceRange;
        delete newFilters.minPrice;
        delete newFilters.maxPrice;
      } else {
        const range = priceRanges.find(r => r.id === value);
        newFilters.priceRange = value;
        newFilters.minPrice = range.min;
        newFilters.maxPrice = range.max;
      }
    } else if (key === 'customPrice') {
      newFilters.minPrice = value.min;
      newFilters.maxPrice = value.max;
      delete newFilters.priceRange;
    } else if (key === 'brand' || key === 'ram' || key === 'storage') {
      if (!newFilters[key]) newFilters[key] = [];
      
      if (checked) {
        if (!newFilters[key].includes(value)) {
          newFilters[key] = [...newFilters[key], value];
        }
      } else {
        newFilters[key] = newFilters[key].filter(item => item !== value);
        if (newFilters[key].length === 0) delete newFilters[key];
      }
    } else if (key === 'rating') {
      newFilters.minRating = newFilters.minRating === value ? undefined : value;
    } else {
      newFilters[key] = value;
    }

    onFiltersChange(newFilters);
  };

  // Clear all filters
  const clearAllFilters = () => {
    onFiltersChange({});
  };

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Count active filters
  const activeFiltersCount = Object.keys(filters).filter(key => 
    filters[key] && filters[key] !== '' && 
    !(Array.isArray(filters[key]) && filters[key].length === 0)
  ).length;

  const FilterSection = ({ title, sectionKey, children, defaultExpanded = true }) => {
    const isExpanded = expandedSections[sectionKey] ?? defaultExpanded;
    
    return (
      <div className="border-b border-gray-200 last:border-b-0">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="w-full flex items-center justify-between py-4 px-1 text-left hover:bg-gray-50 transition-colors"
        >
          <h3 className="font-semibold text-gray-900">{title}</h3>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>
        {isExpanded && (
          <div className="pb-4 px-1">
            {children}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={className}>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 shadow-sm"
        >
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-primary-500" />
            <span className="font-medium text-gray-900">Filtres</span>
            {activeFiltersCount > 0 && (
              <span className="bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </div>
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {/* Filter Panel */}
      <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${
        isOpen || window.innerWidth >= 1024 ? 'block' : 'hidden lg:block'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-primary-500" />
            <h2 className="font-bold text-gray-900">Filtres</h2>
            {activeFiltersCount > 0 && (
              <span className="bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </div>
          {activeFiltersCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Tout Effacer
            </button>
          )}
        </div>

        <div className="p-4 space-y-0">
          {/* Catégories */}
          <FilterSection title="Catégories" sectionKey="category">
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleFilterChange('category', category.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                    filters.category === category.id
                      ? 'bg-primary-50 border-2 border-primary-200 text-primary-700'
                      : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {category.icon}
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <span className="text-sm text-gray-500">({category.count})</span>
                </button>
              ))}
            </div>
          </FilterSection>

          {/* Price Range */}
          <FilterSection title="Gamme de Prix" sectionKey="price">
            <div className="space-y-3">
              {/* Predefined Ranges */}
              <div className="space-y-2">
                {priceRanges.map((range) => (
                  <label
                    key={range.id}
                    className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg"
                  >
                    <input
                      type="radio"
                      name="priceRange"
                      checked={filters.priceRange === range.id}
                      onChange={() => handleFilterChange('priceRange', range.id)}
                      className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">{range.label}</span>
                  </label>
                ))}
              </div>

              {/* Custom Range */}
              <div className="pt-3 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-2">Plage Personnalis\u00e9e</p>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice || ''}
                    onChange={(e) => handleFilterChange('customPrice', {
                      min: parseInt(e.target.value) || 0,
                      max: filters.maxPrice || 999999
                    })}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <span className="flex items-center text-gray-500">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice || ''}
                    onChange={(e) => handleFilterChange('customPrice', {
                      min: filters.minPrice || 0,
                      max: parseInt(e.target.value) || 999999
                    })}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </div>
          </FilterSection>

          {/* Brands */}
          <FilterSection title="Marques" sectionKey="brand">
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {(filterOptions?.brands || ['Apple', 'Samsung', 'Xiaomi', 'Huawei', 'OnePlus', 'Google']).map((brand) => (
                <label
                  key={brand}
                  className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg"
                >
                  <input
                    type="checkbox"
                    checked={filters.brand?.includes(brand) || false}
                    onChange={(e) => handleFilterChange('brand', brand, e.target.checked)}
                    className="w-4 h-4 text-primary-600 focus:ring-primary-500 rounded"
                  />
                  <span className="text-sm text-gray-700">{brand}</span>
                  <span className="text-xs text-gray-500 ml-auto">
                    ({filterOptions?.brandCounts?.[brand] || 0})
                  </span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Specifications */}
          <FilterSection title="Sp\u00e9cifications" sectionKey="specs">
            {/* RAM */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">RAM</h4>
              <div className="flex flex-wrap gap-2">
                {ramOptions.map((ram) => (
                  <button
                    key={ram}
                    onClick={() => handleFilterChange('ram', ram, !filters.ram?.includes(ram))}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      filters.ram?.includes(ram)
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {ram}
                  </button>
                ))}
              </div>
            </div>

            {/* Storage */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Stockage</h4>
              <div className="flex flex-wrap gap-2">
                {storageOptions.map((storage) => (
                  <button
                    key={storage}
                    onClick={() => handleFilterChange('storage', storage, !filters.storage?.includes(storage))}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      filters.storage?.includes(storage)
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {storage}
                  </button>
                ))}
              </div>
            </div>
          </FilterSection>

          {/* Rating */}
          <FilterSection title="Avis Clients" sectionKey="rating">
            <div className="space-y-2">
              {[4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleFilterChange('rating', rating)}
                  className={`w-full flex items-center space-x-2 p-2 rounded-lg transition-colors ${
                    filters.minRating === rating
                      ? 'bg-primary-50 text-primary-700'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-700">et plus</span>
                </button>
              ))}
            </div>
          </FilterSection>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilters;
