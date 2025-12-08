import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Package, Calendar, Banknote, MapPin, CreditCard, Phone, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../config/api';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const { data: orderData, isLoading, error } = useQuery({
    queryKey: ['order-details', id],
    queryFn: () => api.get(`/orders/${id}`).then(res => res.data),
    enabled: isAuthenticated && !!id
  });

  const order = orderData?.order;

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const parseShippingAddress = (addressString) => {
    if (!addressString) return null;
    
    const lines = addressString.split('\n');
    return {
      name: lines[0] || '',
      address: lines[1] || '',
      cityPostal: lines[2] || '',
      country: lines[3] || '',
      phone: lines[4] || '',
      email: lines[5] || ''
    };
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h1>
          <p className="text-gray-600 mb-6">You need to be logged in to view order details</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-6">The order you're looking for doesn't exist or you don't have permission to view it</p>
          <button
            onClick={() => navigate('/orders')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const shippingInfo = parseShippingAddress(order.shipping_address);
  const products = Array.isArray(order.products) ? order.products : [];
  const orderTotal = parseFloat(order.total || 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/orders')}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Orders
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order #{order.id}</h1>
              <div className="flex items-center text-sm text-gray-600 mt-2">
                <Calendar className="h-4 w-4 mr-1" />
                Placed on {formatDate(order.created_at)}
              </div>
            </div>
            <div className="text-right">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
              <div className="flex items-center text-2xl font-bold text-gray-900 mt-2">
                <Banknote className="h-6 w-6 mr-1" />
                {orderTotal.toFixed(2)} Dt
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Order Items</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {products.map((product, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                      <img
                        src={product.image || 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=80&h=80&fit=crop'}
                        alt={product.name}
                        className="h-16 w-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                        <p className="text-sm text-gray-500">
                          Quantity: {product.quantity}
                        </p>
                        <p className="text-sm text-gray-500">
                          Price: {parseFloat(product.price || 0).toFixed(2)} Dt each
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900">
                          {(parseFloat(product.price || 0) * product.quantity).toFixed(2)} Dt
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-900">
                        {products.reduce((sum, product) => sum + (parseFloat(product.price || 0) * product.quantity), 0).toFixed(2)} Dt
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-gray-900">
                        {orderTotal > 100 ? 'Free' : '7.00 Dt'}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                      <span className="text-gray-900">Total</span>
                      <span className="text-gray-900">{orderTotal.toFixed(2)} Dt</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Info Sidebar */}
          <div className="space-y-6">
            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <CreditCard className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Payment Method</h3>
              </div>
              <p className="text-gray-600">
                {order.payment_method === 'cash' && '💰 Cash on Delivery'}
                {order.payment_method === 'card' && '💳 Credit/Debit Card'}
                {order.payment_method === 'bank' && '🏦 Bank Transfer'}
                {!order.payment_method && '💰 Cash on Delivery'}
              </p>
            </div>

            {/* Shipping Address */}
            {shippingInfo && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <MapPin className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Shipping Address</h3>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p className="font-medium text-gray-900">{shippingInfo.name}</p>
                  <p>{shippingInfo.address}</p>
                  <p>{shippingInfo.cityPostal}</p>
                  <p>{shippingInfo.country}</p>
                  {shippingInfo.phone && (
                    <div className="flex items-center mt-3">
                      <Phone className="h-4 w-4 mr-2" />
                      <span>{shippingInfo.phone.replace('Phone: ', '')}</span>
                    </div>
                  )}
                  {shippingInfo.email && (
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      <span>{shippingInfo.email.replace('Email: ', '')}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Order Status Timeline */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h3>
              <div className="space-y-3">
                <div className={`flex items-center ${order.status === 'pending' || order.status === 'shipped' || order.status === 'delivered' ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-3 h-3 rounded-full mr-3 ${order.status === 'pending' || order.status === 'shipped' || order.status === 'delivered' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                  <span className="text-sm">Order Placed</span>
                </div>
                <div className={`flex items-center ${order.status === 'shipped' || order.status === 'delivered' ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-3 h-3 rounded-full mr-3 ${order.status === 'shipped' || order.status === 'delivered' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                  <span className="text-sm">Order Shipped</span>
                </div>
                <div className={`flex items-center ${order.status === 'delivered' ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-3 h-3 rounded-full mr-3 ${order.status === 'delivered' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                  <span className="text-sm">Order Delivered</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
