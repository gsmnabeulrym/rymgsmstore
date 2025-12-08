import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Minus, Plus, Trash2, ShoppingBag, ArrowRight, 
  Heart, Share2, Shield, Truck, CreditCard, 
  Sparkles, CheckCircle, XCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import WhatsAppOrderSupport from '../components/WhatsAppOrderSupport';
import api from '../config/api';
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-32 h-32 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <ShoppingBag className="h-16 w-16 text-primary-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Veuillez vous Connecter</h1>
          <p className="text-lg text-gray-600 mb-8">Vous devez être connecté pour voir votre panier</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="btn-primary"
            >
              Connexion
            </Link>
            <Link
              to="/register"
              className="btn-secondary"
            >
              S'inscrire
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.products.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-32 h-32 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <ShoppingBag className="h-16 w-16 text-primary-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Votre Panier est Vide</h1>
          <p className="text-lg text-gray-600 mb-8">Ajoutez des produits pour commencer</p>
          <Link
            to="/products"
            className="btn-primary inline-flex items-center"
          >
            <ArrowRight className="h-5 w-5 mr-2" />
            Continuer vos Achats
          </Link>
        </div>
      </div>
    );
  }

  const shipping = cart.total > 100 ? 0 : 10;
  const tax = cart.total * 0.08;
  const total = cart.total + shipping + tax;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Panier <span className="gradient-text">d'Achat</span>
          </h1>
          <p className="text-xl text-gray-600">
            Vérifiez vos articles avant le paiement
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/20">
              <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-purple-50">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <ShoppingBag className="h-6 w-6 mr-3 text-primary-500" />
                    Articles du Panier ({cart.products.length})
                  </h2>
                  <button
                    onClick={handleClearCart}
                    className="text-red-600 hover:text-red-700 font-semibold transition-colors duration-200 flex items-center"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Vider le Panier
                  </button>
                </div>
              </div>
              
              <div className="divide-y divide-gray-100">
                {cart.products.map((item, index) => (
                  <div key={item.productId} className="p-8 hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-center space-x-6">
                      <div className="flex-shrink-0 relative group">
                        <img
                          src={item.images?.[0] || `https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=120&h=120&fit=crop`}
                          alt={item.name}
                          className="h-24 w-24 object-cover rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          {item.quantity}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {item.name}
                        </h3>
                        <p className="text-gray-600 mb-2">
                          {item.price} Dt each
                        </p>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-500">Marque: {item.brand || 'Inconnue'}</span>
                          <span className="text-sm text-gray-500">Catégorie: {item.category || 'Inconnue'}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                          disabled={isUpdating[item.productId] || item.quantity <= 1}
                          className="w-10 h-10 rounded-xl border-2 border-gray-200 flex items-center justify-center hover:border-primary-300 hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        
                        <span className="w-16 text-center text-lg font-bold">
                          {isUpdating[item.productId] ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-500 mx-auto"></div>
                          ) : (
                            item.quantity
                          )}
                        </span>
                        
                        <button
                          onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                          disabled={isUpdating[item.productId]}
                          className="w-10 h-10 rounded-xl border-2 border-gray-200 flex items-center justify-center hover:border-primary-300 hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary-600 mb-2">
                          {(item.price * item.quantity).toFixed(2)} Dt
                        </p>
                        <button
                          onClick={() => handleRemoveItem(item.productId)}
                          className="text-red-600 hover:text-red-700 font-semibold transition-colors duration-200 flex items-center"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Retirer
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 sticky top-8 border border-white/20">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <CreditCard className="h-6 w-6 mr-3 text-primary-500" />
                Résumé de la Commande
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-lg">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="text-gray-900 font-semibold">{cart.total.toFixed(2)} Dt</span>
                </div>
                
                <div className="flex justify-between text-lg">
                  <span className="text-gray-600">Livraison</span>
                  <span className="text-gray-900 font-semibold">
                    {shipping === 0 ? (
                      <span className="text-green-600 flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Gratuit
                      </span>
                    ) : (
                      `${shipping.toFixed(2)} Dt`
                    )}
                  </span>
                </div>
                
                <div className="flex justify-between text-lg">
                  <span className="text-gray-600">Taxe</span>
                  <span className="text-gray-900 font-semibold">{tax.toFixed(2)} Dt</span>
                </div>
                
                <div className="border-t-2 border-gray-200 pt-4">
                  <div className="flex justify-between text-2xl font-bold">
                    <span className="text-gray-900">Total</span>
                    <span className="text-primary-600">{total.toFixed(2)} Dt</span>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="mt-8 space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Shield className="h-4 w-4 mr-2 text-green-500" />
                  <span>Garantie 2 ans incluse</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Truck className="h-4 w-4 mr-2 text-blue-500" />
                  <span>Livraison gratuite sur les commandes de plus de 300 Dt</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Sparkles className="h-4 w-4 mr-2 text-purple-500" />
                  <span>Politique de retour de 30 jours</span>
                </div>
              </div>
              
              <button
                onClick={handleCheckout}
                className="w-full mt-8 btn-primary py-4 text-lg font-semibold"
              >
                Commander Maintenant
              </button>
              
              <p className="text-xs text-gray-500 text-center mt-2">
                💰 Paiement à la livraison - Nous vous appellerons pour confirmer
              </p>
              
              <Link
                to="/products"
                className="block w-full mt-4 text-center btn-secondary py-3"
              >
                Continuer vos Achats
              </Link>

              {/* WhatsApp Support */}
              <div className="mt-6 pt-6 border-t border-gray-200">
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