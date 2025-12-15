import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, Edit, Trash2, Eye, Search, Filter, 
  Bell, Gift, AlertTriangle, Package, TrendingDown, 
  Calendar, Users, TrendingUp, Star, MessageSquare, StopCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../config/api';
import toast from 'react-hot-toast';

const AdminNotifications = () => {
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewingNotification, setViewingNotification] = useState(null);

  // Fetch all notifications
  const { data: notificationsData, isLoading } = useQuery({
    queryKey: ['admin-notifications', searchTerm, selectedType],
    queryFn: async () => {
      const response = await api.get('/admin/notifications/all', {
        params: { search: searchTerm, type: selectedType }
      });
      return response.data;
    },
    enabled: isAdmin
  });

  // Fetch notification statistics
  const { data: statsData } = useQuery({
    queryKey: ['notification-stats'],
    queryFn: async () => {
      const response = await api.get('/admin/notifications/stats');
      return response.data;
    },
    enabled: isAdmin
  });

  // Fetch products for promotion selection
  const { data: productsData } = useQuery({
    queryKey: ['promotion-products'],
    queryFn: async () => {
      const response = await api.get('/admin/notifications/products');
      return response.data;
    },
    enabled: isAdmin
  });

  // Create notification mutation
  const createNotificationMutation = useMutation({
    mutationFn: (notificationData) => api.post('/admin/notifications', notificationData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notification-stats'] });
      setShowCreateModal(false);
      toast.success('Notification created successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create notification');
    }
  });

  // End promotion mutation
  const endPromotionMutation = useMutation({
    mutationFn: (notificationId) => api.post(`/admin/notifications/${notificationId}/end-promotion`),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notification-stats'] });
      toast.success(response.data.message || 'Promotion ended successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to end promotion');
    }
  });

  const handleCreateNotification = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const type = formData.get('type');
    const title = formData.get('title');
    const message = formData.get('message');
    const targetUsers = formData.get('targetUsers') || 'all';
    
    let data = {};
    
    if (type === 'promotion') {
      const selectedProductId = formData.get('selectedProduct');
      const salePrice = parseFloat(formData.get('salePrice')) || 0;
      const discount = parseInt(formData.get('discount')) || 0;
      
      console.log('🔍 Form Debug:', {
        selectedProductId,
        selectedProductIdType: typeof selectedProductId,
        salePrice,
        salePriceType: typeof salePrice,
        discount,
        type,
        condition1: selectedProductId && salePrice > 0,
        condition2: discount > 0
      });
      
      data = {
        validUntil: formData.get('validUntil'),
        isPromotion: true
      };
      
      // If specific product is selected
      if (selectedProductId && salePrice > 0) {
        data.productId = parseInt(selectedProductId);
        data.salePrice = salePrice;
        console.log('✅ Product promotion data:', data);
      } else if (discount > 0) {
        // General promotion with discount percentage
        data.discount = discount;
        console.log('✅ General promotion data:', data);
      } else {
        console.log('❌ No valid promotion data found');
      }
    } else if (type === 'system') {
      data = {
        isSystemUpdate: true,
        isUrgent: formData.get('isUrgent') === 'on'
      };
    }
    
    const notificationData = {
      type,
      title,
      message,
      targetUsers,
      data
    };
    
    console.log('🚀 Sending notification data:', notificationData);
    
    createNotificationMutation.mutate(notificationData);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'promotion': return <Gift className="w-4 h-4 text-green-600" />;
      case 'new_product': return <Package className="w-4 h-4 text-blue-600" />;
      case 'price_drop': return <TrendingDown className="w-4 h-4 text-orange-600" />;
      case 'stock_alert': return <TrendingUp className="w-4 h-4 text-purple-600" />;
      case 'system': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTypeBadgeColor = (type) => {
    switch (type) {
      case 'promotion': return 'bg-green-100 text-green-800';
      case 'new_product': return 'bg-blue-100 text-blue-800';
      case 'price_drop': return 'bg-orange-100 text-orange-800';
      case 'stock_alert': return 'bg-purple-100 text-purple-800';
      case 'system': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatNotificationData = (notification) => {
    try {
      const data = typeof notification.data === 'string' ? JSON.parse(notification.data || '{}') : (notification.data || {});
      if (notification.type === 'promotion') {
        if (data.productName) {
          return `🏷️ ${data.productBrand} ${data.productName}\n💰 ${data.originalPrice} Dt → ${data.salePrice} Dt\n💸 Save ${data.savings} Dt (${data.discount}% off!)`;
        } else if (data.originalPrice && data.salePrice) {
          return `${data.originalPrice} Dt → ${data.salePrice} Dt Save ${data.savings} Dt`;
        } else if (data.discount) {
          return `${data.discount}% discount`;
        }
      }
      return JSON.stringify(data, null, 2);
    } catch {
      return notification.data || 'No additional data';
    }
  };

  const handleNotificationClick = (notification) => {
    try {
      const data = typeof notification.data === 'string' ? JSON.parse(notification.data || '{}') : (notification.data || {});
      if (data.productId) {
        // Open product page in new tab
        window.open(`/products/${data.productId}`, '_blank');
      } else {
        // Just view notification details
        setViewingNotification(notification);
      }
    } catch {
      setViewingNotification(notification);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications & Promotions</h1>
          <p className="text-gray-600">Manage all notifications, promotions, and system announcements</p>
        </div>

        {/* Statistics Cards */}
        {statsData && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Bell className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Notifications</p>
                  <p className="text-2xl font-bold text-gray-900">{statsData.total || 0}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Gift className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Promotions</p>
                  <p className="text-2xl font-bold text-gray-900">{statsData.promotions || 0}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Users Notified</p>
                  <p className="text-2xl font-bold text-gray-900">{statsData.usersNotified || 0}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-gray-900">{statsData.thisMonth || 0}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search notifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">All Types</option>
                    <option value="promotion">Promotions</option>
                    <option value="new_product">New Products</option>
                    <option value="price_drop">Price Drops</option>
                    <option value="stock_alert">Stock Alerts</option>
                    <option value="system">System</option>
                  </select>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create Notification
              </button>
            </div>
          </div>
        </div>

        {/* Notifications Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading notifications...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title & Message
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {notificationsData?.notifications?.map((notification) => {
                    const data = typeof notification.data === 'string' ? JSON.parse(notification.data || '{}') : (notification.data || {});
                    const hasProduct = data.productId;
                    
                    return (
                      <tr 
                        key={notification.id} 
                        className={`hover:bg-gray-50 ${hasProduct ? 'cursor-pointer' : ''}`}
                        onClick={() => hasProduct && handleNotificationClick(notification)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getTypeIcon(notification.type)}
                            <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getTypeBadgeColor(notification.type)}`}>
                              {notification.type}
                            </span>
                            {hasProduct && (
                              <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                🔗 Product Link
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="max-w-xs">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {notification.message.split('\n')[0]}
                            </p>
                            {data.productName && (
                              <p className="text-xs text-blue-600 font-medium">
                                🏷️ {data.productBrand} {data.productName}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-xs text-gray-500 max-w-xs">
                            <div className="bg-gray-100 p-2 rounded text-xs whitespace-pre-line">
                              {formatNotificationData(notification)}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>
                            <p className="font-medium">{notification.user_name || 'All Users'}</p>
                            <p className="text-xs">{notification.user_email || ''}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(notification.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setViewingNotification(notification);
                              }}
                              className="text-blue-600 hover:text-blue-900"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            
                            {/* End Promotion Button - only for active product promotions */}
                            {notification.type === 'promotion' && data.productId && !data.ended && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (confirm(`End promotion for ${data.productName || 'this product'}? This will restore the original price.`)) {
                                    endPromotionMutation.mutate(notification.id);
                                  }
                                }}
                                className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-1 rounded"
                                title="End Promotion & Restore Price"
                                disabled={endPromotionMutation.isPending}
                              >
                                <StopCircle className="w-4 h-4" />
                              </button>
                            )}
                            
                            
                            {/* Show ended status */}
                            {notification.type === 'promotion' && data.ended && (
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                Ended
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Create Notification Modal */}
        {showCreateModal && (
          <CreateNotificationModal
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreateNotification}
            isLoading={createNotificationMutation.isPending}
            products={productsData?.products || []}
          />
        )}

        {/* View Notification Modal */}
        {viewingNotification && (
          <ViewNotificationModal
            notification={viewingNotification}
            onClose={() => setViewingNotification(null)}
          />
        )}
      </div>
    </div>
  );
};

// Create Notification Modal Component
const CreateNotificationModal = ({ onClose, onSubmit, isLoading, products }) => {
  const [selectedType, setSelectedType] = useState('promotion');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productSearch, setProductSearch] = useState('');
  
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    product.brand.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Create New Notification</h2>
        </div>
        
        <form onSubmit={onSubmit} className="p-6 space-y-6">
          {/* Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notification Type
            </label>
            <select
              name="type"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="promotion">🎉 Promotion</option>
              <option value="system">📢 System Announcement</option>
              <option value="new_product">📦 New Product</option>
              <option value="price_drop">💰 Price Drop</option>
              <option value="stock_alert">📈 Stock Alert</option>
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              placeholder="e.g., Black Friday Sale - 40% Off!"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              name="message"
              rows={3}
              placeholder="e.g., Don't miss our biggest sale of the year! Get up to 40% off on all smartphones..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Promotion-specific fields */}
          {selectedType === 'promotion' && (
            <>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-green-900 mb-3">🎯 Select Product for Promotion</h3>
                
                {/* Product Search */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-green-700 mb-2">
                    Search Products
                  </label>
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search by product name or brand..."
                    className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                {/* Product Selection */}
                <div className="max-h-48 overflow-y-auto border border-green-200 rounded-lg">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                      className={`p-3 border-b border-green-100 cursor-pointer hover:bg-green-100 flex items-center space-x-3 ${
                        selectedProduct?.id === product.id ? 'bg-green-200' : ''
                      }`}
                    >
                      {product.image && (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{product.brand} {product.name}</p>
                        <p className="text-sm text-gray-600">{product.category}</p>
                        <p className="text-sm font-bold text-green-600">{product.price} Dt</p>
                      </div>
                      {selectedProduct?.id === product.id && (
                        <div className="text-green-600">✓</div>
                      )}
                    </div>
                  ))}
                </div>
                
                {selectedProduct && (
                  <div className="mt-4 p-3 bg-white rounded-lg border border-green-300">
                    <p className="text-sm font-medium text-green-800">
                      Selected: {selectedProduct.brand} {selectedProduct.name} - {selectedProduct.price} Dt
                    </p>
                  </div>
                )}
                
                <input type="hidden" name="selectedProduct" value={selectedProduct?.id || ''} />
                
                {/* Debug info */}
                <div className="mt-2 p-2 bg-yellow-50 rounded text-xs">
                  <strong>Debug:</strong> selectedProduct ID = {selectedProduct?.id || 'NONE'}
                </div>
              </div>
              
              {selectedProduct ? (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-3">💰 Set Promotion Price</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">
                        Current Price
                      </label>
                      <input
                        type="text"
                        value={`${selectedProduct.price} Dt`}
                        disabled
                        className="w-full px-3 py-2 border border-blue-300 rounded-lg bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">
                        New Sale Price (Dt) *
                      </label>
                      <input
                        type="number"
                        name="salePrice"
                        step="0.01"
                        placeholder="Enter new price"
                        max={selectedProduct.price}
                        className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-medium text-orange-900 mb-3">📢 General Promotion</h3>
                  <div>
                    <label className="block text-sm font-medium text-orange-700 mb-2">
                      Discount Percentage (%)
                    </label>
                    <input
                      type="number"
                      name="discount"
                      min="1"
                      max="100"
                      placeholder="e.g., 40"
                      className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valid Until (Optional)
                </label>
                <input
                  type="date"
                  name="validUntil"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </>
          )}

          {/* System-specific fields */}
          {selectedType === 'system' && (
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isUrgent"
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span className="ml-2 text-sm text-gray-700">Mark as urgent</span>
              </label>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create Notification'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// View Notification Modal Component
const ViewNotificationModal = ({ notification, onClose }) => {
  const data = typeof notification.data === 'string' ? JSON.parse(notification.data || '{}') : (notification.data || {});

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Notification Details</h2>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <p className="mt-1 text-sm text-gray-900">{notification.type}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <p className="mt-1 text-sm text-gray-900">{notification.title}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <p className="mt-1 text-sm text-gray-900">{notification.message}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Additional Data</label>
            <pre className="mt-1 text-xs text-gray-600 bg-gray-100 p-3 rounded-lg overflow-x-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Created</label>
            <p className="mt-1 text-sm text-gray-900">
              {new Date(notification.created_at).toLocaleString()}
            </p>
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;
