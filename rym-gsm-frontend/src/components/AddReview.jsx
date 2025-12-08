import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import StarRating from './StarRating';
import api from '../config/api';

const AddReview = ({ productId, onReviewAdded }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [existingReview, setExistingReview] = useState(null);
  const [checkingExisting, setCheckingExisting] = useState(false);

  // Check if user has already reviewed this product
  useEffect(() => {
    const checkExistingReview = async () => {
      if (!user || !productId) return;
      
      setCheckingExisting(true);
      try {
        // Get all reviews for this product and check if user has one
        const response = await api.get(`/products/${productId}/reviews?limit=100`);
        const userReview = response.data.reviews.find(review => review.user_id === user.id);
        setExistingReview(userReview || null);
      } catch (error) {
        console.error('Error checking existing review:', error);
      } finally {
        setCheckingExisting(false);
      }
    };

    checkExistingReview();
  }, [user, productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!rating) {
      setError('Veuillez s\u00e9lectionner une note');
      return;
    }
    
    if (comment.trim().length < 10) {
      setError('Le commentaire doit contenir au moins 10 caract\u00e8res');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await api.post(`/products/${productId}/reviews`, {
        rating,
        comment: comment.trim()
      });

      setSuccess(true);
      setRating(0);
      setComment('');
      setShowForm(false);
      
      // Set the new review as existing review
      setExistingReview(response.data.review);
      
      // Call callback to refresh reviews
      if (onReviewAdded) {
        onReviewAdded();
      }

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);

    } catch (error) {
      console.error('Error submitting review:', error);
      // Extract the actual error message from the response
      const errorMessage = error.response?.data?.message || error.message || 'Failed to submit review';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setRating(0);
    setComment('');
    setError(null);
    setShowForm(false);
  };

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Écrire un Avis</h3>
        <p className="text-gray-600 mb-4">Veuillez vous connecter pour écrire un avis sur ce produit.</p>
        <a
          href="/login"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Se Connecter pour Donner un Avis
        </a>
      </div>
    );
  }

  // Show loading while checking for existing review
  if (checkingExisting) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  // Show existing review if user has already reviewed this product
  if (existingReview) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-lg font-medium text-blue-800 mb-2">Vous avez déjà donné un avis sur ce produit</h3>
            <p className="text-blue-700 mb-4">Merci pour votre retour ! Voici votre avis :</p>
            
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="flex items-center mb-2">
                <StarRating rating={existingReview.rating} size="sm" readonly />
                <span className="ml-2 text-sm text-gray-600">
                  {new Date(existingReview.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700">{existingReview.comment}</p>
            </div>
            
            <p className="text-sm text-blue-600 mt-4">
              Chaque client ne peut soumettre qu'un seul avis par produit pour garantir l'authenticité.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show success message
  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">Avis Soumis !</h3>
            <p className="text-sm text-green-700 mt-1">
              Merci pour votre avis. Il sera visible après approbation de l'administrateur.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      {!showForm ? (
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Partagez Votre Expérience</h3>
          <p className="text-gray-600 mb-4">Aidez les autres en écrivant un avis sur ce produit.</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Écrire un Avis
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Écrire un Avis</h3>
            <button
              type="button"
              onClick={resetForm}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Votre Note *
            </label>
            <div className="flex items-center space-x-2">
              <StarRating
                rating={rating}
                onRatingChange={setRating}
                size="lg"
              />
              <span className="text-sm text-gray-600">
                {rating > 0 ? `${rating} étoile${rating !== 1 ? 's' : ''}` : 'Sélectionner une note'}
              </span>
            </div>
          </div>

          {/* Comment */}
          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
              Votre Avis *
            </label>
            <textarea
              id="comment"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Partagez votre expérience avec ce produit... (minimum 10 caractères)"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {comment.length}/10 caractères minimum
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Impossible de soumettre l'avis</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex items-center space-x-3">
            <button
              type="submit"
              disabled={isSubmitting || !rating || comment.trim().length < 10}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Envoi en cours...
                </div>
              ) : (
                'Soumettre l\'Avis'
              )}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddReview;
