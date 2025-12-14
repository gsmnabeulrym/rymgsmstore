import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { 
  ArrowLeft, ShoppingBag, User, MapPin, Phone, Mail,
  Truck, Shield, CheckCircle, Package, CreditCard,
  ChevronRight, Clock, Check
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import api from '../config/api';
import toast from 'react-hot-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: 'Nabeul',
    postalCode: '8000',
    country: 'Tunisia'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const createOrder = async (orderData) => {
    try {
      const response = await api.post('/orders', orderData);
      if (response.data.success) {
        await clearCart();
        queryClient.invalidateQueries(['user-orders']);
        toast.success('Commande envoyée ! Nous vous appellerons bientôt. 📞');
        setIsProcessing(false);
        navigate('/orders');
      } else {
        throw new Error(response.data.message || 'Échec de la commande');
      }
    } catch (error) {
      let errorMessage = 'Échec de la commande';
      if (error.response?.status === 401) {
        errorMessage = 'Veuillez vous connecter';
        navigate('/login');
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      toast.error(errorMessage);
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.address) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (!user) {
      toast.error('Veuillez vous connecter');
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Votre panier est vide');
      return;
    }

    setIsProcessing(true);
    
    const orderData = {
      items: cartItems.map(item => ({
        productId: item.product?.id || item.id || item.productId,
        quantity: item.quantity,
        price: item.product?.price || item.price,
        name: item.product?.name || item.name,
        image: item.image || item.product?.images?.[0] || item.images?.[0] || ''
      })),
      shippingAddress: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country
      },
      paymentMethod: 'cash',
      totalAmount: totalWithShipping,
      status: 'pending'
    };

    await createOrder(orderData);
  };

  const cartTotal = cart?.total || 0;
  const cartItems = cart?.products || [];
  const shippingCost = cartTotal > 500 ? 0 : 7;
  const totalWithShipping = cartTotal + shippingCost;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Panier vide</h2>
          <p className="text-gray-600 mb-6">Ajoutez des produits avant de commander</p>
          <Link to="/products" className="btn-primary inline-flex items-center gap-2">
            Voir les produits
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    );
  }

  const steps = [
    { id: 1, name: 'Informations', icon: User },
    { id: 2, name: 'Livraison', icon: Truck },
    { id: 3, name: 'Confirmation', icon: CheckCircle }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate('/cart')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5" />
              <span className="hidden sm:inline">Retour</span>
            </button>
            <h1 className="text-lg font-bold">Finaliser la Commande</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center gap-2 ${currentStep >= step.id ? 'text-primary-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep > step.id 
                      ? 'bg-primary-500 text-white' 
                      : currentStep === step.id 
                        ? 'bg-primary-100 text-primary-600 border-2 border-primary-500' 
                        : 'bg-gray-100 text-gray-400'
                  }`}>
                    {currentStep > step.id ? <Check className="h-4 w-4" /> : <step.icon className="h-4 w-4" />}
                  </div>
                  <span className="hidden sm:inline text-sm font-medium">{step.name}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-2 ${currentStep > step.id ? 'bg-primary-500' : 'bg-gray-200'}`}></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Info */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <User className="h-5 w-5 text-primary-500" />
                  Informations de Contact
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Prénom *</label>
                    <input
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom *</label>
                    <input
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Téléphone *</label>
                    <input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+216 XX XXX XXX"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary-500" />
                  Adresse de Livraison
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Adresse complète *</label>
                    <input
                      name="address"
                      type="text"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Rue, numéro, appartement..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Ville *</label>
                      <input
                        name="city"
                        type="text"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Code Postal</label>
                      <input
                        name="postalCode"
                        type="text"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* How it Works */}
              <div className="bg-gradient-to-br from-primary-50 to-pink-50 rounded-2xl p-6">
                <h3 className="font-bold text-gray-900 mb-4">Comment ça marche ?</h3>
                <div className="space-y-3">
                  {[
                    { step: 1, title: 'Passez commande', desc: 'Remplissez vos informations' },
                    { step: 2, title: 'Nous vous appelons', desc: 'Pour confirmer votre commande' },
                    { step: 3, title: 'Livraison', desc: 'Payez à la réception' }
                  ].map((item) => (
                    <div key={item.step} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {item.step}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.title}</p>
                        <p className="text-sm text-gray-600">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/25 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    Confirmer la Commande
                    <ChevronRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-32">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Votre Commande</h2>
              
              {/* Items */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.productId || item.id} className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={item.image || item.images?.[0] || item.product?.images?.[0] || '/placeholder.jpg'}
                        alt={item.name || item.product?.name}
                        className="w-full h-full object-contain p-1"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
                        {item.name || item.product?.name}
                      </h3>
                      <p className="text-xs text-gray-500">Qté: {item.quantity}</p>
                    </div>
                    <div className="text-sm font-bold text-gray-900">
                      {((item.price || item.product?.price) * item.quantity).toFixed(0)} Dt
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="font-medium">{cartTotal.toFixed(0)} Dt</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Livraison</span>
                  {shippingCost === 0 ? (
                    <span className="text-green-600 font-medium">Gratuite</span>
                  ) : (
                    <span className="font-medium">{shippingCost} Dt</span>
                  )}
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-3">
                  <span>Total</span>
                  <span className="text-primary-600">{totalWithShipping.toFixed(0)} Dt</span>
                </div>
              </div>

              {/* Payment Info */}
              <div className="mt-6 p-4 bg-green-50 rounded-xl">
                <div className="flex items-center gap-2 text-green-700">
                  <CreditCard className="h-5 w-5" />
                  <span className="font-medium">Paiement à la livraison</span>
                </div>
                <p className="text-sm text-green-600 mt-1">Payez en espèces à la réception</p>
              </div>

              {/* Trust */}
              <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Shield className="h-4 w-4" />
                  Sécurisé
                </div>
                <div className="flex items-center gap-1">
                  <Truck className="h-4 w-4" />
                  24-48h
                </div>
                <div className="flex items-center gap-1">
                  <Package className="h-4 w-4" />
                  Original
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
