import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
  Star, ArrowRight, ShoppingCart, Eye, Heart, 
  Shield, Truck, Phone, Headphones, Zap, 
  CheckCircle, Users, Award, Sparkles, Gift,
  Clock, Smartphone
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import ProductRating from '../components/ProductRating';
import SEO from '../components/SEO';
import api from '../config/api';
import toast from 'react-hot-toast';
import { 
  generateOrganizationSchema, 
  generateWebSiteSchema,
  generateItemListSchema 
} from '../utils/structuredData';

const Home = () => {
  const [isVisible, setIsVisible] = useState({});
  const { addToCart } = useCart();

  // Enhanced structured data for SEO
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebSiteSchema();

  // Fetch featured products
  const { data: featuredProducts, isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => api.get('/products?limit=8').then(res => res.data),
    select: (data) => data.products
  });

  // Generate ItemList schema for featured products
  const itemListSchema = featuredProducts 
    ? generateItemListSchema(featuredProducts, "Produits en vedette")
    : null;

  // Combine all structured data
  const allStructuredData = [
    organizationSchema,
    websiteSchema,
    ...(itemListSchema ? [itemListSchema] : [])
  ].filter(Boolean);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-animate]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const brands = [
    { name: "Samsung", logo: "🔷" },
    { name: "Xiaomi", logo: "🟠" },
    { name: "OPPO", logo: "🟢" },
    { name: "Infinix", logo: "🔵" },
    { name: "Tecno", logo: "🟣" },
    { name: "Honor", logo: "🔶" },
    { name: "Vivo", logo: "🔹" }
  ];

  const features = [
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: "Smartphones Originaux",
      description: "100% authentiques avec garantie officielle",
      color: "from-pink-500 to-rose-600"
    },
    {
      icon: <Truck className="h-8 w-8" />,
      title: "Livraison Rapide",
      description: "Partout en Tunisie sous 24-48h",
      color: "from-cyan-500 to-teal-600"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Garantie 1 An",
      description: "Service après-vente professionnel",
      color: "from-violet-500 to-purple-600"
    },
    {
      icon: <Gift className="h-8 w-8" />,
      title: "Paiement à la Livraison",
      description: "Payez en cash à la réception",
      color: "from-amber-500 to-orange-600"
    }
  ];

  const stats = [
    { number: "5000+", label: "Clients Satisfaits", icon: <Users className="h-6 w-6" /> },
    { number: "200+", label: "Modèles Disponibles", icon: <Smartphone className="h-6 w-6" /> },
    { number: "100%", label: "Produits Originaux", icon: <Award className="h-6 w-6" /> },
    { number: "24h", label: "Livraison Express", icon: <Truck className="h-6 w-6" /> }
  ];

  const handleAddToCart = async (product) => {
    const result = await addToCart(product.id, 1);
    if (result.success) {
      toast.success(`${product.name} ajouté au panier !`);
    } else {
      toast.error(result.message || 'Échec de l\'ajout au panier');
    }
  };

  return (
    <>
      <SEO 
        title="RYM GSM Nabeul - Téléphones, Smartphones & Accessoires en Tunisie | Meilleur Prix Nabeul"
        description="RYM GSM Nabeul - Boutique spécialisée en téléphones et smartphones en Tunisie. Samsung, iPhone, Xiaomi, OPPO, Honor. Prix compétitifs, livraison rapide partout en Tunisie, garantie officielle. Magasin à Nabeul. Achetez votre smartphone maintenant!"
        keywords="RYM GSM, téléphones Nabeul, smartphones Tunisie, vente téléphone Nabeul, Samsung Tunisie, iPhone Tunisie, Xiaomi Tunisie, OPPO Tunisie, téléphone pas cher Tunisie, accessoires mobile Tunisie, boutique téléphone Nabeul, GSM Nabeul, mobile Tunisie, smartphone prix Tunisie, acheter téléphone Nabeul, magasin téléphone Tunisie, vente smartphone Tunisie"
        url="https://rymgsm.com"
        structuredData={allStructuredData}
      />
      <div className="min-h-screen overflow-hidden">
      {/* Brands Marquee */}
      <section className="py-8 bg-gray-900 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...brands, ...brands, ...brands].map((brand, i) => (
            <div key={i} className="mx-12 flex items-center gap-3 text-white/60 hover:text-white transition-colors cursor-pointer">
              <span className="text-3xl">{brand.logo}</span>
              <span className="text-xl font-semibold">{brand.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white" id="features" data-animate>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-primary-100 text-primary-600 rounded-full text-sm font-semibold mb-4">
              Pourquoi Nous Choisir
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              L'Excellence à Votre <span className="gradient-text">Service</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`group relative p-8 rounded-3xl bg-gradient-to-br ${feature.color} text-white overflow-hidden transform hover:scale-105 transition-all duration-500 hover:shadow-2xl ${isVisible.features ? 'animate-slide-in-up' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-white/80">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary-500 to-pink-500 rounded-2xl mb-4 group-hover:scale-110 transition-transform text-white">
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-gray-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100" id="products" data-animate>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <span className="inline-block px-4 py-2 bg-primary-100 text-primary-600 rounded-full text-sm font-semibold mb-4">
                Nos Produits
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                Produits <span className="gradient-text">Vedettes</span>
              </h2>
            </div>
            <Link 
              to="/products"
              className="mt-4 md:mt-0 inline-flex items-center text-primary-600 font-semibold hover:text-primary-700 group"
            >
              Voir Tout
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-white rounded-3xl p-6 animate-pulse">
                  <div className="bg-gray-200 h-64 rounded-2xl mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts?.slice(0, 8).map((product, index) => (
                <div 
                  key={product.id} 
                  className="group bg-white rounded-3xl p-6 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
                >
                  <div className="relative overflow-hidden rounded-2xl mb-6 bg-gradient-to-br from-gray-50 to-gray-100">
                    <img
                      src={product.images?.[0] || '/placeholder.jpg'}
                      alt={product.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-56 object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Quick actions */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                      <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary-500 hover:text-white transition-colors">
                        <Heart className="h-5 w-5" />
                      </button>
                      <Link 
                        to={`/products/${product.id}`}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary-500 hover:text-white transition-colors"
                      >
                        <Eye className="h-5 w-5" />
                      </Link>
                    </div>

                    {/* Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-gradient-to-r from-primary-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        Vedette
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary-600">
                        {product.price} <span className="text-sm font-normal text-gray-500">Dt</span>
                      </span>
                      <ProductRating productId={product.id} size="sm" />
                    </div>
                    
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-gray-900 hover:bg-primary-600 text-white py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      Ajouter au Panier
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-pink-600 to-purple-600 animate-gradient"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Prêt à Commander ?
          </h2>
          <p className="text-xl md:text-2xl mb-10 text-white/90">
            Livraison gratuite pour les commandes de plus de 500 Dt
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="bg-white text-gray-900 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-2xl inline-flex items-center justify-center group"
            >
              Explorer les Produits
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
            </Link>
            <Link
              to="/contact"
              className="glass px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
            >
              Nous Contacter
            </Link>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default Home;
