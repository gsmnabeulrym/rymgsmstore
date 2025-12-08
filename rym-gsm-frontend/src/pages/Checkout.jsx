import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Create order function
  const createOrder = async (orderData) => {
    try {
      console.log('=== FRONTEND ORDER CREATION ===');
      console.log('Order data:', JSON.stringify(orderData, null, 2));
      console.log('API base URL:', api.defaults.baseURL);
      console.log('User token exists:', !!localStorage.getItem('token'));
      
      // Test API connectivity first
      console.log('Testing API connectivity...');
      const healthCheck = await api.get('/health');
      console.log('API health check successful:', healthCheck.status);
      
      // Create the order
      console.log('Sending order creation request...');
      const response = await api.post('/orders', orderData);
      console.log('Order creation response:', response.data);
      
      if (response.data.success) {
        console.log('Order created successfully with ID:', response.data.order?.id);
        
        // Clear cart
        console.log('Clearing cart...');
        await clearCart();
        console.log('Cart cleared successfully');
        
        // Refresh data
        queryClient.invalidateQueries(['user-orders']);
        queryClient.invalidateQueries(['admin-orders']);
        queryClient.invalidateQueries(['admin-stats']);
        
        toast.success('Commande envoyée ! Nous vous appellerons bientôt pour confirmer. 📞');
        setIsProcessing(false);
        navigate('/orders');
      } else {
        throw new Error(response.data.message || 'Échec de la commande');
      }
    } catch (error) {
      console.error('=== ORDER CREATION ERROR ===');
      console.error('Error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      let errorMessage = 'Échec de la commande';
      if (error.response?.status === 401) {
        errorMessage = 'Veuillez vous connecter pour passer une commande';
        navigate('/login');
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.address) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Check if user is authenticated
    if (!user) {
      toast.error('Veuillez vous connecter pour passer une commande');
      navigate('/login');
      return;
    }

    // Check if cart has items
    if (cartItems.length === 0) {
      toast.error('Votre panier est vide');
      return;
    }

    setIsProcessing(true);
    
    // Prepare order data
    const orderData = {
      items: cartItems.map(item => ({
        productId: item.product?.id || item.id,
        quantity: item.quantity,
        price: item.product?.price || item.price,
        name: item.product?.name || item.name
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

    console.log('Submitting order with data:', orderData);
    console.log('User authenticated:', !!user);
    console.log('Cart items:', cartItems);

    // Call the order creation function
    await createOrder(orderData);
  };

  const cartTotal = cart?.total || 0;
  const cartItems = cart?.products || [];
  const shippingCost = cartTotal > 100 ? 0 : 7;
  const totalWithShipping = cartTotal + shippingCost;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Votre panier est vide</h2>
          <p className="text-gray-600 mb-6">Ajoutez des produits à votre panier avant de passer commande</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continuer vos Achats
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Retour au Panier
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Finaliser la Commande</h1>
          <p className="text-gray-600 mt-2">Remplissez vos informations et nous vous appellerons pour confirmer</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Shipping Information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">📍 Informations de Livraison</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom *
                    </label>
                    <input
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom *
                    </label>
                    <input
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone *
                    </label>
                    <input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+216 XX XXX XXX"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adresse *
                    </label>
                    <input
                      name="address"
                      type="text"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ville *
                    </label>
                    <input
                      name="city"
                      type="text"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Code Postal *
                    </label>
                    <input
                      name="postalCode"
                      type="text"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* How it Works */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">📋 Comment ça marche ?</h2>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">1</div>
                    <div>
                      <h3 className="font-medium text-gray-900">Passez votre commande</h3>
                      <p className="text-sm text-gray-600">Remplissez vos informations de contact et de livraison</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">2</div>
                    <div>
                      <h3 className="font-medium text-gray-900">Nous vous appelons</h3>
                      <p className="text-sm text-gray-600">Notre équipe vous contactera pour confirmer votre commande</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">3</div>
                    <div>
                      <h3 className="font-medium text-gray-900">Livraison à domicile</h3>
                      <p className="text-sm text-gray-600">Recevez votre commande et payez à la livraison</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm text-green-800 font-medium">
                    💰 Paiement à la livraison uniquement - Payez en espèces lorsque vous recevez votre commande
                  </p>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-medium text-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Envoi en cours...' : `Confirmer la Commande - ${totalWithShipping.toFixed(2)} Dt`}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Résumé de la Commande</h2>
              
              {/* Items */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.product?.id || item.id} className="flex items-center space-x-4">
                    <img
                      src={item.product?.images?.[0] || item.images?.[0] || 'https://images.unsplash.com/photo-1511707171631-9ed2a79be0f3?w=500'}
                      alt={item.product?.name || item.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{item.product?.name || item.name}</h3>
                      <p className="text-sm text-gray-500">{item.product?.brand || item.brand}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {((item.product?.price || item.price) * item.quantity).toFixed(2)} Dt
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="text-gray-900">{cartTotal.toFixed(2)} Dt</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">🚚 Livraison</span>
                  <span className="text-gray-900">
                    {shippingCost === 0 ? 'Gratuit' : `${shippingCost.toFixed(2)} Dt`}
                  </span>
                </div>
                {shippingCost === 0 && (
                  <p className="text-xs text-green-600">🎉 Livraison gratuite pour les commandes de plus de 100 Dt !</p>
                )}
                <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">{totalWithShipping.toFixed(2)} Dt</span>
                </div>
              </div>

              {/* Security Notice */}
              <div className="mt-6 p-4 bg-gray-50 rounded-md">
                <p className="text-xs text-gray-600 text-center">
                  🔒 Vos informations de commande sont sécurisées et cryptées
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
