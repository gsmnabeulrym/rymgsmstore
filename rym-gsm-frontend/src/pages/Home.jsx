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
      {/* Premium Hero Slider - Legendary Design */}
      {sliderLoading ? (
        <section className="relative min-h-[600px] flex items-center justify-center bg-gradient-to-br from-[#0A0E27] via-[#1a1f3a] to-[#0f1629]">
          <div className="text-center text-white">
            <div className="w-24 h-24 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-6 shadow-[0_0_30px_rgba(0,212,255,0.5)]"></div>
            <p className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Chargement de l'expérience premium...</p>
          </div>
        </section>
      ) : heroSlides.length === 0 ? (
        <section className="relative min-h-[600px] flex items-center justify-center bg-gradient-to-br from-[#0A0E27] via-[#1a1f3a] to-[#0f1629]">
          <div className="text-center text-white px-4">
            <Smartphone className="w-24 h-24 mx-auto mb-6 opacity-50 text-cyan-400" />
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Collection Premium Bientôt Disponible</h2>
            <p className="text-xl text-white/70">Revenez découvrir nos produits d'exception</p>
          </div>
        </section>
      ) : (
      <section 
        className="relative w-full min-h-[600px] flex items-center overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Cinematic Animated Background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${currentSlideData?.gradient?.bg || premiumGradients[0].bg} transition-all duration-1000`}>
          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-[10%] left-[15%] w-2 h-2 bg-cyan-400 rounded-full animate-float-particle opacity-60"></div>
            <div className="absolute top-[30%] right-[20%] w-3 h-3 bg-purple-400 rounded-full animate-float-particle-slow opacity-40" style={{animationDelay: '1s'}}></div>
            <div className="absolute bottom-[20%] left-[25%] w-2 h-2 bg-pink-400 rounded-full animate-float-particle opacity-50" style={{animationDelay: '2s'}}></div>
            <div className="absolute top-[60%] right-[30%] w-2 h-2 bg-cyan-300 rounded-full animate-float-particle-slow opacity-60" style={{animationDelay: '0.5s'}}></div>
          </div>
          
          {/* Gradient orbs */}
          <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-cyan-500/20 to-transparent rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-gradient-to-tl from-purple-500/20 to-transparent rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '1s'}}></div>
          
          {/* Subtle grid */}
          <div className="absolute inset-0 opacity-5" 
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '50px 50px'
            }}
          ></div>
          
          {/* Spotlight effect */}
          <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/40"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content - Premium Layout */}
            <div className="text-white space-y-6 sm:space-y-8 order-last lg:order-first">
              {/* Brand Logo */}
              <div key={`brand-${currentSlide}`} className="animate-fade-in-up">
                <span className="text-sm font-bold tracking-widest uppercase text-white/60">{currentSlideData?.brand || 'RYM GSM'}</span>
              </div>

              {/* Product Name - Gradient Text */}
              <div key={`name-${currentSlide}`} className="animate-slide-in-left delay-100">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] bg-gradient-to-r ${currentSlideData?.gradient?.accent || premiumGradients[0].accent} bg-clip-text text-transparent drop-shadow-2xl">
                  {currentSlideData?.title || ''}
                </h1>
              </div>

              {/* Tagline */}
              <div key={`tagline-${currentSlide}`} className="animate-fade-in-up delay-200">
                <p className="text-lg sm:text-xl text-white/80 font-medium max-w-xl">
                  {currentSlideData?.tagline || ''}
                </p>
              </div>

              {/* Key Specs - Icon Format */}
              <div key={`specs-${currentSlide}`} className="grid grid-cols-2 gap-4 animate-fade-in-up delay-300 max-w-lg">
                {currentSlideData?.specs?.map((spec, i) => {
                  const icons = {
                    wifi: <Wifi className="h-6 w-6" />,
                    battery: <Battery className="h-6 w-6" />,
                    camera: <Camera className="h-6 w-6" />,
                    cpu: <Cpu className="h-6 w-6" />
                  };
                  return (
                    <div 
                      key={`${currentSlide}-spec-${i}`} 
                      className="group flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-3 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105"
                      style={{animationDelay: `${300 + i * 100}ms`}}
                    >
                      <div className="p-2.5 bg-gradient-to-br ${currentSlideData?.gradient?.accent || premiumGradients[0].accent} rounded-xl group-hover:scale-110 transition-transform shadow-lg">
                        {icons[spec.icon]}
                      </div>
                      <span className="text-sm font-semibold text-white/90">{spec.text}</span>
                    </div>
                  );
                }) || []}
              </div>

              {/* Price with Badge */}
              <div key={`price-${currentSlide}`} className="flex items-center gap-4 animate-fade-in-up delay-500">
                <div className="relative">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r ${currentSlideData?.gradient?.accent || premiumGradients[0].accent} blur-2xl opacity-50 rounded-3xl"></div>
                  {/* Price container */}
                  <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 px-8 py-4 rounded-3xl shadow-2xl">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl sm:text-6xl font-black bg-gradient-to-r ${currentSlideData?.gradient?.accent || premiumGradients[0].accent} bg-clip-text text-transparent">
                        {currentSlideData?.price || '0'}
                      </span>
                      <span className="text-2xl font-bold text-white/80">DT</span>
                    </div>
                    <p className="text-xs text-white/50 mt-1 uppercase tracking-wide">Prix TTC</p>
                  </div>
                </div>
                {/* Discount badge if available */}
                {currentSlideData?.discount && (
                  <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-2xl font-black text-sm animate-wiggle shadow-xl">
                    -{currentSlideData.discount}%
                  </div>
                )}
              </div>

              {/* CTA Buttons - Premium Style */}
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-700">
                <Link
                  to={currentSlideData?.id ? `/products/${currentSlideData.id}` : '/products'}
                  className="group relative px-10 py-5 rounded-2xl font-black text-lg overflow-hidden shadow-2xl hover:shadow-[0_0_40px_rgba(0,212,255,0.6)] transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  {/* Gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-r ${currentSlideData?.gradient?.accent || premiumGradients[0].accent}"></div>
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                  {/* Content */}
                  <span className="relative z-10 flex items-center justify-center gap-2 text-white">
                    Acheter Maintenant
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                  </span>
                </Link>
                <Link 
                  to={currentSlideData?.id ? `/products/${currentSlideData.id}` : '/products'}
                  className="group px-10 py-5 rounded-2xl font-bold text-lg bg-white/5 backdrop-blur-md border-2 border-white/20 hover:bg-white/10 hover:border-white/30 transition-all duration-300 flex items-center justify-center gap-2 text-white shadow-xl active:scale-95"
                >
                  <Eye className="h-5 w-5" />
                  En Savoir Plus
                </Link>
              </div>
            </div>

            {/* Right Content - Cinematic Product Display */}
            <div className="relative flex justify-center items-center h-[400px] sm:h-[500px] lg:h-[600px] order-first lg:order-last">
              {/* Rotating rings with gradient */}
              <div className="absolute w-[350px] h-[350px] sm:w-[450px] sm:h-[450px] lg:w-[550px] lg:h-[550px] rounded-full border-[3px] border-transparent bg-gradient-to-r ${currentSlideData?.gradient?.accent || premiumGradients[0].accent} opacity-20 animate-spin-slow" style={{maskImage: 'linear-gradient(transparent 40%, black 60%)'}}></div>
              <div className="absolute w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px] rounded-full border-[2px] border-white/10 animate-spin-slow-reverse"></div>
              
              {/* Glow orb behind product */}
              <div className="absolute w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] bg-gradient-to-br ${currentSlideData?.gradient?.accent || premiumGradients[0].accent} opacity-30 blur-[80px] rounded-full animate-pulse-slow"></div>
              
              {/* Product Image with levitation effect */}
              <div key={`product-${currentSlide}`} className="relative z-10 animate-levitate">
                <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] flex items-center justify-center">
                  <img 
                    src={currentSlideData?.image || ''}
                    alt={currentSlideData?.title || 'Product'}
                    loading="eager"
                    decoding="async"
                    className="w-auto h-full object-contain max-w-[250px] sm:max-w-[350px] lg:max-w-[450px] animate-zoom-in"
                    style={{ 
                      filter: 'drop-shadow(0 40px 80px rgba(0,0,0,0.6))'
                    }}
                  />
                  {/* Spotlight effect */}
                  <div className="absolute inset-0 -z-10 bg-gradient-to-t from-white/20 via-transparent to-transparent blur-2xl scale-110"></div>
                </div>
                
                {/* Premium badges */}
                <div className="absolute -top-6 -right-6 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 text-white px-5 py-2.5 rounded-2xl font-black text-sm shadow-[0_0_30px_rgba(251,191,36,0.6)] animate-pulse-badge border-2 border-white/30">
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 animate-spin-slow" />
                    NEW
                  </span>
                </div>
                <div className="absolute -bottom-6 -left-6 bg-gradient-to-br from-green-400 to-emerald-500 text-white px-5 py-2.5 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-[0_0_30px_rgba(34,197,94,0.6)] border-2 border-white/30">
                  <CheckCircle className="h-5 w-5" />
                  En Stock
                </div>
                <div className="absolute top-1/2 -translate-y-1/2 -right-10 bg-gradient-to-r ${currentSlideData?.gradient?.accent || premiumGradients[0].accent} text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-2xl border border-white/30 backdrop-blur-xl animate-pulse-slow">
                  <span className="flex items-center gap-1.5">
                    <Zap className="h-4 w-4" />
                    24h
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Navigation Controls */}
          <div className="absolute bottom-8 sm:bottom-12 left-1/2 transform -translate-x-1/2 flex items-center gap-6">
            {/* Previous button */}
            <button 
              onClick={prevSlide}
              aria-label="Previous slide"
              className="group relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 hover:scale-110 transition-all duration-300 active:scale-95 shadow-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <ChevronLeft className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-white group-hover:scale-110 transition-transform" />
            </button>
            
            {/* Line indicators */}
            <div className="flex gap-2 bg-white/5 backdrop-blur-xl px-6 py-3 rounded-full border border-white/10 shadow-2xl">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className="relative group"
                >
                  <div className={`h-1 rounded-full transition-all duration-500 ${
                    index === currentSlide 
                      ? 'w-12 bg-gradient-to-r from-cyan-400 to-purple-400 shadow-[0_0_10px_rgba(0,212,255,0.8)]' 
                      : 'w-8 bg-white/30 hover:bg-white/50 group-hover:w-10'
                  }`}></div>
                </button>
              ))}
            </div>
            
            {/* Next button */}
            <button 
              onClick={nextSlide}
              aria-label="Next slide"
              className="group relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 hover:scale-110 transition-all duration-300 active:scale-95 shadow-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <ChevronRight className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-white group-hover:scale-110 transition-transform" />
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
