import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader } from 'lucide-react';
import api from '../config/api';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "👋 Hello! I'm your RYM GSM assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [userContext, setUserContext] = useState({});
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Generate session ID for conversation tracking
  const [sessionId] = useState(() => 
    'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now()
  );

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chatbot opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Load suggestions when chatbot opens
  useEffect(() => {
    if (isOpen && suggestions.length === 0) {
      loadSuggestions();
    }
  }, [isOpen]);

  const loadSuggestions = async () => {
    try {
      const response = await api.get('/chatbot/suggestions');
      if (response.data.success) {
        setSuggestions(response.data.suggestions);
      }
    } catch (error) {
      console.error('Error loading suggestions:', error);
    }
  };

  const sendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    // Show typing indicator
    setIsTyping(true);
    
    // Simulate AI thinking time for better UX
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const response = await api.post('/chatbot/message', {
        message: messageText,
        sessionId: sessionId
      });

      if (response.data.success) {
        const botMessage = {
          id: Date.now() + 1,
          text: response.data.response,
          sender: 'bot',
          timestamp: new Date(),
          isAI: true
        };
        
        // Update user context if provided
        if (response.data.context) {
          setUserContext(response.data.context);
        }
        
        setMessages(prev => [...prev, botMessage]);
        
        // Generate smart follow-up suggestions
        generateSmartSuggestions(messageText, response.data.response);
        
      } else {
        throw new Error('Failed to get response');
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "🤖 Sorry, I'm having trouble right now. Please try again or contact our support team!",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  // Generate contextual follow-up suggestions
  const generateSmartSuggestions = (userMessage, botResponse) => {
    const smartSuggestions = [];
    const lowerUserMessage = userMessage.toLowerCase();
    const lowerBotResponse = botResponse.toLowerCase();
    
    // Context-aware suggestions
    if (lowerUserMessage.includes('price') || lowerBotResponse.includes('dt')) {
      smartSuggestions.push("What payment methods do you accept?");
      smartSuggestions.push("Do you offer installment plans?");
    }
    
    if (lowerUserMessage.includes('iphone') || lowerBotResponse.includes('iphone')) {
      smartSuggestions.push("Compare iPhone models");
      smartSuggestions.push("iPhone accessories available?");
    }
    
    if (lowerUserMessage.includes('camera') || lowerBotResponse.includes('camera')) {
      smartSuggestions.push("Show me phones with best cameras");
      smartSuggestions.push("Night mode photography comparison");
    }
    
    if (lowerUserMessage.includes('battery') || lowerBotResponse.includes('battery')) {
      smartSuggestions.push("Phones with longest battery life");
      smartSuggestions.push("Fast charging options");
    }
    
    if (lowerBotResponse.includes('recommend')) {
      smartSuggestions.push("Tell me more about the first one");
      smartSuggestions.push("What's the difference between them?");
    }
    
    // Always include these general options
    if (smartSuggestions.length < 3) {
      smartSuggestions.push("What's your return policy?");
      smartSuggestions.push("Do you have any promotions?");
    }
    
    setSuggestions(smartSuggestions.slice(0, 3));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  const handleSuggestionClick = (suggestion) => {
    sendMessage(suggestion);
  };

  const formatMessage = (text) => {
    // Convert markdown-style formatting to JSX
    const parts = text.split(/(\*\*.*?\*\*|\n)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      if (part === '\n') {
        return <br key={index} />;
      }
      return part;
    });
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <div className="fixed bottom-6 right-20 md:right-24 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group relative w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
          aria-label="Open AI chat"
        >
          {isOpen ? <X size={20} /> : <MessageCircle size={20} />}
          
          {/* AI Badge */}
          {!isOpen && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">AI</span>
            </div>
          )}
        </button>

        {/* Tooltip */}
        {!isOpen && (
          <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap">
              AI Assistant
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        )}
      </div>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-2rem)] h-[500px] bg-white rounded-lg shadow-2xl border border-gray-200 z-50 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Bot size={20} />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-green-400 to-blue-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h3 className="font-semibold flex items-center space-x-2">
                  <span>RYM GSM AI Assistant</span>
                  <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">🧠 Smart</span>
                </h3>
                <p className="text-xs text-blue-100">
                  {userContext.messageCount > 0 
                    ? `Learning about you • ${userContext.messageCount} messages`
                    : "Online • Ready to help"
                  }
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-blue-100 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-[80%] ${
                  message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.sender === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {message.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <div className="text-sm whitespace-pre-wrap">
                      {formatMessage(message.text)}
                    </div>
                    <div className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* AI Thinking indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2 max-w-[80%]">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center">
                    <Bot size={16} />
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 text-gray-800 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                      <span className="text-sm font-medium">AI is analyzing...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Smart Suggestions */}
            {suggestions.length > 0 && !isLoading && (
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>
                  <p className="text-xs text-blue-600 font-medium">💡 Smart suggestions</p>
                  <div className="w-4 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-left text-sm p-3 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 rounded-lg border border-blue-200 transition-all duration-200 transform hover:scale-[1.02] hover:shadow-sm"
                    >
                      <span className="text-blue-700">{suggestion}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-4">
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg p-2 transition-colors"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
