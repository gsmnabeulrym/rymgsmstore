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

  // Fetch premium slider products
  const { data: sliderProducts, isLoading: sliderLoading } = useQuery({
    queryKey: ['premium-slider-products'],
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
      
      // Get diverse brands for premium showcase
      const brandMap = new Map();
      noLaptops.forEach(p => {
        const brand = (p.brand || 'Other').toLowerCase();
        if (!brandMap.has(brand)) {
          brandMap.set(brand, p);
        }
      });
      
      // Take up to 5 products from different brands
      const diverseProducts = Array.from(brandMap.values()).slice(0, 5);
      
      // Fill with more products if needed
      if (diverseProducts.length < 5) {
        const usedIds = new Set(diverseProducts.map(p => p.id));
        for (const p of noLaptops) {
          if (!usedIds.has(p.id) && diverseProducts.length < 5) {
            diverseProducts.push(p);
            usedIds.add(p.id);
          }
        }
      }
      
      return diverseProducts;
    }
  });

  // Slider state for premium experience
  const [isPaused, setIsPaused] = useState(false);

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

  // Premium auto-rotate with pause functionality
  useEffect(() => {
    if (!sliderProducts || sliderProducts.length === 0 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderProducts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [sliderProducts, isPaused]);

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

  // Premium cinematic gradients
  const premiumGradients = [
    { bg: "from-[#0A0E27] via-[#1a1f3a] to-[#0f1629]", accent: "from-[#00D4FF] to-[#7B2FF7]" },
    { bg: "from-[#0f0c29] via-[#302b63] to-[#24243e]", accent: "from-[#FF6B9D] to-[#FEC163]" },
    { bg: "from-[#0f2027] via-[#203a43] to-[#2c5364]", accent: "from-[#00F5FF] to-[#00D4FF]" },
    { bg: "from-[#1e1e2e] via-[#2d1b69] to-[#1e1e2e]", accent: "from-[#A855F7] to-[#EC4899]" },
    { bg: "from-[#141e30] via-[#243b55] to-[#141e30]", accent: "from-[#06B6D4] to-[#3B82F6]" }
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

  // Get valid image URL for premium slider
  const getPremiumSliderImage = (product) => {
    if (!product?.images) return null;
    const images = Array.isArray(product.images) ? product.images : 
      (typeof product.images === 'string' ? JSON.parse(product.images || '[]') : []);
    return images.length > 0 && images[0] ? images[0] : null;
  };

  // Build premium hero slides
  const heroSlides = sliderProducts?.length > 0 
    ? sliderProducts
        .filter(product => getPremiumSliderImage(product) !== null)
        .map((product, index) => ({
          id: product.id,
          title: product.name,
          tagline: product.description?.substring(0, 100) || `Découvrez le ${product.brand} - Innovation et Performance`,
          price: product.price?.toString() || '0',
          image: getPremiumSliderImage(product),
          gradient: premiumGradients[index % premiumGradients.length],
          specs: parseProductSpecs(product),
          brand: product.brand,
          category: product.category,
          discount: product.discount || null
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
      {/* LEGENDARY HERO SLIDER - Revolutionary Design */}
      {sliderLoading ? (
        <section className="hero-legendary relative min-h-[700px] flex items-center justify-center">
          <div className="text-center">
            <div className="w-32 h-32 relative mx-auto mb-8">
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-500 animate-spin"></div>
              <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-purple-500 animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
              <div className="absolute inset-4 rounded-full border-4 border-transparent border-t-pink-500 animate-spin" style={{animationDuration: '2s'}}></div>
            </div>
            <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 animate-pulse">Chargement...</p>
          </div>
        </section>
      ) : heroSlides.length === 0 ? (
        <section className="hero-legendary relative min-h-[700px] flex items-center justify-center">
          <div className="text-center px-4">
            <Smartphone className="w-32 h-32 mx-auto mb-8 text-cyan-400 animate-levitate" />
            <h2 className="text-5xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">Collection Bientôt Disponible</h2>
            <p className="text-xl text-white/60">Revenez découvrir nos produits d'exception</p>
          </div>
        </section>
      ) : (
      <section 
        className="hero-legendary relative w-full min-h-[700px] lg:min-h-[800px] flex items-center overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* REVOLUTIONARY BACKGROUND */}
        <div className="absolute inset-0 bg-[#030014]">
          {/* Animated mesh gradient */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900/50 via-transparent to-cyan-900/50"></div>
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-radial from-cyan-500/20 via-transparent to-transparent animate-pulse-slow"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-radial from-purple-500/20 via-transparent to-transparent animate-pulse-slow" style={{animationDelay: '2s'}}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-radial from-pink-500/10 via-transparent to-transparent animate-pulse-slow" style={{animationDelay: '1s'}}></div>
          </div>
          
          {/* Animated grid lines */}
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(to right, rgba(6, 182, 212, 0.03) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(6, 182, 212, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}></div>
          
          {/* Floating orbs */}
          <div className="absolute top-20 left-[10%] w-4 h-4 bg-cyan-400 rounded-full blur-sm animate-float-particle shadow-[0_0_20px_rgba(6,182,212,0.8)]"></div>
          <div className="absolute top-40 right-[15%] w-3 h-3 bg-purple-400 rounded-full blur-sm animate-float-particle-slow shadow-[0_0_15px_rgba(168,85,247,0.8)]" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-32 left-[20%] w-5 h-5 bg-pink-400 rounded-full blur-sm animate-float-particle shadow-[0_0_25px_rgba(244,114,182,0.8)]" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-[60%] right-[25%] w-2 h-2 bg-cyan-300 rounded-full blur-sm animate-float-particle-slow shadow-[0_0_10px_rgba(103,232,249,0.8)]" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute bottom-40 right-[10%] w-3 h-3 bg-yellow-400 rounded-full blur-sm animate-float-particle shadow-[0_0_15px_rgba(250,204,21,0.8)]" style={{animationDelay: '1.5s'}}></div>
          
          {/* Neon lines */}
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent"></div>
          <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-purple-500/20 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* LEFT CONTENT - REVOLUTIONARY LAYOUT */}
            <div className="space-y-8 order-last lg:order-first">
              
              {/* Brand with neon effect */}
              <div className="animate-fade-in-up">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
                  <span className="text-sm font-bold tracking-[0.2em] uppercase text-white/70">{currentSlideData?.brand || 'RYM GSM'}</span>
                </div>
              </div>

              {/* Product Name - MASSIVE with neon glow */}
              <div className="animate-slide-in-left delay-100">
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tight">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/80 drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                    {currentSlideData?.title || ''}
                  </span>
                </h1>
              </div>

              {/* Tagline with typewriter effect */}
              <div className="animate-fade-in-up delay-200">
                <p className="text-lg sm:text-xl text-white/60 font-medium max-w-lg leading-relaxed">
                  {currentSlideData?.tagline || ''}
                </p>
              </div>

              {/* SPECS - Futuristic cards */}
              <div className="grid grid-cols-2 gap-3 animate-fade-in-up delay-300">
                {currentSlideData?.specs?.map((spec, i) => {
                  const icons = {
                    wifi: <Wifi className="h-5 w-5" />,
                    battery: <Battery className="h-5 w-5" />,
                    camera: <Camera className="h-5 w-5" />,
                    cpu: <Cpu className="h-5 w-5" />
                  };
                  const colors = ['cyan', 'purple', 'pink', 'yellow'];
                  const color = colors[i % colors.length];
                  return (
                    <div 
                      key={`spec-${currentSlide}-${i}`}
                      className="group relative overflow-hidden rounded-2xl bg-white/[0.03] border border-white/10 p-4 hover:bg-white/[0.06] hover:border-white/20 transition-all duration-500 hover:scale-[1.02]"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br from-${color}-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                      <div className="relative flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl bg-gradient-to-br from-${color}-500/20 to-${color}-500/5 text-${color}-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]`}>
                          {icons[spec.icon]}
                        </div>
                        <span className="text-sm font-semibold text-white/80">{spec.text}</span>
                      </div>
                    </div>
                  );
                }) || []}
              </div>

              {/* PRICE - Holographic effect */}
              <div className="animate-fade-in-up delay-500">
                <div className="inline-block relative">
                  {/* Glow */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-pink-500/30 blur-2xl opacity-60 animate-pulse-slow"></div>
                  {/* Price card */}
                  <div className="relative px-8 py-5 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-xl">
                    <div className="flex items-baseline gap-2">
                      <span className="text-6xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
                        {currentSlideData?.price || '0'}
                      </span>
                      <span className="text-2xl font-bold text-white/60">DT</span>
                    </div>
                    <p className="text-xs text-white/40 mt-1 tracking-widest uppercase">Prix TTC • Garantie Incluse</p>
                  </div>
                </div>
              </div>

              {/* CTA BUTTONS - Neon style */}
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-700">
                <Link
                  to={currentSlideData?.id ? `/products/${currentSlideData.id}` : '/products'}
                  className="group relative px-10 py-5 rounded-2xl font-black text-lg overflow-hidden"
                >
                  {/* Animated gradient border */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 p-[2px]">
                    <div className="absolute inset-[2px] rounded-[14px] bg-[#030014]"></div>
                  </div>
                  {/* Glow */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/50 via-purple-500/50 to-pink-500/50 blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
                  {/* Content */}
                  <span className="relative z-10 flex items-center justify-center gap-3 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 group-hover:from-white group-hover:via-white group-hover:to-white transition-all duration-300">
                    Acheter Maintenant
                    <ArrowRight className="h-5 w-5 text-purple-400 group-hover:text-white group-hover:translate-x-2 transition-all" />
                  </span>
                </Link>
                <Link 
                  to={currentSlideData?.id ? `/products/${currentSlideData.id}` : '/products'}
                  className="group px-10 py-5 rounded-2xl font-bold text-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex items-center justify-center gap-3 text-white/70 hover:text-white backdrop-blur-sm"
                >
                  <Eye className="h-5 w-5" />
                  Détails
                </Link>
              </div>
            </div>

            {/* RIGHT CONTENT - 3D PRODUCT SHOWCASE */}
            <div className="relative flex justify-center items-center h-[450px] sm:h-[550px] lg:h-[650px] order-first lg:order-last">
              
              {/* Outer rotating ring */}
              <div className="absolute w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] lg:w-[600px] lg:h-[600px]">
                <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-spin-slow"></div>
                <div className="absolute inset-4 rounded-full border border-purple-500/20 animate-spin-slow-reverse"></div>
                <div className="absolute inset-8 rounded-full border border-pink-500/10 animate-spin-slow" style={{animationDuration: '40s'}}></div>
              </div>
              
              {/* Glowing orb */}
              <div className="absolute w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-[100px] animate-pulse-slow"></div>
              
              {/* Product container */}
              <div className="relative z-10 animate-levitate">
                {/* Product image */}
                <div className="relative">
                  <img 
                    key={`img-${currentSlide}`}
                    src={currentSlideData?.image || ''}
                    alt={currentSlideData?.title || 'Product'}
                    loading="eager"
                    className="w-auto h-[350px] sm:h-[450px] lg:h-[550px] object-contain drop-shadow-[0_0_100px_rgba(6,182,212,0.3)] animate-zoom-in"
                  />
                  
                  {/* Reflection */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200px] h-[100px] bg-gradient-to-t from-cyan-500/10 to-transparent blur-2xl"></div>
                </div>
                
                {/* Floating badges */}
                <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 blur-xl opacity-60 animate-pulse"></div>
                    <div className="relative px-5 py-2.5 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black text-sm flex items-center gap-2 shadow-2xl">
                      <Sparkles className="h-5 w-5 animate-spin-slow" />
                      NEW
                    </div>
                  </div>
                </div>
                
                <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 blur-xl opacity-60 animate-pulse"></div>
                    <div className="relative px-5 py-2.5 rounded-2xl bg-gradient-to-r from-green-400 to-emerald-500 text-black font-bold text-sm flex items-center gap-2 shadow-2xl">
                      <CheckCircle className="h-5 w-5" />
                      En Stock
                    </div>
                  </div>
                </div>
                
                <div className="absolute top-1/2 -translate-y-1/2 -right-8 sm:-right-12">
                  <div className="px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white font-bold text-xs flex items-center gap-2 shadow-2xl animate-pulse-slow">
                    <Zap className="h-4 w-4 text-yellow-400" />
                    24h
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* NAVIGATION - Futuristic */}
          <div className="absolute bottom-8 sm:bottom-12 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center gap-6">
              {/* Prev */}
              <button 
                onClick={prevSlide}
                className="group w-14 h-14 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl flex items-center justify-center hover:bg-white/10 hover:border-white/20 hover:scale-110 transition-all duration-300 shadow-2xl"
              >
                <ChevronLeft className="h-6 w-6 text-white/70 group-hover:text-white transition-colors" />
              </button>
              
              {/* Dots */}
              <div className="flex gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl">
                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      index === currentSlide 
                        ? 'w-10 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 shadow-[0_0_15px_rgba(6,182,212,0.8)]' 
                        : 'w-6 bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>
              
              {/* Next */}
              <button 
                onClick={nextSlide}
                className="group w-14 h-14 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl flex items-center justify-center hover:bg-white/10 hover:border-white/20 hover:scale-110 transition-all duration-300 shadow-2xl"
              >
                <ChevronRight className="h-6 w-6 text-white/70 group-hover:text-white transition-colors" />
              </button>
            </div>
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
