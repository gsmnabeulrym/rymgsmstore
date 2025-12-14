import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Minus, Plus, Trash2, ShoppingBag, ArrowRight, ArrowLeft,
  Shield, Truck, CreditCard, Sparkles, CheckCircle, Package,
  ChevronRight, X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import WhatsAppOrderSupport from '../components/WhatsAppOrderSupport';
import toast from 'react-hot-toast';

const Cart = () => {
  const { isAuthenticated } = useAuth();
  const { cart, updateCartItem, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState({});

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 0) return;
    setIsUpdating(prev => ({ ...prev, [productId]: true }));
    const result = await updateCartItem(productId, newQuantity);
    setIsUpdating(prev => ({ ...prev, [productId]: false }));
    if (!result.success) {
      toast.error(result.message);
    }
  };

  const handleRemoveItem = async (productId) => {
    const result = await removeFromCart(productId);
    if (result.success) {
      toast.success('Article retiré du panier');
    } else {
      toast.error(result.message);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir vider votre panier ?')) {
      const result = await clearCart();
      if (result.success) {
        toast.success('Panier vidé');
      } else {
        toast.error(result.message);
      }
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Veuillez vous connecter pour procéder au paiement');
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  // Empty states
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-12 w-12 text-primary-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Connectez-vous</h1>
          <p className="text-gray-600 mb-8">Vous devez être connecté pour voir votre panier</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/login" className="btn-primary px-8 py-3">
              Connexion
            </Link>
            <Link to="/register" className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3 rounded-xl font-semibold transition-colors">
              S'inscrire
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-12 w-12 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Votre Panier est Vide</h1>
          <p className="text-gray-600 mb-8">Découvrez nos produits et commencez vos achats</p>
          <Link to="/products" className="btn-primary inline-flex items-center gap-2 px-8 py-3">
            Explorer les Produits
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    );
  }

  const shipping = cart.total > 500 ? 0 : 7;
  const total = cart.total + shipping;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Mon Panier</h1>
                <p className="text-sm text-gray-500">{cart.products.length} article(s)</p>
              </div>
            </div>
            <button
              onClick={handleClearCart}
              className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center gap-1"
            >
              <Trash2 className="h-4 w-4" />
              Vider
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.products.map((item, index) => (
              <div 
                key={item.productId} 
                className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex gap-4">
                  {/* Image */}
                  <Link to={`/products/${item.productId}`} className="flex-shrink-0">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-xl overflow-hidden">
                      <img
                        src={item.image || item.images?.[0] || '/placeholder.jpg'}
                        alt={item.name}
                        className="w-full h-full object-contain p-2 hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <p className="text-sm text-primary-600 font-medium">{item.brand}</p>
                        <Link to={`/products/${item.productId}`}>
                          <h3 className="font-bold text-gray-900 hover:text-primary-600 transition-colors line-clamp-2">
                            {item.name}
                          </h3>
                        </Link>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.productId)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="mt-4 flex items-end justify-between">
                      {/* Quantity */}
                      <div className="flex items-center bg-gray-100 rounded-xl">
                        <button
                          onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                          disabled={isUpdating[item.productId] || item.quantity <= 1}
                          className="w-9 h-9 flex items-center justify-center hover:bg-gray-200 rounded-l-xl transition-colors disabled:opacity-50"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-10 text-center font-bold text-sm">
                          {isUpdating[item.productId] ? (
                            <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                          ) : (
                            item.quantity
                          )}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                          disabled={isUpdating[item.productId]}
                          className="w-9 h-9 flex items-center justify-center hover:bg-gray-200 rounded-r-xl transition-colors disabled:opacity-50"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900">
                          {(item.price * item.quantity).toFixed(0)} <span className="text-sm font-normal">Dt</span>
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-sm text-gray-500">{item.price} Dt × {item.quantity}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Continue Shopping */}
            <Link 
              to="/products" 
              className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-500 hover:text-primary-600 hover:border-primary-300 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Ajouter d'autres produits
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Résumé</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sous-total ({cart.products.length} articles)</span>
                  <span className="font-semibold">{cart.total.toFixed(0)} Dt</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Livraison</span>
                  {shipping === 0 ? (
                    <span className="text-green-600 font-semibold flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      Gratuite
                    </span>
                  ) : (
                    <span className="font-semibold">{shipping} Dt</span>
                  )}
                </div>
                
                {shipping > 0 && (
                  <div className="bg-amber-50 text-amber-700 text-sm p-3 rounded-xl">
                    Ajoutez {(500 - cart.total).toFixed(0)} Dt pour la livraison gratuite
                  </div>
                )}
              </div>
              
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-black text-primary-600">{total.toFixed(0)} Dt</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/25 flex items-center justify-center gap-2"
              >
                Commander
                <ArrowRight className="h-5 w-5" />
              </button>
              
              <p className="text-center text-sm text-gray-500 mt-3">
                💰 Paiement à la livraison
              </p>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Shield className="h-4 w-4 text-green-600" />
                  </div>
                  <span>Garantie 1 an sur tous les produits</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Truck className="h-4 w-4 text-blue-600" />
                  </div>
                  <span>Livraison rapide 24-48h</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Package className="h-4 w-4 text-purple-600" />
                  </div>
                  <span>Produits 100% originaux</span>
                </div>
              </div>

              {/* WhatsApp Support */}
              <div className="mt-6 pt-6 border-t">
                <WhatsAppOrderSupport cart={cart} type="cart" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
