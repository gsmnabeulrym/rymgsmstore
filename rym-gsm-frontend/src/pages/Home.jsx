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

  // Fetch slider products (newest/featured phones)
  const { data: sliderProducts } = useQuery({
    queryKey: ['slider-products'],
    queryFn: () => api.get('/products?limit=10').then(res => res.data),
    select: (data) => {
      // Filter to get only phones (not accessories) and with valid images
      const phones = data.products?.filter(p => {
        const isPhone = p.category !== 'accessory' && p.category !== 'accessories';
        const hasValidImage = p.images && Array.isArray(p.images) && p.images.length > 0 && 
          typeof p.images[0] === 'string' && !p.images[0].startsWith('data:');
        return isPhone || hasValidImage;
      }) || [];
      return phones.slice(0, 5);
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
    const slidesCount = sliderProducts?.length || 1;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slidesCount);
    }, 5000);
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

  // Gradient colors for slides
  const gradients = [
    "from-pink-600 via-rose-500 to-orange-400",
    "from-cyan-600 via-teal-500 to-emerald-400",
    "from-violet-600 via-purple-500 to-indigo-400",
    "from-blue-600 via-indigo-500 to-purple-400",
    "from-emerald-600 via-teal-500 to-cyan-400"
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
    if (!product.images) return '/images/phones/rymgsmlogo.png';
    const images = Array.isArray(product.images) ? product.images : 
      (typeof product.images === 'string' ? JSON.parse(product.images || '[]') : []);
    if (images.length > 0 && images[0] && !images[0].startsWith('data:')) {
      return images[0];
    }
    return '/images/phones/rymgsmlogo.png';
  };

  // Build hero slides from real products
  const heroSlides = sliderProducts?.length > 0 
    ? sliderProducts.map((product, index) => ({
        id: product.id,
        title: product.name,
        subtitle: product.description?.substring(0, 60) + '...' || `${product.brand} - Disponible chez RYM GSM`,
        price: product.price?.toString() || '0',
        image: getSliderImage(product),
        gradient: gradients[index % gradients.length],
        specs: parseProductSpecs(product),
        brand: product.brand
      }))
    : [
        {
          id: 0,
          title: "Découvrez nos Smartphones",
          subtitle: "Les meilleures marques aux meilleurs prix",
          price: "À partir de 299",
          image: "/images/phones/rymgsmlogo.png",
          gradient: "from-primary-600 via-indigo-500 to-purple-400",
          specs: [
            { icon: "wifi", text: "4G/5G" },
            { icon: "battery", text: "Grande autonomie" },
            { icon: "camera", text: "Caméras HD" },
            { icon: "cpu", text: "Performance" }
          ]
        }
      ];

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

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % (heroSlides?.length || 1));
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + (heroSlides?.length || 1)) % (heroSlides?.length || 1));

  // Current slide data with safety check
  const currentSlideData = heroSlides[currentSlide] || heroSlides[0];

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
      {/* Hero Section - Modern Split Design */}
      <section className="relative min-h-screen flex items-center py-8 sm:py-0">
        {/* Animated Background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${currentSlideData.gradient} transition-all duration-1000`}>
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

              {/* Title */}
              <div className="space-y-3 sm:space-y-4">
                <div className="min-h-[120px] sm:h-[160px] md:h-[180px] flex items-end pb-2">
                  <h1 key={`title-${currentSlide}`} className="text-3xl sm:text-5xl md:text-7xl font-black leading-tight animate-slide-in-left delay-100">
                    {currentSlideData.title}
                  </h1>
                </div>
                <div className="min-h-[60px] sm:h-[80px] flex items-start">
                  <p key={`subtitle-${currentSlide}`} className="text-base sm:text-xl md:text-2xl text-white/90 font-medium animate-slide-in-left delay-200">
                    {currentSlideData.subtitle}
                  </p>
                </div>
              </div>

              {/* Price */}
              <div className="animate-slide-in-left delay-300 min-h-[140px] sm:h-[190px] md:h-[120px] flex items-center">
                <div key={`price-${currentSlide}`} className="w-full">
                  <div className="glass inline-block px-6 sm:px-8 py-3 sm:py-4 rounded-2xl shadow-lg">
                    <span className="text-3xl sm:text-4xl font-bold">{currentSlideData.price} <span className="text-lg sm:text-xl">Dt</span></span>
                  </div>
                </div>
              </div>

              {/* Features - Dynamic per phone */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 animate-slide-in-left delay-500 min-h-[100px] sm:h-[130px]">
                {currentSlideData.specs.map((spec, i) => {
                  const icons = {
                    wifi: <Wifi className="h-5 w-5" />,
                    battery: <Battery className="h-5 w-5" />,
                    camera: <Camera className="h-5 w-5" />,
                    cpu: <Cpu className="h-5 w-5" />
                  };
                  return (
                    <div key={`${currentSlide}-spec-${i}`} className="flex items-center gap-2 sm:gap-3 text-white/90">
                      <div className="p-1.5 sm:p-2 bg-white/10 rounded-lg shadow-md">{icons[spec.icon]}</div>
                      <span className="text-xs sm:text-sm font-medium">{spec.text}</span>
                    </div>
                  );
                })}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 animate-slide-in-left delay-700">
                <Link
                  to={currentSlideData.id ? `/products/${currentSlideData.id}` : '/products'}
                  className="group bg-white text-gray-900 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl font-bold text-base sm:text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl inline-flex items-center justify-center shadow-lg active:scale-95"
                >
                  Acheter Maintenant
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                </Link>
                <Link 
                  to={currentSlideData.id ? `/products/${currentSlideData.id}` : '/products'}
                  className="glass px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl font-bold text-base sm:text-lg hover:bg-white/20 transition-all duration-300 inline-flex items-center justify-center gap-2 shadow-lg active:scale-95"
                >
                  <Eye className="h-5 w-5" />
                  Voir Détails
                </Link>
              </div>
            </div>

            {/* Right Content - Phone Display */}
            <div className="relative flex justify-center items-center animate-slide-in-right h-[350px] sm:h-[400px] md:h-[500px] order-first lg:order-last">
              {/* Glowing ring */}
              <div className="absolute w-80 h-80 md:w-96 md:h-96 rounded-full border-4 border-white/20 animate-pulse"></div>
              <div className="absolute w-72 h-72 md:w-80 md:h-80 rounded-full border-2 border-white/10 animate-pulse delay-500"></div>
              
              {/* Phone Image */}
              <div className="relative z-10 animate-phone-float">
                <div className="relative h-[280px] sm:h-[300px] md:h-[400px] flex items-center justify-center">
                  <img 
                    src={currentSlideData.image}
                    alt={currentSlideData.title}
                    loading="eager"
                    decoding="async"
                    className="w-auto h-full object-contain max-w-[220px] sm:max-w-[280px] md:max-w-[350px]"
                    style={{ 
                      filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.4))'
                    }}
                  />
                  {/* White glow behind phone */}
                  <div className="absolute inset-0 -z-10 bg-white/20 blur-3xl rounded-full scale-75"></div>
                </div>
                
                {/* Floating badges */}
                <div className="absolute -top-2 sm:-top-4 -right-2 sm:-right-4 bg-yellow-400 text-gray-900 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-bold text-xs sm:text-sm animate-bounce shadow-lg">
                  🔥 HOT
                </div>
                <div className="absolute -bottom-2 sm:-bottom-4 -left-2 sm:-left-4 glass-dark text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 shadow-lg">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" />
                  En Stock
                </div>
              </div>
            </div>
          </div>

          {/* Slide Navigation */}
          <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-3 sm:gap-4">
            <button 
              onClick={prevSlide}
              className="p-2.5 sm:p-3 glass rounded-full hover:bg-white/20 transition-all active:scale-95 shadow-lg"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </button>
            
            <div className="flex gap-2">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 shadow-md ${
                    index === currentSlide 
                      ? 'w-8 bg-white' 
                      : 'w-2 bg-white/50 hover:bg-white/75 active:scale-95'
                  }`}
                />
              ))}
            </div>
            
            <button 
              onClick={nextSlide}
              className="p-2.5 sm:p-3 glass rounded-full hover:bg-white/20 transition-all active:scale-95 shadow-lg"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </button>
          </div>
        </div>
      </section>

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
