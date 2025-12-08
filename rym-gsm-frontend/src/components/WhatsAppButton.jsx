import React, { useState } from 'react';
import { MessageCircle, X, Phone, ShoppingCart, HelpCircle, Package } from 'lucide-react';

const WhatsAppButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // WhatsApp business number
  const whatsappNumber = "+21626419140"; // Your actual WhatsApp Business number
  
  const quickMessages = [
    {
      id: 'general',
      icon: <MessageCircle className="w-5 h-5" />,
      title: 'Demande G\u00e9n\u00e9rale',
      message: 'Bonjour ! J\'ai une question sur vos produits et services.',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      id: 'product',
      icon: <Phone className="w-5 h-5" />,
      title: 'Informations Produit',
      message: 'Bonjour ! J\'ai besoin de plus d\'informations sur un produit sp\u00e9cifique.',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      id: 'order',
      icon: <Package className="w-5 h-5" />,
      title: 'Support Commande',
      message: 'Bonjour ! J\'ai besoin d\'aide avec ma commande.',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      id: 'cart',
      icon: <ShoppingCart className="w-5 h-5" />,
      title: 'Assistance Achat',
      message: 'Bonjour ! J\'ai besoin d\'aide pour finaliser mon achat.',
      color: 'bg-orange-500 hover:bg-orange-600'
    },
    {
      id: 'support',
      icon: <HelpCircle className="w-5 h-5" />,
      title: 'Support Technique',
      message: 'Bonjour ! J\'ai besoin d\'un support technique pour mon appareil.',
      color: 'bg-red-500 hover:bg-red-600'
    }
  ];

  const sendWhatsAppMessage = (message) => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    setIsOpen(false);
  };

  const formatPhoneNumber = (number) => {
    // Format phone number for display
    return number.replace(/(\+216)(\d{2})(\d{3})(\d{3})/, '$1 $2 $3 $4');
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-20 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Quick Messages Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 md:right-6 z-50 w-80 max-w-[calc(100vw-2rem)]">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-slide-up">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">RYM GSM Support</h3>
                    <p className="text-sm text-green-100">
                      {formatPhoneNumber(whatsappNumber)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Messages */}
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-4">
                Choisissez un sujet pour commencer à discuter avec nous sur WhatsApp :
              </p>
              <div className="space-y-2">
                {quickMessages.map((msg) => (
                  <button
                    key={msg.id}
                    onClick={() => sendWhatsAppMessage(msg.message)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-xl text-white transition-all duration-200 transform hover:scale-105 ${msg.color}`}
                  >
                    {msg.icon}
                    <span className="font-medium">{msg.title}</span>
                  </button>
                ))}
              </div>

              {/* Custom Message */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => sendWhatsAppMessage('Bonjour ! J\'ai une demande personnalisée.')}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-xl transition-colors duration-200"
                >
                  Envoyer un Message Personnalisé
                </button>
              </div>

              {/* Business Hours */}
              <div className="mt-4 p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">Répond généralement en quelques minutes</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Heures d'ouverture : 9h00 - 20h00 (GMT+1)
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-6 right-4 md:right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group relative w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
          aria-label="Contact us on WhatsApp"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageCircle className="w-6 h-6" />
          )}
          
          {/* Pulse Animation */}
          {!isOpen && (
            <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20"></div>
          )}
          
          {/* Notification Badge */}
          {!isOpen && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">!</span>
            </div>
          )}
        </button>

        {/* Tooltip */}
        {!isOpen && (
          <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap">
              Besoin d'aide ? Discutez avec nous !
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default WhatsAppButton;
