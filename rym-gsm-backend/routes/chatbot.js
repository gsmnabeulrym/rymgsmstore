const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Phone store knowledge base for common questions
const phoneStoreKnowledge = {
  // Shipping & Delivery
  shipping: {
    keywords: ['shipping', 'delivery', 'ship', 'deliver', 'when will', 'how long'],
    response: "🚚 **Shipping Information:**\n• Standard delivery: 2-3 business days\n• Express delivery: Next business day\n• Free shipping on orders over 100 DT\n• We deliver nationwide across Tunisia"
  },
  
  // Payment Methods
  payment: {
    keywords: ['payment', 'pay', 'card', 'cash', 'visa', 'mastercard'],
    response: "💳 **Payment Methods:**\n• Credit/Debit Cards (Visa, Mastercard)\n• Cash on Delivery\n• Bank Transfer\n• Mobile Payment (D17, Flouci)\n• All payments are secure and encrypted"
  },
  
  // Warranty & Returns
  warranty: {
    keywords: ['warranty', 'return', 'refund', 'exchange', 'guarantee'],
    response: "🛡️ **Warranty & Returns:**\n• 2-year manufacturer warranty on all phones\n• 14-day return policy\n• Free exchanges for defective items\n• Original packaging required for returns"
  },
  
  // Product Information
  products: {
    keywords: ['phone', 'smartphone', 'mobile', 'iphone', 'samsung', 'oppo', 'xiaomi'],
    response: "📱 **Our Products:**\n• Latest smartphones from top brands\n• iPhone, Samsung, Oppo, Xiaomi, Huawei\n• All phones are original and unlocked\n• Competitive prices with regular promotions"
  },
  
  // Promotions & Offers
  promotions: {
    keywords: ['promotion', 'promotions', 'offer', 'offers', 'deal', 'deals', 'discount', 'discounts', 'sale', 'sales', 'special'],
    response: "🎉 **Current Promotions & Offers:**\n• Check our latest deals on featured products\n• Seasonal discounts up to 30% off\n• Bundle offers on phones + accessories\n• Student discounts available\n• Free shipping on orders over 100 DT\n• Follow us for flash sales and exclusive offers!"
  },

  // Store Information
  store: {
    keywords: ['store', 'location', 'address', 'hours', 'contact', 'phone number'],
    response: "🏪 **Store Information:**\n• Online store with nationwide delivery\n• Customer service: Available 9AM-8PM\n• Email: gsmnabeulrym@gmail.com\n• Phone: +216 26 419 140\n• Fast and reliable service"
  },
  
  // Technical Support
  support: {
    keywords: ['help', 'support', 'problem', 'issue', 'technical', 'broken'],
    response: "🔧 **Technical Support:**\n• Free technical support for all customers\n• Setup assistance for new phones\n• Troubleshooting guides available\n• Contact our experts for complex issues"
  }
};

// Function to find the best matching response
function findBestResponse(userMessage) {
  const message = userMessage.toLowerCase();
  
  // Check each knowledge category
  for (const [category, data] of Object.entries(phoneStoreKnowledge)) {
    for (const keyword of data.keywords) {
      if (message.includes(keyword)) {
        return data.response;
      }
    }
  }
  
  // Default response if no match found
  return "🤖 **I'm here to help!**\n\nI can assist you with:\n• Shipping & Delivery info\n• Payment methods\n• Warranty & Returns\n• Product information\n• Store details\n• Technical support\n\nWhat would you like to know?";
}

// Function to get current promotions from database
async function getCurrentPromotions() {
  try {
    // Get products with discounts (where price < original_price)
    const [promotions] = await pool.execute(
      'SELECT name, brand, price, original_price FROM products WHERE original_price > price ORDER BY ((original_price - price) / original_price) DESC LIMIT 5'
    );
    
    if (promotions.length > 0) {
      let response = "🎉 **Current Live Promotions:**\n\n";
      promotions.forEach(product => {
        const savings = (product.original_price - product.price).toFixed(2);
        const discount = Math.round(((product.original_price - product.price) / product.original_price) * 100);
        response += `🔥 **${product.brand} ${product.name}**\n`;
        response += `💰 ~~${product.original_price} DT~~ **${product.price} DT**\n`;
        response += `💸 Save ${savings} DT (${discount}% off!)\n\n`;
      });
      response += "🛒 **Ready to grab these deals?** They won't last long!";
      return response;
    }
  } catch (error) {
    console.error('Error fetching promotions:', error);
  }
  
  return null;
}

// Function to get product-specific information
async function getProductInfo(query) {
  try {
    const searchTerm = `%${query}%`;
    const [products] = await pool.execute(
      'SELECT name, brand, price, original_price FROM products WHERE name LIKE ? OR brand LIKE ? LIMIT 3',
      [searchTerm, searchTerm]
    );
    
    if (products.length > 0) {
      let response = "📱 **Found these products for you:**\n\n";
      products.forEach(product => {
        const price = product.original_price && product.price < product.original_price 
          ? `~~${product.original_price} DT~~ **${product.price} DT** 🔥`
          : `**${product.price} DT**`;
        response += `• ${product.brand} ${product.name} - ${price}\n`;
      });
      response += "\nWould you like more details about any of these phones?";
      return response;
    }
  } catch (error) {
    console.error('Error fetching product info:', error);
  }
  
  return null;
}

// Advanced AI conversation context
const conversationContexts = new Map();

// Sentiment analysis function
function analyzeSentiment(message) {
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'love', 'perfect', 'awesome', 'fantastic', 'happy', 'satisfied'];
  const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'disappointed', 'frustrated', 'angry', 'problem', 'issue', 'broken'];
  
  const words = message.toLowerCase().split(/\s+/);
  let positiveScore = 0;
  let negativeScore = 0;
  
  words.forEach(word => {
    if (positiveWords.includes(word)) positiveScore++;
    if (negativeWords.includes(word)) negativeScore++;
  });
  
  if (positiveScore > negativeScore) return 'positive';
  if (negativeScore > positiveScore) return 'negative';
  return 'neutral';
}

// Extract user intent from message
function extractIntent(message) {
  const intents = {
    purchase: ['buy', 'purchase', 'order', 'get', 'want to buy', 'interested in'],
    compare: ['compare', 'difference', 'vs', 'versus', 'better', 'which one'],
    technical: ['specs', 'specification', 'features', 'camera', 'battery', 'storage', 'ram'],
    price: ['price', 'cost', 'how much', 'expensive', 'cheap', 'discount', 'offer'],
    support: ['help', 'support', 'problem', 'issue', 'not working', 'broken'],
    shipping: ['delivery', 'shipping', 'when', 'how long', 'arrive'],
    warranty: ['warranty', 'guarantee', 'return', 'exchange', 'refund']
  };
  
  const lowerMessage = message.toLowerCase();
  for (const [intent, keywords] of Object.entries(intents)) {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      return intent;
    }
  }
  return 'general';
}

// Get personalized recommendations based on user behavior
async function getPersonalizedRecommendations(sessionId, intent) {
  try {
    // Get user's conversation history
    const context = conversationContexts.get(sessionId) || { interests: [], priceRange: null, brand: null };
    
    let query = 'SELECT name, brand, price, original_price, images FROM products WHERE 1=1';
    const params = [];
    
    // Filter based on user's interests
    if (context.brand) {
      query += ' AND brand LIKE ?';
      params.push(`%${context.brand}%`);
    }
    
    if (context.priceRange) {
      query += ' AND price BETWEEN ? AND ?';
      params.push(context.priceRange.min, context.priceRange.max);
    }
    
    query += ' ORDER BY RAND() LIMIT 3';
    
    const [products] = await pool.execute(query, params);
    
    if (products.length > 0) {
      let response = "🎯 **Based on our conversation, I recommend these phones:**\n\n";
      products.forEach(product => {
        const price = product.original_price && product.price < product.original_price 
          ? `~~${product.original_price} DT~~ **${product.price} DT** 🔥`
          : `**${product.price} DT**`;
        response += `📱 **${product.brand} ${product.name}**\n💰 ${price}\n\n`;
      });
      response += "Would you like detailed specs or have questions about any of these?";
      return response;
    }
  } catch (error) {
    console.error('Error getting recommendations:', error);
  }
  return null;
}

// Update conversation context
function updateConversationContext(sessionId, message, intent) {
  let context = conversationContexts.get(sessionId) || { 
    interests: [], 
    priceRange: null, 
    brand: null, 
    lastIntent: null,
    messageCount: 0 
  };
  
  context.messageCount++;
  context.lastIntent = intent;
  
  // Extract brand mentions
  const brands = ['iphone', 'samsung', 'oppo', 'xiaomi', 'huawei', 'apple'];
  const lowerMessage = message.toLowerCase();
  brands.forEach(brand => {
    if (lowerMessage.includes(brand)) {
      context.brand = brand;
    }
  });
  
  // Extract price range
  const priceMatch = message.match(/(\d+)\s*(?:dt|dinar|euro)/i);
  if (priceMatch) {
    const price = parseInt(priceMatch[1]);
    if (price > 50) { // Reasonable phone price
      context.priceRange = {
        min: Math.max(0, price - 100),
        max: price + 100
      };
    }
  }
  
  // Track interests
  const interests = ['camera', 'gaming', 'battery', 'storage', 'design', 'performance'];
  interests.forEach(interest => {
    if (lowerMessage.includes(interest) && !context.interests.includes(interest)) {
      context.interests.push(interest);
    }
  });
  
  conversationContexts.set(sessionId, context);
  return context;
}

// Advanced AI response with context awareness
async function getChatbotResponse(userMessage, sessionId = 'anonymous') {
  const sentiment = analyzeSentiment(userMessage);
  const intent = extractIntent(userMessage);
  const context = updateConversationContext(sessionId, userMessage, intent);
  
  console.log(`🧠 AI Analysis: Intent=${intent}, Sentiment=${sentiment}, Context=${JSON.stringify(context)}`);
  
  // Handle negative sentiment with empathy
  if (sentiment === 'negative') {
    const empathyResponses = [
      "😔 I understand your frustration. Let me help you resolve this issue.",
      "🤝 I'm sorry to hear you're having trouble. I'm here to make things better.",
      "💙 I can see this is important to you. Let's work together to find a solution."
    ];
    const empathyResponse = empathyResponses[Math.floor(Math.random() * empathyResponses.length)];
    
    // Still provide helpful information after empathy
    const helpResponse = findBestResponse(userMessage);
    return `${empathyResponse}\n\n${helpResponse}`;
  }
  
  // Handle positive sentiment with enthusiasm
  if (sentiment === 'positive') {
    const enthusiasmPrefixes = [
      "🎉 That's wonderful to hear! ",
      "😊 I'm so glad you're happy! ",
      "✨ Fantastic! "
    ];
    const prefix = enthusiasmPrefixes[Math.floor(Math.random() * enthusiasmPrefixes.length)];
    
    const response = findBestResponse(userMessage);
    return `${prefix}${response}`;
  }
  
  // Check for promotions first (high priority)
  const promotionKeywords = ['promotion', 'promotions', 'offer', 'offers', 'deal', 'deals', 'discount', 'discounts', 'sale', 'sales', 'special'];
  if (promotionKeywords.some(keyword => userMessage.toLowerCase().includes(keyword))) {
    const livePromotions = await getCurrentPromotions();
    if (livePromotions) {
      return livePromotions;
    }
  }

  // Intent-based responses
  switch (intent) {
    case 'purchase':
      const purchaseInfo = await getProductInfo(userMessage);
      if (purchaseInfo) {
        return `${purchaseInfo}\n\n💡 **Ready to buy?** I can help you with:\n• Payment options\n• Delivery details\n• Warranty information\n• Setup assistance`;
      }
      break;
      
    case 'compare':
      return "📊 **Product Comparison**\n\nI'd love to help you compare phones! Please tell me:\n• Which specific models are you considering?\n• What features matter most to you? (camera, battery, performance, price)\n• What's your budget range?\n\nThis will help me give you a detailed comparison!";
      
    case 'technical':
      const techInfo = await getProductInfo(userMessage);
      if (techInfo) {
        return `${techInfo}\n\n🔧 **Need more technical details?**\n• Detailed specifications\n• Performance benchmarks\n• Camera samples\n• Battery life tests\n\nJust ask!`;
      }
      break;
      
    case 'price':
      // Get personalized recommendations if user has shown price interest
      if (context.messageCount > 2) {
        const recommendations = await getPersonalizedRecommendations(sessionId, intent);
        if (recommendations) return recommendations;
      }
      break;
  }
  
  // Check for product-specific queries
  const productKeywords = ['price', 'cost', 'available', 'stock', 'specs', 'features'];
  const hasProductKeyword = productKeywords.some(keyword => 
    userMessage.toLowerCase().includes(keyword)
  );
  
  if (hasProductKeyword) {
    const productInfo = await getProductInfo(userMessage);
    if (productInfo) {
      // Add contextual follow-up based on user's history
      let followUp = "";
      if (context.interests.length > 0) {
        followUp = `\n\n💡 Since you're interested in **${context.interests.join(', ')}**, would you like me to highlight those features?`;
      }
      return productInfo + followUp;
    }
  }
  
  // Use knowledge base with context
  const knowledgeResponse = findBestResponse(userMessage);
  
  // Add personalized touch for returning users
  if (context.messageCount > 3) {
    const personalizedPrefix = "🤖 Based on our conversation, ";
    if (!knowledgeResponse.includes("I'm here to help!")) {
      return personalizedPrefix + knowledgeResponse.toLowerCase();
    }
  }
  
  // For complex queries, try free AI API (Hugging Face)
  if (!knowledgeResponse.includes("I'm here to help!")) {
    return knowledgeResponse;
  }
  
  // Advanced fallback with context
  return `🤖 **I understand you're asking about something specific.**\n\nBased on our conversation, I can help you with:\n${context.interests.length > 0 ? `• Your interests: ${context.interests.join(', ')}\n` : ''}${context.brand ? `• ${context.brand.charAt(0).toUpperCase() + context.brand.slice(1)} products\n` : ''}${context.priceRange ? `• Phones in your ${context.priceRange.min}-${context.priceRange.max} DT range\n` : ''}• General phone store questions\n\nWhat would you like to know more about?`;
}

// POST /api/chatbot/message - Send message to chatbot
router.post('/message', async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    console.log(`💬 Chatbot received: "${message}" from session: ${sessionId}`);
    
    // Get chatbot response with session context
    const botResponse = await getChatbotResponse(message, sessionId);
    
    // Store conversation in database (optional)
    try {
      await pool.execute(
        'INSERT INTO chatbot_conversations (session_id, user_message, bot_response, created_at) VALUES (?, ?, ?, NOW())',
        [sessionId || 'anonymous', message, botResponse]
      );
    } catch (dbError) {
      console.log('Note: Chatbot conversations table not found, skipping storage');
    }
    
    console.log(`🤖 Chatbot responded: "${botResponse.substring(0, 50)}..."`);
    
    res.json({
      success: true,
      response: botResponse,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ 
      error: 'Sorry, I encountered an error. Please try again.',
      fallback: "🤖 I'm temporarily unavailable. Please contact our support team for immediate assistance!"
    });
  }
});

// GET /api/chatbot/suggestions - Get quick response suggestions
router.get('/suggestions', (req, res) => {
  const suggestions = [
    "What are your shipping options?",
    "What payment methods do you accept?",
    "Do you have iPhone 15 in stock?",
    "What's your return policy?",
    "How can I contact customer support?",
    "Do you offer warranty on phones?"
  ];
  
  res.json({
    success: true,
    suggestions
  });
});

module.exports = router;
