import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { Menu, X, ShoppingCart, User, Search, Phone, Laptop, Watch, Headphones, Heart, Shield } from 'lucide-react';
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
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group flex-shrink-0">
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

          {/* Mobile Actions */}
          <div className="md:hidden flex items-center gap-2">
            {/* Mobile Cart Icon */}
            <Link
              to="/cart"
              className="relative text-gray-700 hover:text-primary-600 p-2.5 rounded-xl transition-all duration-300 hover:bg-primary-50"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary-600 p-2.5 rounded-xl transition-all duration-300 hover:bg-primary-50 active:scale-95"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Enhanced Search Bar - Mobile */}
        <div className="md:hidden pb-3 pt-2">
          <EnhancedSearchBar 
            placeholder="Rechercher..."
            className="w-full"
            onSearch={() => setIsMenuOpen(false)}
          />
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gradient-to-b from-white to-gray-50 border-t border-primary-100 shadow-inner">
          <div className="px-3 pt-3 pb-6 space-y-1.5">
            <Link
              to="/products"
              className="flex items-center px-4 py-3.5 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl text-base font-semibold transition-all duration-300 active:scale-98 shadow-sm hover:shadow-md"
              onClick={() => setIsMenuOpen(false)}
            >
              <Phone className="h-5 w-5 mr-3 text-primary-500" />
              Produits
            </Link>
            <Link
              to="/contact"
              className="flex items-center px-4 py-3.5 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl text-base font-semibold transition-all duration-300 active:scale-98 shadow-sm hover:shadow-md"
              onClick={() => setIsMenuOpen(false)}
            >
              <Phone className="h-5 w-5 mr-3 text-primary-500" />
              Contact
            </Link>
            <Link
              to="/wishlist"
              className="flex items-center justify-between px-4 py-3.5 text-gray-700 hover:text-primary-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 rounded-xl text-base font-semibold transition-all duration-300 active:scale-98 shadow-sm hover:shadow-md"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center">
                <Heart className="h-5 w-5 mr-3 text-red-500" />
                Favoris
              </div>
              {wishlistCount > 0 && (
                <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              to="/cart"
              className="flex items-center justify-between px-4 py-3.5 text-gray-700 hover:text-primary-600 hover:bg-gradient-to-r hover:from-primary-50 hover:to-purple-50 rounded-xl text-base font-semibold transition-all duration-300 active:scale-98 shadow-sm hover:shadow-md"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center">
                <ShoppingCart className="h-5 w-5 mr-3 text-primary-500" />
                Panier
              </div>
              {cartCount > 0 && (
                <span className="bg-gradient-to-r from-primary-500 to-primary-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg">
                  {cartCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <>
                <div className="pt-2 mt-2 border-t border-gray-200">
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-3.5 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl text-base font-semibold transition-all duration-300 active:scale-98 shadow-sm hover:shadow-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-5 w-5 mr-3 text-primary-500" />
                    Profil
                  </Link>
                  <Link
                    to="/orders"
                    className="flex items-center px-4 py-3.5 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl text-base font-semibold transition-all duration-300 active:scale-98 shadow-sm hover:shadow-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ShoppingCart className="h-5 w-5 mr-3 text-primary-500" />
                    Mes Commandes
                  </Link>
                </div>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center px-4 py-3.5 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl text-base font-semibold transition-all duration-300 active:scale-98 shadow-sm hover:shadow-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Shield className="h-5 w-5 mr-3 text-primary-500" />
                    Panneau Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full text-left px-4 py-3.5 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-xl text-base font-semibold transition-all duration-300 active:scale-98 shadow-sm hover:shadow-md mt-2"
                >
                  <X className="h-5 w-5 mr-3 text-red-500" />
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <div className="pt-2 mt-2 border-t border-gray-200">
                  <Link
                    to="/login"
                    className="flex items-center px-4 py-3.5 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl text-base font-semibold transition-all duration-300 active:scale-98 shadow-sm hover:shadow-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-5 w-5 mr-3 text-primary-500" />
                    Connexion
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center justify-center px-4 py-3.5 btn-primary text-base font-semibold text-center mt-2 shadow-lg hover:shadow-xl active:scale-98 transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    S'inscrire
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
