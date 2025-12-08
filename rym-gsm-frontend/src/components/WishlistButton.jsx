import React from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '../contexts/WishlistContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const WishlistButton = ({ 
  product, 
  size = 'md', 
  className = '', 
  showTooltip = true,
  variant = 'default' // 'default', 'floating', 'minimal'
}) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const isLiked = isInWishlist(product.id);

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please login to add items to wishlist');
      navigate('/login');
      return;
    }

    await toggleWishlist(product);
  };

  const getButtonStyles = () => {
    const baseStyles = `${sizes[size]} rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110 ${className}`;
    
    switch (variant) {
      case 'floating':
        return `${baseStyles} ${
          isLiked 
            ? 'bg-red-500 text-white shadow-lg' 
            : 'bg-white/90 text-gray-600 hover:bg-white shadow-md'
        }`;
      case 'minimal':
        return `${baseStyles} ${
          isLiked 
            ? 'text-red-500' 
            : 'text-gray-400 hover:text-red-500'
        }`;
      default:
        return `${baseStyles} ${
          isLiked 
            ? 'bg-red-500 text-white' 
            : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500'
        }`;
    }
  };

  return (
    <div className="relative group z-10">
      <button
        onClick={handleClick}
        className={getButtonStyles()}
        aria-label={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
        style={{ zIndex: 20 }}
      >
        <Heart 
          className={`${iconSizes[size]} ${
            isLiked ? 'fill-current' : ''
          } transition-all duration-200`} 
        />
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
          <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap">
            {isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}

      {/* Pulse animation for new additions */}
      {isLiked && (
        <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-20 pointer-events-none"></div>
      )}
    </div>
  );
};

export default WishlistButton;
