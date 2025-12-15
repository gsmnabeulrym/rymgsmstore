import React, { useState } from 'react';
import { X, ZoomIn, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import './ProductImageGallery.css';

const ProductImageGallery = ({ images = [], productName = 'Product' }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Ensure images is an array
  const imageArray = Array.isArray(images) ? images : [images].filter(Boolean);
  
  // Fallback image if no images provided
  const displayImages = imageArray.length > 0 ? imageArray : ['/api/placeholder/600/600'];

  const handlePrevious = (e) => {
    e?.stopPropagation();
    setSelectedImage((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    setSelectedImage((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e) => {
    if (!isLightboxOpen) return;
    
    if (e.key === 'Escape') {
      setIsLightboxOpen(false);
      setIsZoomed(false);
    } else if (e.key === 'ArrowLeft') {
      handlePrevious();
    } else if (e.key === 'ArrowRight') {
      handleNext();
    }
  };

  const handleMouseMove = (e) => {
    if (!isZoomed) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setMousePosition({ x, y });
  };

  React.useEffect(() => {
    if (isLightboxOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isLightboxOpen]);

  return (
    <div className="product-image-gallery">
      {/* Main Image Display */}
      <div className="main-image-container">
        <div 
          className={`main-image-wrapper ${isZoomed ? 'zoomed' : ''}`}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
        >
          <img
            src={displayImages[selectedImage]}
            alt={`${productName} - Image ${selectedImage + 1}`}
            className="main-image"
            loading="lazy"
            decoding="async"
            style={isZoomed ? {
              transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
              transform: 'scale(2.5)'
            } : {}}
          />
          
          {/* Zoom Indicator */}
          {!isZoomed && (
            <div className="zoom-indicator">
              <ZoomIn className="w-5 h-5" />
              <span>Hover to zoom</span>
            </div>
          )}
          
          {/* Fullscreen Button */}
          <button
            className="fullscreen-btn"
            onClick={() => setIsLightboxOpen(true)}
            aria-label="Open fullscreen"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
          
          {/* Navigation Arrows (only if multiple images) */}
          {displayImages.length > 1 && (
            <>
              <button
                className="nav-arrow nav-arrow-left"
                onClick={handlePrevious}
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                className="nav-arrow nav-arrow-right"
                onClick={handleNext}
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
        
        {/* Image Counter */}
        {displayImages.length > 1 && (
          <div className="image-counter">
            {selectedImage + 1} / {displayImages.length}
          </div>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {displayImages.length > 1 && (
        <div className="thumbnail-gallery">
          {displayImages.map((image, index) => (
            <button
              key={index}
              className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
              onClick={() => setSelectedImage(index)}
              aria-label={`View image ${index + 1}`}
            >
              <img
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                loading="lazy"
                decoding="async"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="lightbox-overlay" onClick={() => setIsLightboxOpen(false)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button
              className="lightbox-close"
              onClick={() => setIsLightboxOpen(false)}
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6" />
            </button>
            
            {/* Lightbox Image */}
            <div className="lightbox-image-container">
              <img
                src={displayImages[selectedImage]}
                alt={`${productName} - Image ${selectedImage + 1}`}
                className="lightbox-image"
              />
            </div>
            
            {/* Lightbox Navigation */}
            {displayImages.length > 1 && (
              <>
                <button
                  className="lightbox-arrow lightbox-arrow-left"
                  onClick={handlePrevious}
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  className="lightbox-arrow lightbox-arrow-right"
                  onClick={handleNext}
                  aria-label="Next image"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
                
                {/* Lightbox Thumbnails */}
                <div className="lightbox-thumbnails">
                  {displayImages.map((image, index) => (
                    <button
                      key={index}
                      className={`lightbox-thumbnail ${selectedImage === index ? 'active' : ''}`}
                      onClick={() => setSelectedImage(index)}
                    >
                      <img src={image} alt={`Thumbnail ${index + 1}`} />
                    </button>
                  ))}
                </div>
              </>
            )}
            
            {/* Image Info */}
            <div className="lightbox-info">
              <span>{productName}</span>
              <span>{selectedImage + 1} / {displayImages.length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
