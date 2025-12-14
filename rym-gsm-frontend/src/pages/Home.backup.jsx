import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
  Star, ArrowRight, ShoppingCart, Eye, Heart, 
  Shield, Truck, RotateCcw, Phone, Laptop, Watch, 
  Headphones, Camera, Zap, Battery, Wifi, 
  CheckCircle, Users, Award, TrendingUp, Sparkles,
  Clock, Pause, Play, ChevronRight, Share2
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import ProductRating from '../components/ProductRating';
import api from '../config/api';
import toast from 'react-hot-toast';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const { addToCart } = useCart();

  // Fetch featured products
  const { data: featuredProducts, isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => api.get('/products?limit=8').then(res => res.data),
    select: (data) => data.products
  });

  // Auto-rotate hero slides
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const heroSlides = [
    {
      title: "OPPO A6 Pro",
      subtitle: "4G à 999 Dt | 5G à 1199 Dt",
      price: "À partir de 999 Dt",
      image: "/images/phones/OppoA6pro.jpg",
      bg: "from-pink-500 to-rose-600"
    },
    {
      title: "Xiaomi Redmi 15C",
      subtitle: "Performance et design à petit prix",
      price: "549 Dt",
      image: "/images/phones/Redmi15C.jpg",
      bg: "from-cyan-500 to-teal-600"
    },
    {
      title: "Samsung Galaxy A56 5G",
      subtitle: "L'expérience Galaxy nouvelle génération",
      price: "1999 Dt",
      image: "/images/phones/A565g.jpg",
      bg: "from-violet-500 to-purple-600"
    }
  ];

  const features = [
    {
      icon: <Phone className="h-12 w-12 text-primary-500" />,
      title: "Derniers Téléphones",
      description: "Découvrez les derniers smartphones des meilleures marques avec une technologie de pointe",
      color: "from-primary-500 to-primary-600"
    },
    {
      icon: <Headphones className="h-12 w-12 text-purple-500" />,
      title: "Accessoires Premium",
      description: "Coques, chargeurs et équipements audio de haute qualité pour vos appareils",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <Shield className="h-12 w-12 text-green-500" />,
      title: "Protection Garantie",
      description: "Couverture de garantie complète sur tous les produits pour votre tranquillité d'esprit",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <Zap className="h-12 w-12 text-yellow-500" />,
      title: "Livraison Rapide",
      description: "Livraison ultra-rapide dans tout le pays avec suivi en temps réel",
      color: "from-yellow-500 to-orange-500"
    }
  ];

  const stats = [
    { number: "10K+", label: "Clients Satisfaits", icon: <Users className="h-8 w-8" /> },
    { number: "500+", label: "Produits", icon: <Phone className="h-8 w-8" /> },
    { number: "99%", label: "Satisfaction", icon: <Award className="h-8 w-8" /> },
    { number: "24/7", label: "Support", icon: <Clock className="h-8 w-8" /> }
  ];

  const testimonials = [
    {
      name: "Ahmed Ben Ali",
      role: "Chef d'entreprise",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      comment: "Service exceptionnel ! J'ai reçu mon Redmi Note 13 le jour même. Le personnel était incroyablement serviable et compétent."
    },
    {
      name: "Fatma Khelil",
      role: "Étudiante",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      comment: "Les meilleurs prix à Nabeul ! J'ai trouvé exactement ce que je cherchais et j'ai économisé beaucoup d'argent. Hautement recommandé !"
    },
    {
      name: "Mohamed Trabelsi",
      role: "Ingénieur",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      comment: "Service professionnel et produits authentiques. La couverture de garantie me donne une confiance totale dans mon achat."
    }
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
    <div className="min-h-screen">
      {/* Hero Section with Slider */}
      <section className="relative h-screen overflow-hidden">
        {/* Background Slides */}
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-gradient-to-br ${slide.bg} transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0 bg-black/20"></div>
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${slide.image})` }}
            ></div>
          </div>
        ))}

        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="text-white space-y-8 animate-slide-in-left">
                <div className="space-y-4">
                  <h1 className="text-5xl md:text-7xl font-black leading-tight">
                    {heroSlides[currentSlide].title}
                  </h1>
                  <p className="text-xl md:text-2xl text-white/90 font-medium">
                    {heroSlides[currentSlide].subtitle}
                  </p>
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl font-bold text-white">
                      {heroSlides[currentSlide].price}
                    </span>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                      <span className="text-white/80 ml-2">(4.9/5)</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/products"
                    className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center group"
                  >
                    Acheter Maintenant
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="btn-secondary text-lg px-8 py-4 inline-flex items-center justify-center group"
                  >
                    {isPlaying ? <Pause className="h-5 w-5 mr-2" /> : <Play className="h-5 w-5 mr-2" />}
                    {isPlaying ? 'Pause' : 'Lecture'} Vidéo
                  </button>
                </div>

                {/* Features List */}
                <div className="grid grid-cols-2 gap-4 pt-8">
                  <div className="flex items-center space-x-3">
                    <Wifi className="h-5 w-5 text-white/80" />
                    <span className="text-white/80">Compatible 5G</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Battery className="h-5 w-5 text-white/80" />
                    <span className="text-white/80">Batterie Longue Durée</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Camera className="h-5 w-5 text-white/80" />
                    <span className="text-white/80">Caméra Pro</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-white/80" />
                    <span className="text-white/80">Garantie 2 Ans</span>
                  </div>
                </div>
              </div>

              {/* Right Content - Phone Mockup */}
              <div className="relative animate-slide-in-right">
                <div className="relative mx-auto w-80 h-96">
                  {/* Phone Frame */}
                  <div className="absolute inset-0 bg-gray-900 rounded-[3rem] p-2 shadow-2xl">
                    <div className="w-full h-full bg-black rounded-[2.5rem] overflow-hidden relative">
                      {/* Phone Screen */}
                      <div 
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${heroSlides[currentSlide].image})` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                          <h3 className="text-lg font-bold">{heroSlides[currentSlide].title}</h3>
                          <p className="text-sm text-white/80">{heroSlides[currentSlide].subtitle}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating Elements */}
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center animate-float">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center animate-bounce-slow">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-primary-500 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-white/80 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Pourquoi Choisir <span className="gradient-text">RYM GSM</span> ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nous ne sommes pas qu'une boutique de téléphones - nous sommes votre partenaire technologique de confiance, 
              engagés à offrir l'excellence dans chaque interaction.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group text-center p-8 rounded-2xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50 border border-gray-100"
              >
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Produits <span className="gradient-text">Vedettes</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez notre sélection des derniers appareils les plus populaires
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="card p-6 animate-pulse">
                  <div className="bg-gray-300 h-64 rounded-xl mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                  <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts?.slice(0, 8).map((product, index) => (
                <div 
                  key={product.id} 
                  className="group card p-6 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative overflow-hidden rounded-xl mb-6">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200">
                        <Heart className="h-5 w-5 text-gray-600" />
                      </button>
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Featured
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-300">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {product.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-primary-600">
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
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 btn-primary text-sm py-3"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Ajouter au Panier
                      </button>
                      <Link
                        to={`/products/${product.id}`}
                        className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/products"
              className="btn-primary text-lg px-8 py-4 inline-flex items-center group"
            >
              Voir Tous les Produits
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Ce Que Disent Nos <span className="gradient-text">Clients</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ne nous croyez pas sur parole - écoutez nos clients satisfaits
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="card p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-600 leading-relaxed mb-4">
                  "{testimonial.comment}"
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                      <Heart className="h-4 w-4 text-gray-400" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                      <Share2 className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">Achat Vérifié</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-500 to-primary-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-float"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Prêt à Passer au Niveau Supérieur ?
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
            Rejoignez des milliers de clients satisfaits qui font confiance à RYM GSM pour leurs besoins mobiles
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="bg-white text-primary-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center group"
            >
              Commencer vos Achats
              <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-primary-600 transition-all duration-300 transform hover:scale-105"
            >
              Nous Contacter
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;