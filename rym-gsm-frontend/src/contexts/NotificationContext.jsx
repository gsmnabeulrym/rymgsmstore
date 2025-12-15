import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../config/api';
import toast from 'react-hot-toast';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    orderUpdates: true,
    stockAlerts: true,
    priceDrops: true,
    newProducts: false,
    promotions: true
  });
  const { isAuthenticated, user } = useAuth();

  // Load notifications when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      fetchPreferences();
      // Set up polling for new notifications every 30 seconds (reduced from 2s to prevent excessive refreshing)
      const interval = setInterval(() => fetchNotifications(true), 30000);
      
      // Also refresh when window gains focus
      const handleFocus = () => {
        console.log('🔄 Window focused - refreshing notifications');
        fetchNotifications(true);
      };
      
      window.addEventListener('focus', handleFocus);
      
      return () => {
        clearInterval(interval);
        window.removeEventListener('focus', handleFocus);
      };
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [isAuthenticated]);

  // Fetch notifications from server
  const fetchNotifications = async (isBackground = false) => {
    if (!isAuthenticated) return;
    
    if (!isBackground) setIsLoading(true);
    try {
      // Add cache-busting parameter to force fresh data
      const response = await api.get(`/notifications?_t=${Date.now()}`);
      const notificationData = response.data.notifications || [];
      // Only log on initial load to reduce console noise
      if (!isBackground) console.log('🔔 Fetched notifications:', notificationData.length, 'total');
      setNotifications(notificationData);
      const unreadCount = notificationData.filter(n => !n.read_status).length;
      setUnreadCount(unreadCount);
      // Only log on initial load
      if (!isBackground) console.log('📊 Unread count:', unreadCount);
    } catch (error) {
      console.error('❌ Error fetching notifications:', error);
      // Set empty state for errors
      if (!isBackground) {
        setNotifications([]);
        setUnreadCount(0);
      }
    } finally {
      if (!isBackground) setIsLoading(false);
    }
  };

  // Fetch user notification preferences
  const fetchPreferences = async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await api.get('/notifications/preferences');
      if (response.data.preferences) {
        setPreferences(response.data.preferences);
      }
    } catch (error) {
      // Silently handle 404 errors (table might not exist yet)
      if (error.response?.status !== 404) {
        console.error('Error fetching notification preferences:', error);
      }
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true }
            : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/mark-all-read');
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId) => {
    try {
      await api.delete(`/notifications/${notificationId}`);
      const notification = notifications.find(n => n.id === notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      if (notification && !notification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // Clear all notifications
  const clearAllNotifications = async () => {
    try {
      await api.delete('/notifications/clear-all');
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  // Update notification preferences
  const updatePreferences = async (newPreferences) => {
    try {
      await api.put('/notifications/preferences', newPreferences);
      setPreferences(newPreferences);
      toast.success('Notification preferences updated');
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Failed to update preferences');
    }
  };

  // Create notification (for admin or system use)
  const createNotification = async (notificationData) => {
    try {
      const response = await api.post('/notifications', notificationData);
      if (response.data.success) {
        await fetchNotifications(); // Refresh notifications
        return { success: true };
      }
    } catch (error) {
      console.error('Error creating notification:', error);
      return { success: false, message: error.response?.data?.message || 'Failed to create notification' };
    }
  };

  // Get notifications by type
  const getNotificationsByType = (type) => {
    return notifications.filter(notification => notification.type === type);
  };

  // Get recent notifications (last 24 hours)
  const getRecentNotifications = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    return notifications.filter(notification => 
      new Date(notification.created_at) > yesterday
    );
  };

  // Show toast notification for new notifications
  const showToastNotification = (notification) => {
    const toastOptions = {
      duration: 5000,
      position: 'top-right',
    };

    switch (notification.type) {
      case 'order_update':
        toast.success(notification.title, toastOptions);
        break;
      case 'stock_alert':
        toast(notification.title, { ...toastOptions, icon: '📦' });
        break;
      case 'price_drop':
        toast.success(notification.title, { ...toastOptions, icon: '💰' });
        break;
      case 'promotion':
        toast(notification.title, { ...toastOptions, icon: '🎁' });
        break;
      default:
        toast(notification.title, toastOptions);
    }
  };

  // Simulate real-time notification (in a real app, this would come from WebSocket or SSE)
  const simulateNotification = (type, title, message, data = {}) => {
    const newNotification = {
      id: Date.now(),
      type,
      title,
      message,
      data,
      read: false,
      created_at: new Date().toISOString()
    };

    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
    showToastNotification(newNotification);
  };

  const value = {
    notifications,
    unreadCount,
    isLoading,
    preferences,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    updatePreferences,
    createNotification,
    getNotificationsByType,
    getRecentNotifications,
    simulateNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
