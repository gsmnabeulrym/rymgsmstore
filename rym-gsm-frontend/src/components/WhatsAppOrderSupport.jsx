import React from 'react';
import { MessageCircle, Package, Truck, CreditCard, HelpCircle } from 'lucide-react';

const WhatsAppOrderSupport = ({ order, cart, type = 'order', className = "" }) => {
  const whatsappNumber = "+21626419140"; // Your actual WhatsApp Business number

  const sendOrderMessage = (supportType) => {
    let message = '';
    
    if (type === 'cart' && cart) {
      // Cart assistance
      const cartItems = cart.products.map(item => 
        `• ${item.name} (Qty: ${item.quantity}) - ${item.price} Dt`
      ).join('\n');
      
      switch (supportType) {
        case 'checkout':
          message = `Hello! I need help completing my purchase.

🛒 Cart Items:
${cartItems}

💰 Total: ${cart.total} Dt

I'm having trouble with the checkout process. Can you assist me?`;
          break;
          
        case 'payment':
          message = `Hi! I have questions about payment methods.

🛒 Cart Total: ${cart.total} Dt

What payment options are available? Can I pay via bank transfer or mobile money?`;
          break;
          
        case 'delivery':
          message = `Hello! I'd like to know about delivery options.

🛒 Cart Total: ${cart.total} Dt

What are the delivery options and costs? How long does shipping take?`;
          break;
          
        default:
          message = `Hi! I need assistance with my cart.

🛒 Cart Items:
${cartItems}

💰 Total: ${cart.total} Dt

Can you help me complete this purchase?`;
      }
    } else if (order) {
      // Order support
      const orderItems = order.products?.map(item => 
        `• ${item.name} (Qty: ${item.quantity})`
      ).join('\n') || 'Order items not available';
      
      switch (supportType) {
        case 'status':
          message = `Hello! I'd like to check my order status.

📦 Order ID: #${order.id}
📅 Order Date: ${new Date(order.created_at).toLocaleDateString()}
💰 Total: ${order.total} Dt
📋 Current Status: ${order.status}

Could you provide an update on my order?`;
          break;
          
        case 'tracking':
          message = `Hi! I need tracking information for my order.

📦 Order ID: #${order.id}
📅 Order Date: ${new Date(order.created_at).toLocaleDateString()}
💰 Total: ${order.total} Dt

Can you provide tracking details for my shipment?`;
          break;
          
        case 'change':
          message = `Hello! I need to make changes to my order.

📦 Order ID: #${order.id}
📅 Order Date: ${new Date(order.created_at).toLocaleDateString()}
💰 Total: ${order.total} Dt
📋 Status: ${order.status}

Items:
${orderItems}

I need to modify this order. Is it still possible?`;
          break;
          
        case 'cancel':
          message = `Hi! I need to cancel my order.

📦 Order ID: #${order.id}
📅 Order Date: ${new Date(order.created_at).toLocaleDateString()}
💰 Total: ${order.total} Dt
📋 Status: ${order.status}

I would like to cancel this order. What's the process?`;
          break;
          
        default:
          message = `Hello! I need help with my order.

📦 Order ID: #${order.id}
📅 Order Date: ${new Date(order.created_at).toLocaleDateString()}
💰 Total: ${order.total} Dt
📋 Status: ${order.status}

Items:
${orderItems}

Can you assist me with this order?`;
      }
    }

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  if (type === 'cart') {
    return (
      <div className={`space-y-3 ${className}`}>
        <h3 className="font-semibold text-gray-900 flex items-center">
          <MessageCircle className="w-5 h-5 mr-2 text-green-600" />
          Besoin d'Aide pour Votre Achat ?
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            onClick={() => sendOrderMessage('checkout')}
            className="bg-green-50 hover:bg-green-100 text-green-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <CreditCard className="w-4 h-4" />
            <span>Aide au Paiement</span>
          </button>
          
          <button
            onClick={() => sendOrderMessage('payment')}
            className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <CreditCard className="w-4 h-4" />
            <span>Options de Paiement</span>
          </button>
          
          <button
            onClick={() => sendOrderMessage('delivery')}
            className="bg-purple-50 hover:bg-purple-100 text-purple-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <Truck className="w-4 h-4" />
            <span>Infos Livraison</span>
          </button>
          
          <button
            onClick={() => sendOrderMessage('general')}
            className="bg-orange-50 hover:bg-orange-100 text-orange-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Autres Questions</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="font-semibold text-gray-900 flex items-center">
        <Package className="w-5 h-5 mr-2 text-green-600" />
        Support Commande
      </h3>
      
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => sendOrderMessage('status')}
          className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-2 px-3 rounded-lg transition-colors duration-200 text-sm flex items-center justify-center space-x-2"
        >
          <Package className="w-4 h-4" />
          <span>Statut Commande</span>
        </button>
        
        <button
          onClick={() => sendOrderMessage('tracking')}
          className="bg-purple-50 hover:bg-purple-100 text-purple-700 font-medium py-2 px-3 rounded-lg transition-colors duration-200 text-sm flex items-center justify-center space-x-2"
        >
          <Truck className="w-4 h-4" />
          <span>Suivre Commande</span>
        </button>
        
        <button
          onClick={() => sendOrderMessage('change')}
          className="bg-orange-50 hover:bg-orange-100 text-orange-700 font-medium py-2 px-3 rounded-lg transition-colors duration-200 text-sm flex items-center justify-center space-x-2"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Modifier Commande</span>
        </button>
        
        <button
          onClick={() => sendOrderMessage('cancel')}
          className="bg-red-50 hover:bg-red-100 text-red-700 font-medium py-2 px-3 rounded-lg transition-colors duration-200 text-sm flex items-center justify-center space-x-2"
        >
          <span>❌</span>
          <span>Annuler Commande</span>
        </button>
      </div>
      
      <button
        onClick={() => sendOrderMessage('general')}
        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
      >
        <MessageCircle className="w-5 h-5" />
        <span>Discuter de Cette Commande</span>
      </button>
    </div>
  );
};

export default WhatsAppOrderSupport;
