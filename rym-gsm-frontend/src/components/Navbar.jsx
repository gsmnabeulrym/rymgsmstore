import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { Menu, X, ShoppingCart, User, Search, Phone, Laptop, Watch, Headphones, Heart } from 'lucide-react';
import Logo from './Logo';
import EnhancedSearchBar from './EnhancedSearchBar';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white/95 backdrop-blur-lg shadow-lg sticky top-0 z-50 border-b border-primary-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <Logo size="md" className="group-hover:scale-105 transition-transform duration-300" />
          </Link>

          {/* Enhanced Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <EnhancedSearchBar 
              placeholder="Rechercher téléphones, marques ou catégories..."
              className="w-full"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/products"
              className="text-gray-700 hover:text-primary-600 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:bg-primary-50"
            >
              Produits
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-primary-600 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:bg-primary-50"
            >
              Contact
            </Link>

            {/* Favoris */}
            <Link
              to="/wishlist"
              className="relative text-gray-700 hover:text-primary-600 p-3 rounded-xl transition-all duration-300 hover:bg-primary-50 group"
            >
              <Heart className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Notifications */}
            <NotificationBell />

            {/* Panier */}
            <Link
              to="/cart"
              className="relative text-gray-700 hover:text-primary-600 p-3 rounded-xl transition-all duration-300 hover:bg-primary-50 group"
            >
              <ShoppingCart className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 p-3 rounded-xl transition-all duration-300 hover:bg-primary-50">
                  <User className="h-6 w-6" />
                  <span className="text-sm font-semibold">{user?.name}</span>
                </button>
                
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-primary-100">
                  <Link
                    to="/profile"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200"
                  >
                    Profil
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200"
                  >
                    Mes Commandes
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200"
                    >
                      Panneau Admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                  >
                    Déconnexion
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:bg-primary-50"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm"
                >
                  S'inscrire
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary-600 p-3 rounded-xl transition-all duration-300 hover:bg-primary-50"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Enhanced Search Bar - Mobile */}
        <div className="md:hidden pb-4">
          <EnhancedSearchBar 
            placeholder="Rechercher téléphones, marques ou catégories..."
            className="w-full"
            onSearch={() => setIsMenuOpen(false)}
          />
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-primary-100">
          <div className="px-4 pt-4 pb-6 space-y-2">
            <Link
              to="/products"
              className="block px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl text-base font-semibold transition-all duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Produits
            </Link>
            <Link
              to="/contact"
              className="block px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl text-base font-semibold transition-all duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              to="/wishlist"
              className="flex items-center px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl text-base font-semibold transition-all duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              <Heart className="h-5 w-5 mr-3" />
              Favoris
              {wishlistCount > 0 && (
                <span className="ml-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              to="/cart"
              className="flex items-center px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl text-base font-semibold transition-all duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              <ShoppingCart className="h-5 w-5 mr-3" />
              Panier
              {cartCount > 0 && (
                <span className="ml-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="block px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl text-base font-semibold transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profil
                </Link>
                <Link
                  to="/orders"
                  className="block px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl text-base font-semibold transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Mes Commandes
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="block px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl text-base font-semibold transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Panneau Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-xl text-base font-semibold transition-all duration-300"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl text-base font-semibold transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-3 btn-primary text-base font-semibold text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  S'inscrire
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
