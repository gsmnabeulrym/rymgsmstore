import React from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';
import { Bell, Package, TrendingDown, Gift, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const NotificationTester = () => {
  const { simulateNotification } = useNotifications();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  const testNotifications = [
    {
      type: 'order_update',
      title: 'Order Confirmed',
      message: 'Your order #1001 has been confirmed and is being processed.',
      icon: Package
    },
    {
      type: 'stock_alert',
      title: 'Back in Stock',
      message: 'iPhone 15 Pro is now back in stock! Get it before it runs out again.',
      icon: AlertCircle
    },
    {
      type: 'price_drop',
      title: 'Price Drop Alert',
      message: 'Great news! Samsung Galaxy S24 price has dropped to 2499 Dt (was 2799 Dt).',
      icon: TrendingDown
    },
    {
      type: 'promotion',
      title: 'Special Offer',
      message: 'Don\'t miss out! Winter Sale - Save up to 30% on selected smartphones.',
      icon: Gift
    }
  ];

  const handleTestNotification = (notification) => {
    simulateNotification(
      notification.type,
      notification.title,
      notification.message,
      { productId: 1, orderId: 1001 }
    );
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-4 border border-gray-200 max-w-xs">
        <div className="flex items-center mb-3">
          <Bell className="w-5 h-5 text-primary-500 mr-2" />
          <h3 className="font-semibold text-gray-900">Test Notifications</h3>
        </div>
        <div className="space-y-2">
          {testNotifications.map((notification, index) => {
            const Icon = notification.icon;
            return (
              <button
                key={index}
                onClick={() => handleTestNotification(notification)}
                className="w-full text-left p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center text-sm"
              >
                <Icon className="w-4 h-4 mr-2 text-gray-500" />
                {notification.type.replace('_', ' ')}
              </button>
            );
          })}
        </div>
        <div className="mt-3 pt-3 border-t border-gray-200">
          <button
            onClick={() => toast.success('Notification system is working! 🔔')}
            className="w-full text-xs text-primary-600 hover:text-primary-700 font-medium"
          >
            Test Toast
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationTester;
