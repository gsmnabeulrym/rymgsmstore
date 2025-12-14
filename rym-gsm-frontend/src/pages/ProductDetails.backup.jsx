import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Star, ShoppingCart, Heart, ArrowLeft, Check, X, 
  Plus, Minus, Share2, Eye, Shield, Truck, RotateCcw,
  Zap, Battery, Camera, Wifi, Cpu, HardDrive, 
  Smartphone, Headphones, Watch, Laptop, Sparkles
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

  // Fetch product details
  const { data: productData, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => api.get(`/products/${id}`).then(res => res.data),
    enabled: !!id
  });

  const product = productData?.product;

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    const result = await addToCart(product.id, quantity);
    if (result.success) {
      toast.success('Product added to cart! 🎉');
    } else {
      toast.error(result.message);
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to purchase');
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


  const getCategoryIcon = (category) => {
    switch (category) {
      case 'phone': return <Smartphone className="h-5 w-5" />;
      case 'laptop': return <Laptop className="h-5 w-5" />;
      case 'watch': return <Watch className="h-5 w-5" />;
      case 'accessory': return <Headphones className="h-5 w-5" />;
      default: return <Smartphone className="h-5 w-5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <X className="h-16 w-16 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/products')}
            className="btn-primary"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'description', label: 'Description', icon: <Eye className="h-4 w-4" /> },
    { id: 'specifications', label: 'Specifications', icon: <Cpu className="h-4 w-4" /> },
    { id: 'reviews', label: 'Reviews', icon: <Star className="h-4 w-4" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-primary-600 mb-8 transition-colors duration-200 group"
        >
          <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
          Back to Products
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images with Gallery */}
          <div className="space-y-6">
            <ProductImageGallery 
              images={product.images} 
              productName={product.name}
            />
            
            {/* Image Badges */}
            <div className="flex items-center justify-center gap-3 mt-4">
              <span className="bg-primary-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                New
              </span>
              {product.stock > 0 && (
                <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  In Stock
                </span>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            {/* Brand & Category */}
            <div className="flex items-center space-x-3">
              <span className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-700 text-sm font-semibold rounded-full">
                {getCategoryIcon(product.category)}
                <span className="ml-2">{product.brand}</span>
              </span>
              <span className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-full">
                {product.category}
              </span>
            </div>

            {/* Product Title */}
            <h1 className="text-4xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center space-x-4">
              <ProductRating 
                productId={product.id} 
                size="lg" 
                showCount={true}
              />
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-5xl font-bold text-primary-600">
                {product.price} Dt
              </span>
              <span className="text-2xl text-gray-400 line-through">
                {Math.round(product.price * 1.2)} Dt
              </span>
              <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                Save {Math.round(product.price * 0.2)} Dt
              </span>
            </div>

            {/* Description */}
            <p className="text-lg text-gray-700 leading-relaxed">
              {product.description}
            </p>

            {/* Stock Status */}
            <div className="flex items-center space-x-4">
              {product.stock > 0 ? (
                <div className="flex items-center text-green-600 bg-green-50 px-4 py-2 rounded-xl">
                  <Check className="h-5 w-5 mr-2" />
                  <span className="font-semibold">In Stock ({product.stock} available)</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600 bg-red-50 px-4 py-2 rounded-xl">
                  <X className="h-5 w-5 mr-2" />
                  <span className="font-semibold">Out of Stock</span>
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="space-y-4">
              <label className="block text-lg font-semibold text-gray-700">
                Quantity
              </label>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 rounded-xl border-2 border-gray-200 flex items-center justify-center hover:border-primary-300 hover:bg-primary-50 transition-all duration-200"
                >
                  <Minus className="h-5 w-5" />
                </button>
                <span className="w-20 text-center text-xl font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  className="w-12 h-12 rounded-xl border-2 border-gray-200 flex items-center justify-center hover:border-primary-300 hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 btn-primary py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="h-6 w-6 mr-2" />
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
              >
                Buy Now
              </button>
            </div>

            {/* WhatsApp Product Inquiry */}
            <div className="mt-8">
              <WhatsAppProductInquiry product={product} />
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                <Shield className="h-6 w-6 text-primary-500" />
                <span className="font-semibold text-gray-700">2 Year Warranty</span>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                <Truck className="h-6 w-6 text-primary-500" />
                <span className="font-semibold text-gray-700">Free Shipping</span>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                <RotateCcw className="h-6 w-6 text-primary-500" />
                <span className="font-semibold text-gray-700">30 Day Returns</span>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                <Zap className="h-6 w-6 text-primary-500" />
                <span className="font-semibold text-gray-700">Fast Delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-6 px-4 flex items-center space-x-2 font-semibold text-lg border-b-2 transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-8">
              {activeTab === 'description' && (
                <div className="prose max-w-none">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Product Description</h3>
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    {product.description}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-xl font-semibold text-gray-900">Key Features</h4>
                      <ul className="space-y-2">
                        <li className="flex items-center space-x-2">
                          <Check className="h-5 w-5 text-green-500" />
                          <span>Premium build quality</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Check className="h-5 w-5 text-green-500" />
                          <span>Latest technology</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Check className="h-5 w-5 text-green-500" />
                          <span>Long-lasting battery</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Check className="h-5 w-5 text-green-500" />
                          <span>Fast performance</span>
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-xl font-semibold text-gray-900">What's Included</h4>
                      <ul className="space-y-2">
                        <li className="flex items-center space-x-2">
                          <Check className="h-5 w-5 text-green-500" />
                          <span>Device</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Check className="h-5 w-5 text-green-500" />
                          <span>Charging cable</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Check className="h-5 w-5 text-green-500" />
                          <span>User manual</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Check className="h-5 w-5 text-green-500" />
                          <span>Warranty card</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'specifications' && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Technical Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(product.specs || {}).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-4 border-b border-gray-100">
                        <span className="font-semibold text-gray-600 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}:
                        </span>
                        <span className="text-gray-900 font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-8">
                  <AddReview 
                    productId={product.id} 
                    onReviewAdded={() => {
                      // Refresh reviews when a new review is added
                      window.location.reload();
                    }} 
                  />
                  <ReviewList productId={product.id} key={Date.now()} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Benefits */}
        <div className="mt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Truck className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Free Shipping
              </h3>
              <p className="text-gray-600">
                Livraison gratuite pour les commandes de plus de 100 Dt. Livraison rapide et fiable dans tout le pays.
              </p>
            </div>
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Warranty Protection
              </h3>
              <p className="text-gray-600">
                2-year comprehensive warranty on all products for your peace of mind.
              </p>
            </div>
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <RotateCcw className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Easy Returns
              </h3>
              <p className="text-gray-600">
                30-day hassle-free return policy. No questions asked, full refund guaranteed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;