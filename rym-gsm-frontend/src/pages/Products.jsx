import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Search, Filter, Grid, List, Heart, ShoppingCart, Eye, Star,
  ChevronDown, Zap, Shield, Phone, Sparkles, SlidersHorizontal,
  Laptop, Watch, Headphones, Camera, ArrowUpDown
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import ProductRating from '../components/ProductRating';
import SmartSearchBar from '../components/SmartSearchBar';
import AdvancedFilters from '../components/AdvancedFilters';
import WishlistButton from '../components/WishlistButton';
import ComparisonButton from '../components/comparison/ComparisonButton';
import api from '../config/api';
import toast from 'react-hot-toast';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(() => {
    const initialFilters = {};

    // Only add filters if they have values
    const search = searchParams.get('search');
    if (search) initialFilters.search = search;

    const category = searchParams.get('category');
    if (category) initialFilters.category = category;

    const minPrice = searchParams.get('minPrice');
    if (minPrice) initialFilters.minPrice = minPrice;

    const maxPrice = searchParams.get('maxPrice');
    if (maxPrice) initialFilters.maxPrice = maxPrice;

    const minRating = searchParams.get('minRating');
    if (minRating) initialFilters.minRating = minRating;

    // Handle array parameters
    const brand = searchParams.get('brand');
    if (brand) initialFilters.brand = brand.split(',');

    const ram = searchParams.get('ram');
    if (ram) initialFilters.ram = ram.split(',');

    const storage = searchParams.get('storage');
    if (storage) initialFilters.storage = storage.split(',');

    return initialFilters;
  });
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const { addToCart } = useCart();

  // Update filters when URL params change
  useEffect(() => {
    const newFilters = {};
    
    const search = searchParams.get('search');
    if (search) newFilters.search = search;
    
    const category = searchParams.get('category');
    if (category) newFilters.category = category;
    
    const minPrice = searchParams.get('minPrice');
    if (minPrice) newFilters.minPrice = minPrice;
    
    const maxPrice = searchParams.get('maxPrice');
    if (maxPrice) newFilters.maxPrice = maxPrice;
    
    const minRating = searchParams.get('minRating');
    if (minRating) newFilters.minRating = minRating;
    
    const brand = searchParams.get('brand');
    if (brand) newFilters.brand = brand.split(',');
    
    const ram = searchParams.get('ram');
    if (ram) newFilters.ram = ram.split(',');
    
    const storage = searchParams.get('storage');
    if (storage) newFilters.storage = storage.split(',');
    
    console.log('URL params changed, new filters:', newFilters);
    setFilters(newFilters);
  }, [searchParams]);

  // Fetch products with filters
  const { data: productsData, isLoading, error } = useQuery({
    queryKey: ['products', filters, sortBy],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== '' && !(Array.isArray(value) && value.length === 0)) {
          if (Array.isArray(value)) {
            // For array parameters, join with commas
            params.append(key, value.join(','));
          } else {
            params.append(key, value.toString());
          }
        }
      });
      params.append('sort', sortBy);
      
      const response = await api.get(`/products?${params.toString()}`);
      return response.data;
    },
    retry: 1
  });

  // Fetch brands for filter
  const { data: brandsData } = useQuery({
    queryKey: ['brands'],
    queryFn: () => api.get('/products/brands/list').then(res => res.data)
  });

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    
    // Update URL params
    const newSearchParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== '' && !(Array.isArray(value) && value.length === 0)) {
        if (Array.isArray(value)) {
          newSearchParams.set(key, value.join(','));
        } else {
          newSearchParams.set(key, value.toString());
        }
      }
    });
    setSearchParams(newSearchParams);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchParams({});
  };


  const handleAddToCart = async (product) => {
    const result = await addToCart(product.id, 1);
    if (result.success) {
      toast.success(`${product.name} ajouté au panier !`);
    } else {
      toast.error(result.message || 'Échec de l\'ajout au panier');
    }
  };

  const products = productsData?.products || [];
  const pagination = productsData?.pagination;

  const categories = [
    { value: 'phone', label: 'Téléphones', icon: <Phone className="h-4 w-4" /> },
    { value: 'laptop', label: 'Ordinateurs', icon: <Laptop className="h-4 w-4" /> },
    { value: 'watch', label: 'Montres', icon: <Watch className="h-4 w-4" /> },
    { value: 'accessory', label: 'Accessoires', icon: <Headphones className="h-4 w-4" /> },
    { value: 'camera', label: 'Appareils Photo', icon: <Camera className="h-4 w-4" /> }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Plus Récents' },
    { value: 'price-low', label: 'Prix: Croissant' },
    { value: 'price-high', label: 'Prix: Décroissant' },
    { value: 'name', label: 'Nom A-Z' },
    { value: 'rating', label: 'Mieux Notés' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50">
      {/* Hero Section with Smart Search */}
      <div className="bg-gradient-to-r from-primary-500 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Trouvez Votre <span className="text-yellow-300">Appareil</span> Idéal
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Recherche avancée avec filtres intelligents et suggestions
            </p>
            <div className="flex justify-center">
              <div className="max-w-2xl w-full">
                <SmartSearchBar 
                  placeholder="Rechercher téléphones, ordinateurs, accessoires..."
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Advanced Filters Sidebar */}
          <div className="lg:w-1/4">
            <AdvancedFilters 
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />
          </div>

          {/* Products Section */}
          <div className="lg:w-3/4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {pagination?.totalProducts || 0} Produits Trouvés
                </h2>
                <p className="text-gray-600">
                  Découvrez des offres incroyables sur les dernières technologies
                </p>
              </div>

              <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                {/* Sort */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white appearance-none pr-10"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ArrowUpDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>

                {/* View Mode */}
                <div className="flex border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-3 transition-all duration-200 ${
                      viewMode === 'grid' 
                        ? 'bg-primary-500 text-white' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Grid className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-3 transition-all duration-200 ${
                      viewMode === 'list' 
                        ? 'bg-primary-500 text-white' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <List className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {error ? (
              <div className="text-center py-16">
                <div className="text-red-400 mb-6">
                  <Search className="h-20 w-20 mx-auto" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Erreur de Chargement des Produits
                </h3>
                <p className="text-gray-600 mb-8">
                  {error.message || 'Une erreur s\'est produite. Veuillez réessayer.'}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="btn-primary"
                >
                  Recharger la Page
                </button>
              </div>
            ) : isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="card p-6 animate-pulse">
                    <div className="bg-gray-300 h-64 rounded-xl mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                    <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-6">
                  <Search className="h-20 w-20 mx-auto" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Aucun produit trouvé
                </h3>
                <p className="text-gray-600 mb-8">
                  Essayez d'ajuster vos filtres ou termes de recherche
                </p>
                <button
                  onClick={clearFilters}
                  className="btn-primary"
                >
                  Effacer Tous les Filtres
                </button>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {products.map((product, index) => (
                  <div
                    key={product.id}
                    className={`group card p-6 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
                      viewMode === 'list' ? 'flex' : ''
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`relative ${viewMode === 'list' ? 'w-1/3 mr-6' : ''}`}>
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className={`w-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500 ${
                          viewMode === 'list' ? 'h-48' : 'h-64'
                        }`}
                      />
                      
                      {/* Badges */}
                      <div className="absolute top-4 left-4">
                        <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Nouveau
                        </span>
                      </div>
                      
                      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                        <WishlistButton 
                          product={product} 
                          size="lg" 
                          variant="floating"
                        />
                        <ComparisonButton 
                          product={product} 
                          variant="floating"
                        />
                      </div>

                      {/* Quick Actions */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center z-10">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors duration-200"
                          >
                            <ShoppingCart className="h-5 w-5" />
                          </button>
                          <Link
                            to={`/products/${product.id}`}
                            className="w-12 h-12 bg-white text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors duration-200"
                          >
                            <Eye className="h-5 w-5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`${viewMode === 'list' ? 'w-2/3' : ''}`}>
                      <div className="mt-4">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-300">
                          {product.name}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {product.description}
                        </p>
                        
                        {viewMode === 'list' && (
                          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                            <div className="flex items-center">
                              <Shield className="h-4 w-4 text-primary-500 mr-2" />
                              <span className="font-medium">Marque:</span> 
                              <span className="ml-1 text-gray-600">{product.brand}</span>
                            </div>
                            <div className="flex items-center">
                              <Zap className="h-4 w-4 text-primary-500 mr-2" />
                              <span className="font-medium">Stock:</span> 
                              <span className="ml-1 text-gray-600">{product.stock}</span>
                            </div>
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 text-primary-500 mr-2" />
                              <span className="font-medium">RAM:</span> 
                              <span className="ml-1 text-gray-600">{product.specs?.ram || 'N/A'}</span>
                            </div>
                            <div className="flex items-center">
                              <Sparkles className="h-4 w-4 text-primary-500 mr-2" />
                              <span className="font-medium">Stockage:</span> 
                              <span className="ml-1 text-gray-600">{product.specs?.storage || 'N/A'}</span>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-3xl font-bold text-primary-600">
                              {product.price} Dt
                            </span>
                            <div className="mt-1">
                              <ProductRating 
                                productId={product.id} 
                                size="sm" 
                                showCount={true}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2 mt-4">
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="flex-1 btn-primary py-3 text-sm"
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Ajouter au Panier
                          </button>
                          <ComparisonButton 
                            product={product} 
                            variant="small"
                          />
                          <Link
                            to={`/products/${product.id}`}
                            className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <div className="flex space-x-2">
                <button
                  disabled={pagination.currentPage === 1}
                  className="px-4 py-2 border border-gray-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200"
                >
                  Précédent
                </button>
                
                {[...Array(pagination.totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    className={`px-4 py-2 rounded-xl transition-all duration-200 ${
                      pagination.currentPage === index + 1
                        ? 'bg-primary-500 text-white'
                        : 'border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                
                <button
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-4 py-2 border border-gray-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200"
                >
                  Suivant
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default Products;