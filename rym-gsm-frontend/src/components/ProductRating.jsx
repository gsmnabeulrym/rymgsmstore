import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Star } from 'lucide-react';
import api from '../config/api';

const ProductRating = ({ productId, showCount = true, size = 'sm' }) => {
  const { data: ratingData, isLoading } = useQuery({
    queryKey: ['product-rating', productId],
    queryFn: async () => {
      const response = await api.get(`/products/${productId}/rating`);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  const sizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const textSizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  if (isLoading) {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`${sizeClasses[size]} text-gray-200 animate-pulse`} />
        ))}
        {showCount && (
          <span className={`${textSizeClasses[size]} text-gray-400 ml-2`}>Loading...</span>
        )}
      </div>
    );
  }

  const rating = ratingData?.averageRating || 0;
  const totalReviews = ratingData?.totalReviews || 0;

  // If no reviews, show empty stars
  if (totalReviews === 0) {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`${sizeClasses[size]} text-gray-200`} />
        ))}
        {showCount && (
          <span className={`${textSizeClasses[size]} text-gray-500 ml-2`}>No reviews</span>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          className={`${sizeClasses[size]} ${
            i < Math.floor(rating) 
              ? 'text-yellow-400 fill-current' 
              : i < rating 
                ? 'text-yellow-400 fill-current opacity-50' 
                : 'text-gray-200'
          }`} 
        />
      ))}
      {showCount && (
        <span className={`${textSizeClasses[size]} text-gray-500 ml-2`}>
          ({rating.toFixed(1)}) {totalReviews} review{totalReviews !== 1 ? 's' : ''}
        </span>
      )}
    </div>
  );
};

export default ProductRating;
