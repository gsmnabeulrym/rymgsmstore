import { useQuery } from '@tanstack/react-query';
import { 
  Package, Calendar, Eye, Truck, 
  CheckCircle, Clock, XCircle, ArrowRight,
  MapPin, Phone, Mail, Star, Sparkles, Banknote
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import WhatsAppOrderSupport from '../components/WhatsAppOrderSupport';
import api from '../config/api';

const Orders = () => {
  const { isAuthenticated } = useAuth();

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['user-orders'],
    queryFn: () => api.get('/orders/my-orders').then(res => res.data),
    enabled: isAuthenticated
  });

  const orders = ordersData?.orders || [];

  // Handle malformed order data
  const safeOrders = orders.map(order => ({
    ...order,
    total: parseFloat(order.total || 0),
    products: Array.isArray(order.products) ? order.products : []
  }));

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending':
        return 'En attente de confirmation';
      case 'confirmed':
        return 'Confirm\u00e9e';
      case 'shipped':
        return 'Exp\u00e9di\u00e9e';
      case 'delivered':
        return 'Livr\u00e9e';
      case 'cancelled':
        return 'Annul\u00e9e';
      default:
        return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-32 h-32 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <Package className="h-16 w-16 text-primary-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Veuillez vous Connecter</h1>
          <p className="text-lg text-gray-600 mb-8">Vous devez être connecté pour voir vos commandes</p>
          <Link
            to="/login"
            className="btn-primary"
          >
            Connexion
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de vos commandes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Mes <span className="gradient-text">Commandes</span>
          </h1>
          <p className="text-xl text-gray-600">
            Suivez et gérez vos commandes
          </p>
        </div>

        {safeOrders.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <Package className="h-16 w-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Aucune Commande</h3>
            <p className="text-lg text-gray-600 mb-8">Vous n'avez pas encore passé de commande</p>
            <Link
              to="/products"
              className="btn-primary inline-flex items-center"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Commencer vos Achats
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {safeOrders.map((order, index) => (
              <div 
                key={order.id} 
                className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/20 hover:shadow-3xl transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Order Header */}
                <div className="px-8 py-6 bg-gradient-to-r from-primary-50 to-purple-50 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
                        <Package className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">
                          Commande #{order.id}
                        </h3>
                        <div className="flex items-center text-gray-600 mt-1">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span className="text-sm">{formatDate(order.created_at)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:items-end mt-4 sm:mt-0">
                      <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border-2 ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-2">{getStatusLabel(order.status)}</span>
                      </span>
                      <div className="flex items-center text-2xl font-bold text-primary-600 mt-2">
                        <Banknote className="h-6 w-6 mr-1" />
                        {order.total.toFixed(2)} Dt
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Products */}
                <div className="px-8 py-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Articles Commandés</h4>
                  <div className="space-y-4">
                    {order.products.map((product, productIndex) => (
                      <div key={productIndex} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                        <img
                          src={product.image || `https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=80&h=80&fit=crop`}
                          alt={product.name}
                          className="h-16 w-16 object-cover rounded-lg shadow-md"
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="text-lg font-semibold text-gray-900 truncate">
                            {product.name}
                          </h5>
                          <p className="text-gray-600">
                            Quantité: {product.quantity} × {parseFloat(product.price || 0).toFixed(2)} Dt
                          </p>
                          <div className="flex items-center mt-1">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500 ml-2">(4.8)</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-gray-900">
                            {(parseFloat(product.price || 0) * product.quantity).toFixed(2)} Dt
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Address */}
                  {order.shipping_address && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                        <MapPin className="h-5 w-5 mr-2 text-blue-500" />
                        Adresse de Livraison
                      </h4>
                      <p className="text-gray-700">
                        {order.shipping_address}
                      </p>
                    </div>
                  )}

                  {/* Order Actions */}
                  <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Truck className="h-4 w-4 mr-2" />
                        <span>Livraison estimée: 3-5 jours ouvrables</span>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <Link
                        to={`/orders/${order.id}`}
                        className="btn-secondary flex items-center"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Voir les Détails
                      </Link>
                      {order.status === 'delivered' && (
                        <button className="btn-primary flex items-center">
                          <Star className="h-4 w-4 mr-2" />
                          Évaluer la Commande
                        </button>
                      )}
                    </div>
                  </div>

                  {/* WhatsApp Order Support */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <WhatsAppOrderSupport order={order} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        {safeOrders.length > 0 && (
          <div className="mt-12 text-center">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Besoin d'Aide ?</h3>
              <p className="text-gray-600 mb-6">Notre équipe de support client est là pour vous aider avec toutes vos questions concernant vos commandes.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contact"
                  className="btn-primary inline-flex items-center"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  Contacter le Support
                </Link>
                <Link
                  to="/products"
                  className="btn-secondary inline-flex items-center"
                >
                  <ArrowRight className="h-5 w-5 mr-2" />
                  Continuer vos Achats
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;