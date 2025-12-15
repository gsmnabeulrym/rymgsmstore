import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Search, Filter, Grid, List, Heart, ShoppingCart, Eye, Star,
  ChevronDown, Zap, Shield, Phone, Sparkles, SlidersHorizontal,
  Laptop, Watch, Headphones, Camera, ArrowUpDown, X, Check,
  Smartphone, Speaker, Battery, Cpu, ChevronLeft, ChevronRight,
  BatteryCharging, ShieldCheck, Tablet
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import ProductRating from '../components/ProductRating';
import SmartSearchBar from '../components/SmartSearchBar';
import AdvancedFilters from '../components/AdvancedFilters';
import WishlistButton from '../components/WishlistButton';
import ComparisonButton from '../components/comparison/ComparisonButton';
import SEO from '../components/SEO';
import api from '../config/api';
import toast from 'react-hot-toast';
import { generateItemListSchema, generateBreadcrumbSchema } from '../utils/structuredData';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(() => {
    const initialFilters = {};
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
  const [currentPage, setCurrentPage] = useState(1);
  const { addToCart } = useCart();

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
    setFilters(newFilters);
  }, [searchParams]);

  const { data: productsData, isLoading, error } = useQuery({
    queryKey: ['products', filters, sortBy, currentPage],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== '' && !(Array.isArray(value) && value.length === 0)) {
          if (Array.isArray(value)) {
            params.append(key, value.join(','));
          } else {
            params.append(key, value.toString());
          }
        }
      });
      params.append('sort', sortBy);
      params.append('page', currentPage.toString());
      const response = await api.get(`/products?${params.toString()}`);
      return response.data;
    },
    retry: 1
  });

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
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
    setCurrentPage(1);
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
    { value: '', label: 'Tous', icon: <Sparkles className="h-5 w-5" /> },
    { value: 'phone', label: 'Téléphones', icon: <Smartphone className="h-5 w-5" /> },
    { value: 'laptop', label: 'Ordinateurs', icon: <Laptop className="h-5 w-5" /> },
    { value: 'tablet', label: 'Tablettes', icon: <Tablet className="h-5 w-5" /> },
    { value: 'watch', label: 'Montres', icon: <Watch className="h-5 w-5" /> },
    { value: 'accessory', label: 'Accessoires', icon: <Headphones className="h-5 w-5" /> },
    { value: 'speaker', label: 'Enceintes', icon: <Speaker className="h-5 w-5" /> },
    { value: 'earphone', label: 'Écouteurs', icon: <Headphones className="h-5 w-5" /> },
    { value: 'charger', label: 'Chargeurs', icon: <BatteryCharging className="h-5 w-5" /> },
    { value: 'case', label: 'Coques', icon: <ShieldCheck className="h-5 w-5" /> },
    { value: 'powerbank', label: 'Powerbank', icon: <Battery className="h-5 w-5" /> }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Plus Récents' },
    { value: 'price-low', label: 'Prix: Croissant' },
    { value: 'price-high', label: 'Prix: Décroissant' },
    { value: 'name', label: 'Nom A-Z' },
    { value: 'rating', label: 'Mieux Notés' }
  ];

  const activeFiltersCount = Object.keys(filters).filter(k => 
    filters[k] && (Array.isArray(filters[k]) ? filters[k].length > 0 : true)
  ).length;

  // Generate SEO metadata based on current filters
  const categoryName = categories.find(c => c.value === filters.category)?.label || '';
  const brandName = Array.isArray(filters.brand) ? filters.brand.join(', ') : filters.brand || '';
  
  const pageTitle = categoryName || brandName || searchParams.get('search')
    ? `${categoryName || brandName || searchParams.get('search')} - Produits | RYM GSM Nabeul`
    : "Tous les Produits - Smartphones & Accessoires | RYM GSM Nabeul";
  
  const pageDescription = categoryName || brandName || searchParams.get('search')
    ? `Découvrez notre sélection de ${categoryName || brandName || searchParams.get('search')} chez RYM GSM Nabeul. Prix compétitifs, livraison rapide en Tunisie, garantie officielle.`
    : "Découvrez notre large sélection de smartphones, téléphones et accessoires en Tunisie. Samsung, iPhone, Xiaomi, OPPO, Honor. Meilleurs prix, livraison rapide, garantie officielle.";
  
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Accueil", url: "https://rymgsm.com" },
    { name: "Produits", url: "https://rymgsm.com/products" }
  ]);
  
  const itemListSchema = products.length > 0 
    ? generateItemListSchema(products, categoryName || "Produits")
    : null;
  
  const structuredData = [breadcrumbSchema, itemListSchema].filter(Boolean);

  return (
    <>
      <SEO 
        title={pageTitle}
        description={pageDescription}
        keywords={`produits RYM GSM, smartphones Tunisie, téléphones Tunisie, ${categoryName || ''}, ${brandName || ''}, boutique mobile Tunisie, vente smartphone Nabeul, prix téléphone Tunisie`}
        url={`https://rymgsm.com/products${searchParams.toString() ? '?' + searchParams.toString() : ''}`}
        structuredData={structuredData}
      />
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          <div className="absolute inset-0 opacity-30" 
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }}
          ></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 animate-slide-in-up">
              Nos <span className="bg-gradient-to-r from-primary-400 to-pink-400 bg-clip-text text-transparent">Produits</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto animate-slide-in-up delay-100">
              Découvrez notre collection de smartphones et accessoires de qualité
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto animate-slide-in-up delay-200">
            <SmartSearchBar 
              placeholder="Rechercher un produit..."
              className="w-full"
            />
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap justify-center gap-3 mt-8 animate-slide-in-up delay-300">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleFiltersChange({ ...filters, category: cat.value || undefined })}
                className={`flex items-center gap-2 px-5 py-3 rounded-full font-medium transition-all duration-300 ${
                  (filters.category || '') === cat.value
                    ? 'bg-white text-gray-900 shadow-lg scale-105'
                    : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'
                }`}
              >
                {cat.icon}
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                showFilters 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <SlidersHorizontal className="h-5 w-5" />
              Filtres
              {activeFiltersCount > 0 && (
                <span className="bg-white text-primary-600 text-xs font-bold px-2 py-0.5 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </button>
            
            <div className="text-gray-600">
              <span className="font-bold text-gray-900">{pagination?.totalProducts || 0}</span> produits
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-gray-100 border-0 rounded-xl px-4 py-2.5 pr-10 font-medium text-gray-700 focus:ring-2 focus:ring-primary-500 transition-all cursor-pointer"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>

            {/* View Toggle */}
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-white shadow text-primary-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-white shadow text-primary-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className={`transition-all duration-300 ${showFilters ? 'w-80 opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Filtres</h3>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Réinitialiser
                  </button>
                )}
              </div>
              <AdvancedFilters 
                filters={filters}
                onFiltersChange={handleFiltersChange}
              />
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {error ? (
              <div className="text-center py-20 bg-white rounded-2xl">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <X className="h-10 w-10 text-red-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Erreur de chargement</h3>
                <p className="text-gray-600 mb-6">Une erreur s'est produite lors du chargement des produits.</p>
                <button onClick={() => window.location.reload()} className="btn-primary">
                  Réessayer
                </button>
              </div>
            ) : isLoading ? (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl p-5 animate-pulse">
                    <div className="bg-gray-200 h-56 rounded-xl mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4 w-1/2"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Aucun produit trouvé</h3>
                <p className="text-gray-600 mb-6">Essayez d'ajuster vos filtres ou termes de recherche</p>
                <button onClick={clearFilters} className="btn-primary">
                  Effacer les filtres
                </button>
              </div>
            ) : (
              <>
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {products.map((product, index) => (
                    <div
                      key={product.id}
                      className={`group bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 ${
                        viewMode === 'list' ? 'flex' : ''
                      }`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {/* Image Container */}
                      <div className={`relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 ${
                        viewMode === 'list' ? 'w-64 flex-shrink-0' : ''
                      }`}>
                        <Link to={`/products/${product.id}`}>
                          <img
                            src={product.images?.[0] || '/placeholder.jpg'}
                            alt={product.name}
                            className={`w-full object-contain p-4 group-hover:scale-110 transition-transform duration-500 ${
                              viewMode === 'list' ? 'h-48' : 'h-56'
                            }`}
                          />
                        </Link>
                        
                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                          {product.stock < 5 && product.stock > 0 && (
                            <span className="bg-amber-500 text-white px-2.5 py-1 rounded-lg text-xs font-bold">
                              Stock Limité
                            </span>
                          )}
                          {product.stock === 0 && (
                            <span className="bg-red-500 text-white px-2.5 py-1 rounded-lg text-xs font-bold">
                              Rupture
                            </span>
                          )}
                        </div>

                        {/* Quick Actions */}
                        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                          <WishlistButton product={product} size="md" variant="floating" />
                          <ComparisonButton product={product} variant="floating" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className={`p-5 flex flex-col ${viewMode === 'list' ? 'flex-1' : ''}`}>
                        <div className="flex-1">
                          <p className="text-sm text-primary-600 font-semibold mb-1">{product.brand}</p>
                          <Link to={`/products/${product.id}`}>
                            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                              {product.name}
                            </h3>
                          </Link>
                          
                          {viewMode === 'list' && (
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                          )}

                          {/* Specs Preview */}
                          {viewMode === 'list' && product.specs && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {product.specs.ram && (
                                <span className="inline-flex items-center gap-1 bg-gray-100 px-2.5 py-1 rounded-lg text-xs font-medium text-gray-700">
                                  <Cpu className="h-3 w-3" /> {product.specs.ram}
                                </span>
                              )}
                              {product.specs.storage && (
                                <span className="inline-flex items-center gap-1 bg-gray-100 px-2.5 py-1 rounded-lg text-xs font-medium text-gray-700">
                                  <Battery className="h-3 w-3" /> {product.specs.storage}
                                </span>
                              )}
                            </div>
                          )}

                          <div className="flex items-center gap-2 mb-3">
                            <ProductRating productId={product.id} size="sm" />
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <div>
                            <span className="text-2xl font-bold text-gray-900">{product.price}</span>
                            <span className="text-gray-500 ml-1">Dt</span>
                          </div>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleAddToCart(product)}
                              disabled={product.stock === 0}
                              className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/25"
                            >
                              <ShoppingCart className="h-4 w-4" />
                              <span className="hidden sm:inline">Ajouter</span>
                            </button>
                            <Link
                              to={`/products/${product.id}`}
                              className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                            >
                              <Eye className="h-5 w-5 text-gray-600" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2.5 bg-white rounded-xl border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    
                    {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 rounded-xl font-semibold transition-all duration-200 ${
                            currentPage === pageNum
                              ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
                      disabled={currentPage === pagination.totalPages}
                      className="p-2.5 bg-white rounded-xl border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Products;
