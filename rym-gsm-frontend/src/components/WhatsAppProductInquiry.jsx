import React from 'react';
import { MessageCircle, Phone, ShoppingCart } from 'lucide-react';

const WhatsAppProductInquiry = ({ product, className = "" }) => {
  const whatsappNumber = "+21626419140"; // Your actual WhatsApp Business number

  const sendProductInquiry = (type = 'general') => {
    let message = '';
    const productUrl = `${window.location.origin}/products/${product.id}`;
    
    switch (type) {
      case 'price':
        message = `Hello! I'm interested in the ${product.name}. 

📱 Product: ${product.name}
💰 Listed Price: ${product.price} Dt
🔗 Link: ${productUrl}

Could you please provide more information about pricing and availability?`;
        break;
        
      case 'availability':
        message = `Hi! I'd like to check the availability of this product:

📱 Product: ${product.name}
💰 Price: ${product.price} Dt
🔗 Link: ${productUrl}

Is this item currently in stock? When can I expect delivery?`;
        break;
        
      case 'specs':
        message = `Hello! I need more technical details about:

📱 Product: ${product.name}
💰 Price: ${product.price} Dt
🔗 Link: ${productUrl}

Could you provide detailed specifications and features?`;
        break;
        
      case 'purchase':
        message = `Hi! I'm ready to purchase this product:

📱 Product: ${product.name}
💰 Price: ${product.price} Dt
🔗 Link: ${productUrl}

How can I proceed with the purchase? What payment methods do you accept?`;
        break;
        
      default:
        message = `Hello! I'm interested in this product:

📱 Product: ${product.name}
💰 Price: ${product.price} Dt
🔗 Link: ${productUrl}

Could you provide more information?`;
    }

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Main WhatsApp Button */}
      <button
        onClick={() => sendProductInquiry('general')}
        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
      >
        <MessageCircle className="w-5 h-5" />
        <span>Ask About This Product</span>
      </button>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => sendProductInquiry('price')}
          className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-2 px-3 rounded-lg transition-colors duration-200 text-sm flex items-center justify-center space-x-2"
        >
          <span>💰</span>
          <span>Best Price</span>
        </button>
        
        <button
          onClick={() => sendProductInquiry('availability')}
          className="bg-purple-50 hover:bg-purple-100 text-purple-700 font-medium py-2 px-3 rounded-lg transition-colors duration-200 text-sm flex items-center justify-center space-x-2"
        >
          <span>📦</span>
          <span>Stock Info</span>
        </button>
        
        <button
          onClick={() => sendProductInquiry('specs')}
          className="bg-orange-50 hover:bg-orange-100 text-orange-700 font-medium py-2 px-3 rounded-lg transition-colors duration-200 text-sm flex items-center justify-center space-x-2"
        >
          <span>📋</span>
          <span>Full Specs</span>
        </button>
        
        <button
          onClick={() => sendProductInquiry('purchase')}
          className="bg-green-50 hover:bg-green-100 text-green-700 font-medium py-2 px-3 rounded-lg transition-colors duration-200 text-sm flex items-center justify-center space-x-2"
        >
          <span>🛒</span>
          <span>Buy Now</span>
        </button>
      </div>

      {/* Contact Info */}
      <div className="bg-gray-50 rounded-lg p-3 text-center">
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
          <Phone className="w-4 h-4" />
          <span>WhatsApp: +216 26 419 140</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Usually responds within minutes • Available 9 AM - 8 PM
        </p>
      </div>
    </div>
  );
};

export default WhatsAppProductInquiry;
