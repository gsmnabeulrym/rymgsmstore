import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Star, ShoppingCart, Heart, ArrowLeft, Check, X, 
  Plus, Minus, Share2, Eye, Shield, Truck, RotateCcw,
  Zap, Battery, Camera, Wifi, Cpu, HardDrive, 
  Smartphone, Headphones, Watch, Laptop, Sparkles,
  ChevronRight, Package, CreditCard, MessageCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import ProductRating from '../components/ProductRating';
import ProductImageGallery from '../components/ProductImageGallery';
import WhatsAppProductInquiry from '../components/WhatsAppProductInquiry';
import WishlistButton from '../components/WishlistButton';
import api from '../config/api';
import toast from 'react-hot-toast';
import ReviewList from '../components/ReviewList';
import AddReview from '../components/AddReview';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  const { data: productData, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => api.get(`/products/${id}`).then(res => res.data),
    enabled: !!id
  });

  const product = productData?.product;

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Veuillez vous connecter pour ajouter au panier');
      navigate('/login');
      return;
    }
    const result = await addToCart(product.id, quantity);
    if (result.success) {
      toast.success('Produit ajouté au panier ! 🎉');
    } else {
      toast.error(result.message);
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      toast.error('Veuillez vous connecter pour acheter');
      navigate('/login');
      return;
    }
    const result = await addToCart(product.id, quantity);
    if (result.success) {
      navigate('/cart');
    } else {
      toast.error(result.message);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du produit...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <X className="h-12 w-12 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Produit non trouvé</h1>
          <p className="text-gray-600 mb-6">Le produit que vous cherchez n'existe pas.</p>
          <Link to="/products" className="btn-primary">
            Retour aux produits
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'specifications', label: 'Spécifications' },
    { id: 'reviews', label: 'Avis' }
  ];

  const specIcons = {
    ram: <Cpu className="h-5 w-5" />,
    storage: <HardDrive className="h-5 w-5" />,
    battery: <Battery className="h-5 w-5" />,
    camera: <Camera className="h-5 w-5" />,
    screen: <Smartphone className="h-5 w-5" />,
    processor: <Zap className="h-5 w-5" />,
    network: <Wifi className="h-5 w-5" />
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center text-sm">
            <Link to="/" className="text-gray-500 hover:text-primary-600 transition-colors">Accueil</Link>
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
            <Link to="/products" className="text-gray-500 hover:text-primary-600 transition-colors">Produits</Link>
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
            <span className="text-gray-900 font-medium truncate max-w-xs">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Product Section */}
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left - Image Gallery */}
            <div className="p-6 lg:p-10 bg-gradient-to-br from-gray-50 to-gray-100">
              <ProductImageGallery 
                images={product.images} 
                productName={product.name}
              />
              
              {/* Badges */}
              <div className="flex items-center justify-center gap-3 mt-6">
                {product.stock > 0 ? (
                  <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                    <Check className="h-4 w-4" />
                    En Stock
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold">
                    <X className="h-4 w-4" />
                    Rupture de Stock
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold">
                  <Sparkles className="h-4 w-4" />
                  Original
                </span>
              </div>
            </div>

            {/* Right - Product Info */}
            <div className="p-6 lg:p-10 flex flex-col">
              {/* Brand */}
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-gray-900 text-white px-3 py-1 rounded-lg text-sm font-bold">
                  {product.brand}
                </span>
                <ProductRating productId={product.id} size="sm" showCount={true} />
              </div>

              {/* Title */}
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              {/* Description */}
              <p className="text-gray-600 mb-6 line-clamp-3">
                {product.description}
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-4xl font-black text-primary-600">
                  {product.price} <span className="text-xl">Dt</span>
                </span>
                {product.price > 500 && (
                  <span className="text-lg text-gray-400 line-through">
                    {Math.round(product.price * 1.15)} Dt
                  </span>
                )}
              </div>

              {/* Quick Specs */}
              {product.specs && Object.keys(product.specs).length > 0 && (
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {Object.entries(product.specs).slice(0, 4).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2 bg-gray-50 px-4 py-3 rounded-xl">
                      <div className="text-primary-500">
                        {specIcons[key.toLowerCase()] || <Zap className="h-5 w-5" />}
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 capitalize">{key}</p>
                        <p className="text-sm font-semibold text-gray-900">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-gray-700 font-medium">Quantité:</span>
                <div className="flex items-center bg-gray-100 rounded-xl">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-200 rounded-l-xl transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-200 rounded-r-xl transition-colors disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/25 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Ajouter au Panier
                </button>
                <WishlistButton product={product} size="lg" />
              </div>

              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-6"
              >
                <Zap className="h-5 w-5" />
                Acheter Maintenant
              </button>

              {/* WhatsApp */}
              <WhatsAppProductInquiry product={product} />

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Truck className="h-5 w-5 text-primary-500" />
                  <span>Livraison Rapide</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="h-5 w-5 text-primary-500" />
                  <span>Garantie 1 An</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Package className="h-5 w-5 text-primary-500" />
                  <span>Produit Original</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CreditCard className="h-5 w-5 text-primary-500" />
                  <span>Paiement à la Livraison</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-8 bg-white rounded-3xl shadow-sm overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b">
            <div className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-5 text-center font-semibold transition-all duration-300 relative ${
                    activeTab === tab.id
                      ? 'text-primary-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6 lg:p-10">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Description du Produit</h3>
                <p className="text-gray-700 leading-relaxed mb-8">{product.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">Caractéristiques</h4>
                    <ul className="space-y-3">
                      {['Qualité premium', 'Technologie avancée', 'Design moderne', 'Performance optimale'].map((item, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                            <Check className="h-4 w-4 text-green-600" />
                          </div>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">Contenu de la Boîte</h4>
                    <ul className="space-y-3">
                      {['Appareil', 'Câble de charge', 'Manuel utilisateur', 'Carte de garantie'].map((item, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                            <Package className="h-4 w-4 text-primary-600" />
                          </div>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Spécifications Techniques</h3>
                {product.specs && Object.keys(product.specs).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(product.specs).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
                            {specIcons[key.toLowerCase()] || <Zap className="h-5 w-5" />}
                          </div>
                          <span className="font-medium text-gray-700 capitalize">{key}</span>
                        </div>
                        <span className="font-bold text-gray-900">{value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">Aucune spécification disponible</p>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-8">
                <AddReview 
                  productId={product.id} 
                  onReviewAdded={() => window.location.reload()} 
                />
                <ReviewList productId={product.id} />
              </div>
            )}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: <Truck className="h-8 w-8" />, title: 'Livraison Rapide', desc: 'Partout en Tunisie sous 24-48h', color: 'from-blue-500 to-cyan-500' },
            { icon: <Shield className="h-8 w-8" />, title: 'Garantie 1 An', desc: 'Service après-vente professionnel', color: 'from-green-500 to-emerald-500' },
            { icon: <RotateCcw className="h-8 w-8" />, title: 'Retour Facile', desc: 'Satisfait ou remboursé', color: 'from-purple-500 to-pink-500' }
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-4 text-white`}>
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
