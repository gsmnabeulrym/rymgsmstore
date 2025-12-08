import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, ShoppingCart, Trash2, Share2, ArrowRight, 
  Star, Eye, Package, Sparkles
} from 'lucide-react';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import ProductRating from '../components/ProductRating';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const { 
    wishlist, 
    wishlistCount, 
    isLoading, 
    removeFromWishlist, 
    clearWishlist, 
    shareWishlist,
    getWishlistSummary 
  } = useWishlist();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = async (product) => {
    const result = await addToCart(product.id, 1);
    if (result.success) {
      toast.success(`${product.name} ajout\u00e9 au panier !`);
    } else {
      toast.error(result.message || '\u00c9chec de l\'ajout au panier');
    }
  };

  const handleRemoveFromWishlist = async (productId, productName) => {
    if (window.confirm(`Retirer "${productName}" de votre liste de souhaits ?`)) {
      await removeFromWishlist(productId);
    }
  };

  const handleClearWishlist = async () => {
    if (window.confirm('\u00cates-vous s\u00fbr de vouloir vider toute votre liste de souhaits ?')) {
      await clearWishlist();
    }
  };

  const summary = getWishlistSummary();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-32 h-32 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <Heart className="h-16 w-16 text-primary-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Veuillez vous Connecter</h1>
          <p className="text-lg text-gray-600 mb-8">Vous devez \u00eatre connect\u00e9 pour voir votre liste de souhaits</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="btn-primary"
            >
              Connexion
            </Link>
            <Link
              to="/register"
              className="btn-secondary"
            >
              S'inscrire
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre liste de souhaits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Ma <span className="gradient-text">Liste de Souhaits</span> ❤️
          </h1>
          <p className="text-xl text-gray-600">
            Vos produits favoris enregistrés pour plus tard
          </p>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <Heart className="h-16 w-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Votre Liste de Souhaits est Vide</h3>
            <p className="text-lg text-gray-600 mb-8">Commencez à ajouter les produits que vous aimez à votre liste de souhaits</p>
            <Link
              to="/products"
              className="btn-primary inline-flex items-center"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Parcourir les Produits
            </Link>
          </div>
        ) : (
          <>
            {/* Wishlist Summary */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 mb-8 border border-white/20">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="mb-4 md:mb-0">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {summary.totalItems} Article{summary.totalItems !== 1 ? 's' : ''} dans la Liste de Souhaits
                  </h2>
                  <p className="text-gray-600">
                    Valeur Totale: <span className="font-semibold text-primary-600">{summary.totalValue} Dt</span>
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={shareWishlist}
                    className="btn-secondary flex items-center"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Partager via WhatsApp
                  </button>
                  <button
                    onClick={handleClearWishlist}
                    className="text-red-600 hover:text-red-700 font-semibold px-4 py-2 border border-red-200 rounded-xl hover:bg-red-50 transition-colors duration-200 flex items-center"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Tout Effacer
                  </button>
                </div>
              </div>
            </div>

            {/* Wishlist Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlist.map((product, index) => (
                <div 
                  key={product.id} 
                  className="group bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/20 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative">
                    <img
                      src={product.images?.[0] || 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop'}
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Remove from Wishlist Button */}
                    <button
                      onClick={() => handleRemoveFromWishlist(product.id, product.name)}
                      className="absolute top-3 right-3 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-110 z-20 opacity-90 hover:opacity-100"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    {/* Stock Badge */}
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        product.stock > 0 
                          ? 'bg-green-500 text-white' 
                          : 'bg-red-500 text-white'
                      }`}>
                        {product.stock > 0 ? 'En Stock' : 'Rupture de Stock'}
                      </span>
                    </div>

                    {/* Quick Actions Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={product.stock === 0}
                          className="w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ShoppingCart className="h-5 w-5" />
                        </button>
                        <Link
                          to={`/products/${product.id}`}
                          className="w-12 h-12 bg-white text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors duration-200"
                        >
                          <Eye className="h-5 w-5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-300">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                        {product.description}
                      </p>
                      
                      {/* Rating */}
                      <ProductRating 
                        productId={product.id} 
                        size="sm" 
                        showCount={true}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-2xl font-bold text-primary-600">
                          {product.price} Dt
                        </span>
                        <p className="text-sm text-gray-500">{product.brand}</p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0}
                        className="flex-1 btn-primary py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {product.stock > 0 ? 'Ajouter au Panier' : 'Rupture de Stock'}
                      </button>
                      <Link
                        to={`/products/${product.id}`}
                        className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    </div>

                    {/* Added Date */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500">
                        Ajouté le {new Date(product.addedAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Shopping */}
            <div className="text-center mt-12">
              <Link
                to="/products"
                className="btn-primary text-lg px-8 py-4 inline-flex items-center group"
              >
                Continuer vos Achats
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
