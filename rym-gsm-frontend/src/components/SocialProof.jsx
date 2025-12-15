import { useState, useEffect } from 'react';
import { X, ShoppingBag, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const RECENT_PURCHASES = [
  { name: 'Ahmed', location: 'Tunis', product: 'Samsung Galaxy A56 5G', time: 'il y a 2 minutes' },
  { name: 'Sarah', location: 'Nabeul', product: 'PC Portable HP 15-fd1070nk Ultra 5 125H 16Go 512Go SSD', time: 'il y a 5 minutes' },
  { name: 'Mohamed', location: 'Sousse', product: 'Redmi Note 14', time: 'il y a 12 minutes' },
  { name: 'Amira', location: 'Ariana', product: 'Infinix Hot 40', time: 'il y a 25 minutes' },
  { name: 'Youssef', location: 'Sfax', product: 'OPPO Reno 14f', time: 'il y a 40 minutes' },
  { name: 'Mariem', location: 'Bizerte', product: 'Samsung Galaxy S25 FE', time: 'il y a 1 heure' },
  { name: 'Karim', location: 'Monastir', product: 'Xiaomi Sound Outdoor', time: 'il y a 1 heure' },
  { name: 'Salma', location: 'Hammamet', product: 'Galaxy Watch 8', time: 'il y a 2 heures' }
];

const SocialProof = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    // Initial delay
    const initialTimeout = setTimeout(() => {
      showRandomNotification();
    }, 10000);

    // Periodic notifications
    const interval = setInterval(() => {
      showRandomNotification();
    }, 45000); // Show every 45 seconds

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  const showRandomNotification = () => {
    const random = RECENT_PURCHASES[Math.floor(Math.random() * RECENT_PURCHASES.length)];
    setNotification(random);
    setIsVisible(true);

    // Hide after 6 seconds
    setTimeout(() => {
      setIsVisible(false);
    }, 6000);
  };

  if (!isVisible || !notification) return null;

  return (
    <div className="fixed bottom-24 left-4 z-50 max-w-sm animate-slide-up-fade">
      <div className="bg-white rounded-xl shadow-xl p-4 border border-gray-100 flex items-start gap-4 relative overflow-hidden">
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 h-1 bg-primary-500 animate-progress-bar w-full"></div>
        
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="bg-primary-50 p-3 rounded-lg flex-shrink-0">
          <ShoppingBag className="h-6 w-6 text-primary-600" />
        </div>

        <div className="pr-6">
          <p className="text-sm text-gray-900 font-medium">
            <span className="font-bold">{notification.name}</span> de {notification.location}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            a acheté <span className="text-primary-600 font-medium">{notification.product}</span>
          </p>
          <div className="flex items-center mt-2 text-xs text-gray-500">
            <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
            <span>Vérifié {notification.time}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialProof;
