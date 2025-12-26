import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
  Star, ArrowRight, ShoppingCart, Eye, Heart, 
  Shield, Truck, Phone, Headphones, Zap, 
  CheckCircle, Users, Award, Sparkles, Gift,
  Clock, ChevronLeft, ChevronRight, Play,
  Smartphone, Cpu, Battery, Camera, Wifi
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
  const [currentSlide, setCurrentSlide] = useState(0);
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

  // Fetch slider products - top products with images
  const { data: sliderProducts, isLoading: sliderLoading } = useQuery({
    queryKey: ['slider-products'],
    queryFn: () => api.get('/products?limit=50').then(res => res.data),
    select: (data) => {
      const products = data.products || [];
      
      // Filter products with valid images
      const withImages = products.filter(p => {
        if (!p.images) return false;
        const images = Array.isArray(p.images) ? p.images : 
          (typeof p.images === 'string' ? JSON.parse(p.images || '[]') : []);
        return images.length > 0 && images[0];
      });
      
      // Exclude laptops
      const noLaptops = withImages.filter(p => {
        const name = (p.name || '').toLowerCase();
        const cat = (p.category || '').toLowerCase();
        return !name.includes('laptop') && !name.includes('ordinateur') && !cat.includes('laptop');
      });
      
      // Get diverse brands
      const brandMap = new Map();
      noLaptops.forEach(p => {
        const brand = (p.brand || 'Other').toLowerCase();
        if (!brandMap.has(brand)) {
          brandMap.set(brand, p);
        }
      });
      
      // Take up to 6 products from different brands
      const diverseProducts = Array.from(brandMap.values()).slice(0, 6);
      
      // Fill with more products if needed
      if (diverseProducts.length < 6) {
        const usedIds = new Set(diverseProducts.map(p => p.id));
        for (const p of noLaptops) {
          if (!usedIds.has(p.id) && diverseProducts.length < 6) {
            diverseProducts.push(p);
            usedIds.add(p.id);
          }
        }
      }
      
      return diverseProducts;
    }
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

  // Auto-rotate hero slides
  useEffect(() => {
    if (!sliderProducts || sliderProducts.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderProducts.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [sliderProducts]);

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

  // Modern gradient colors for slides
  const gradients = [
    "from-purple-600 via-pink-500 to-rose-500",
    "from-blue-600 via-cyan-500 to-teal-500",
    "from-indigo-600 via-purple-500 to-pink-500",
    "from-emerald-600 via-green-500 to-teal-500",
    "from-orange-600 via-red-500 to-pink-500",
    "from-cyan-600 via-blue-500 to-indigo-500"
  ];

  // Parse product specs from description or specs field
  const parseProductSpecs = (product) => {
    const specs = [];
    const desc = (product.description || '').toLowerCase();
    const productSpecs = typeof product.specs === 'string' ? JSON.parse(product.specs || '{}') : (product.specs || {});
    
    // Network
    if (desc.includes('5g') || productSpecs.network?.includes('5G')) {
      specs.push({ icon: "wifi", text: "5G" });
    } else if (desc.includes('4g') || desc.includes('lte')) {
      specs.push({ icon: "wifi", text: "4G LTE" });
    }
    
    // Battery
    const batteryMatch = desc.match(/(\d{4,5})\s*mah/i);
    if (batteryMatch) {
      specs.push({ icon: "battery", text: `${batteryMatch[1]}mAh` });
    } else if (productSpecs.battery) {
      specs.push({ icon: "battery", text: productSpecs.battery });
    }
    
    // Camera
    const cameraMatch = desc.match(/(\d+)\s*mp/i);
    if (cameraMatch) {
      specs.push({ icon: "camera", text: `${cameraMatch[1]}MP` });
    } else if (productSpecs.camera) {
      specs.push({ icon: "camera", text: productSpecs.camera });
    }
    
    // Storage/RAM
    const storageMatch = desc.match(/(\d+)\s*go?\s*[+\/]\s*(\d+)\s*go?/i) || desc.match(/(\d+)\s*gb?\s*[+\/]\s*(\d+)\s*gb?/i);
    if (storageMatch) {
      specs.push({ icon: "cpu", text: `${storageMatch[1]}GB + ${storageMatch[2]}GB` });
    } else if (productSpecs.ram && productSpecs.storage) {
      specs.push({ icon: "cpu", text: `${productSpecs.ram} + ${productSpecs.storage}` });
    }
    
    // Default specs if none found
    if (specs.length === 0) {
      specs.push({ icon: "wifi", text: "4G LTE" });
      specs.push({ icon: "battery", text: "Grande autonomie" });
      specs.push({ icon: "camera", text: "Caméra HD" });
      specs.push({ icon: "cpu", text: "Performance" });
    }
    
    // Ensure we have 4 specs
    while (specs.length < 4) {
      const defaults = [
        { icon: "wifi", text: "Connectivité" },
        { icon: "battery", text: "Longue durée" },
        { icon: "camera", text: "Photo HD" },
        { icon: "cpu", text: "Rapide" }
      ];
      specs.push(defaults[specs.length]);
    }
    
    return specs.slice(0, 4);
  };

  // Get valid image URL for slider
  const getSliderImage = (product) => {
    if (!product?.images) return null;
    const images = Array.isArray(product.images) ? product.images : 
      (typeof product.images === 'string' ? JSON.parse(product.images || '[]') : []);
    return images.length > 0 && images[0] ? images[0] : null;
  };

  // Build hero slides from real products
  const heroSlides = sliderProducts?.length > 0 
    ? sliderProducts
        .filter(product => getSliderImage(product) !== null)
        .map((product, index) => ({
          id: product.id,
          title: product.name,
          subtitle: product.description?.substring(0, 80) || `${product.brand} - Disponible maintenant`,
          price: product.price?.toString() || '0',
          image: getSliderImage(product),
          gradient: gradients[index % gradients.length],
          specs: parseProductSpecs(product),
          brand: product.brand,
          category: product.category
        }))
    : [];

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

  const nextSlide = () => {
    if (heroSlides.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }
  };
  
  const prevSlide = () => {
    if (heroSlides.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    }
  };

  // Current slide data
  const currentSlideData = heroSlides[currentSlide] || null;

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
      {/* Hero Section - Ultimate Modern Design */}
      {sliderLoading ? (
        <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-rose-500">
          <div className="text-center text-white">
            <div className="w-20 h-20 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-2xl font-bold">Chargement des produits...</p>
          </div>
        </section>
      ) : heroSlides.length === 0 ? (
        <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          <div className="text-center text-white px-4">
            <Smartphone className="w-24 h-24 mx-auto mb-6 opacity-50" />
            <h2 className="text-4xl font-bold mb-4">Produits bientôt disponibles</h2>
            <p className="text-xl text-white/70">Revenez plus tard pour découvrir nos offres</p>
          </div>
        </section>
      ) : (
      <section className="relative min-h-screen flex items-center py-8 sm:py-0">
        {/* Animated Background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${currentSlideData?.gradient || gradients[0]} transition-all duration-1000`}>
          {/* Animated shapes */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-blob delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl animate-pulse"></div>
          
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-10" 
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }}
          ></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="text-white space-y-4 sm:space-y-6 h-auto lg:h-[800px] flex flex-col justify-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2.5 rounded-full animate-slide-in-left w-fit shadow-lg">
                <Sparkles className="h-4 w-4 text-yellow-300" />
                <span className="text-xs sm:text-sm font-semibold">Nouveau Arrivage</span>
              </div>

              {/* Brand Badge */}
              {currentSlideData?.brand && (
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2 rounded-full animate-slide-in-left w-fit border border-white/20">
                  <span className="text-sm font-bold">{currentSlideData.brand}</span>
                  {currentSlideData.category && (
                    <>
                      <span className="text-white/50">•</span>
                      <span className="text-xs text-white/80">{currentSlideData.category}</span>
                    </>
                  )}
                </div>
              )}

              {/* Title */}
              <div className="space-y-3 sm:space-y-4">
                <div className="min-h-[120px] sm:h-[160px] md:h-[180px] flex items-end pb-2">
                  <h1 key={`title-${currentSlide}`} className="text-3xl sm:text-5xl md:text-7xl font-black leading-tight animate-slide-in-left delay-100 drop-shadow-2xl">
                    {currentSlideData?.title || ''}
                  </h1>
                </div>
                <div className="min-h-[60px] sm:h-[80px] flex items-start">
                  <p key={`subtitle-${currentSlide}`} className="text-base sm:text-xl md:text-2xl text-white/90 font-medium animate-slide-in-left delay-200">
                    {currentSlideData?.subtitle || ''}
                  </p>
                </div>
              </div>

              {/* Price */}
              <div className="animate-slide-in-left delay-300 min-h-[140px] sm:h-[190px] md:h-[120px] flex items-center">
                <div key={`price-${currentSlide}`} className="w-full">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-white/20 blur-xl rounded-3xl"></div>
                    <div className="relative glass-dark px-8 sm:px-10 py-4 sm:py-5 rounded-3xl shadow-2xl border border-white/20">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl sm:text-5xl font-black">{currentSlideData?.price || '0'}</span>
                        <span className="text-xl sm:text-2xl font-bold text-white/80">Dt</span>
                      </div>
                      <p className="text-xs sm:text-sm text-white/60 mt-1">Prix TTC</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Specs - Dynamic per phone */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 animate-slide-in-left delay-500 min-h-[100px] sm:h-[130px]">
                {currentSlideData?.specs?.map((spec, i) => {
                  const icons = {
                    wifi: <Wifi className="h-5 w-5" />,
                    battery: <Battery className="h-5 w-5" />,
                    camera: <Camera className="h-5 w-5" />,
                    cpu: <Cpu className="h-5 w-5" />
                  };
                  return (
                    <div key={`${currentSlide}-spec-${i}`} className="group flex items-center gap-2 sm:gap-3 glass-dark px-4 py-3 rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/10">
                      <div className="p-2 bg-white/10 rounded-lg group-hover:scale-110 transition-transform">{icons[spec.icon]}</div>
                      <span className="text-xs sm:text-sm font-semibold">{spec.text}</span>
                    </div>
                  );
                }) || []}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 animate-slide-in-left delay-700">
                <Link
                  to={currentSlideData?.id ? `/products/${currentSlideData.id}` : '/products'}
                  className="group relative bg-white text-gray-900 px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-black text-base sm:text-lg transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center shadow-2xl active:scale-95 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="relative z-10 group-hover:text-white transition-colors">Acheter Maintenant</span>
                  <ArrowRight className="relative z-10 ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform group-hover:text-white" />
                </Link>
                <Link 
                  to={currentSlideData?.id ? `/products/${currentSlideData.id}` : '/products'}
                  className="glass-dark border border-white/20 px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-bold text-base sm:text-lg hover:bg-white/20 transition-all duration-300 inline-flex items-center justify-center gap-2 shadow-xl active:scale-95"
                >
                  <Eye className="h-5 w-5" />
                  Voir Détails
                </Link>
              </div>
            </div>

            {/* Right Content - Product Display */}
            <div className="relative flex justify-center items-center animate-slide-in-right h-[350px] sm:h-[400px] md:h-[500px] lg:h-[600px] order-first lg:order-last">
              {/* 3D Glowing rings */}
              <div className="absolute w-[300px] h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] rounded-full border-4 border-white/20 animate-spin-slow"></div>
              <div className="absolute w-[250px] h-[250px] md:w-[350px] md:h-[350px] lg:w-[450px] lg:h-[450px] rounded-full border-2 border-white/10 animate-spin-slow-reverse"></div>
              <div className="absolute w-[200px] h-[200px] md:w-[300px] md:h-[300px] lg:w-[400px] lg:h-[400px] rounded-full bg-white/5 blur-2xl animate-pulse"></div>
              
              {/* Product Image */}
              <div className="relative z-10 animate-phone-float">
                <div className="relative h-[280px] sm:h-[320px] md:h-[420px] lg:h-[500px] flex items-center justify-center">
                  <img 
                    key={`img-${currentSlide}`}
                    src={currentSlideData?.image || ''}
                    alt={currentSlideData?.title || 'Product'}
                    loading="eager"
                    decoding="async"
                    className="w-auto h-full object-contain max-w-[220px] sm:max-w-[280px] md:max-w-[350px] lg:max-w-[420px] animate-fade-in"
                    style={{ 
                      filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.5))'
                    }}
                  />
                  {/* Enhanced glow */}
                  <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white/30 via-white/10 to-transparent blur-3xl rounded-full scale-90"></div>
                </div>
                
                {/* Animated badges */}
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-4 py-2 rounded-2xl font-black text-sm animate-bounce shadow-2xl border-2 border-white/50">
                  <span className="flex items-center gap-1">
                    <Sparkles className="h-4 w-4" />
                    NOUVEAU
                  </span>
                </div>
                <div className="absolute -bottom-4 -left-4 glass-dark text-white px-4 py-2 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-2xl border border-white/20 backdrop-blur-xl">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  En Stock
                </div>
                <div className="absolute top-1/2 -right-8 glass-dark text-white px-3 py-2 rounded-xl font-semibold text-xs shadow-xl border border-white/20 backdrop-blur-xl animate-pulse">
                  ⚡ Livraison 24h
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Slide Navigation */}
          <div className="absolute bottom-8 sm:bottom-12 left-1/2 transform -translate-x-1/2 flex items-center gap-4 sm:gap-6">
            <button 
              onClick={prevSlide}
              className="group p-3 sm:p-4 glass-dark border border-white/20 rounded-2xl hover:bg-white/20 transition-all active:scale-95 shadow-2xl backdrop-blur-xl"
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-white group-hover:scale-110 transition-transform" />
            </button>
            
            <div className="flex gap-3 glass-dark px-4 py-3 rounded-2xl border border-white/20 backdrop-blur-xl shadow-2xl">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2.5 rounded-full transition-all duration-500 ${
                    index === currentSlide 
                      ? 'w-10 bg-white shadow-lg' 
                      : 'w-2.5 bg-white/40 hover:bg-white/70 hover:w-6 active:scale-95'
                  }`}
                />
              ))}
            </div>
            
            <button 
              onClick={nextSlide}
              className="group p-3 sm:p-4 glass-dark border border-white/20 rounded-2xl hover:bg-white/20 transition-all active:scale-95 shadow-2xl backdrop-blur-xl"
            >
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-white group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </section>
      )}

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
