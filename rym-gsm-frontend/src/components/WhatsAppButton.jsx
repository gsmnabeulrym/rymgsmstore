import React, { useState } from 'react';
import { X, Phone, ShoppingCart, HelpCircle, Package, MessageCircle } from 'lucide-react';

// WhatsApp SVG Icon Component
const WhatsAppIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

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
        <div className="fixed bottom-20 right-4 md:bottom-24 md:right-6 z-50 w-72 md:w-80 max-w-[calc(100vw-2rem)]">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-slide-up">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 md:p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm md:text-base">RYM GSM Support</h3>
                    <p className="text-xs md:text-sm text-green-100">
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
            <div className="p-3 md:p-4">
              <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4">
                Choisissez un sujet pour commencer à discuter avec nous sur WhatsApp :
              </p>
              <div className="space-y-2">
                {quickMessages.map((msg) => (
                  <button
                    key={msg.id}
                    onClick={() => sendWhatsAppMessage(msg.message)}
                    className={`w-full flex items-center space-x-3 p-2.5 md:p-3 rounded-xl text-white transition-all duration-200 transform hover:scale-105 ${msg.color}`}
                  >
                    {msg.icon}
                    <span className="font-medium text-sm md:text-base">{msg.title}</span>
                  </button>
                ))}
              </div>

              {/* Custom Message */}
              <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-200">
                <button
                  onClick={() => sendWhatsAppMessage('Bonjour ! J\'ai une demande personnalisée.')}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2.5 md:py-3 px-4 rounded-xl transition-colors duration-200 text-sm md:text-base"
                >
                  Envoyer un Message Personnalisé
                </button>
              </div>

              {/* Business Hours */}
              <div className="mt-3 md:mt-4 p-2.5 md:p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-2 text-xs md:text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">Répond généralement en quelques minutes</span>
                </div>
                <p className="text-[10px] md:text-xs text-gray-500 mt-1">
                  Heures d'ouverture : 9h00 - 20h00 (GMT+1)
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group relative w-12 h-12 md:w-14 md:h-14 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
          aria-label="Contact us on WhatsApp"
        >
          {isOpen ? (
            <X className="w-5 h-5 md:w-6 md:h-6" />
          ) : (
            <WhatsAppIcon className="w-6 h-6 md:w-7 md:h-7" />
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
