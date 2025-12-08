import React, { useState, useEffect } from 'react';
import { useComparison } from '../contexts/ComparisonContext';
import { useNavigate } from 'react-router-dom';
import './ComparisonPage.css';

const ComparisonPage = () => {
  const { 
    comparisonList, 
    getComparisonData, 
    removeFromComparison, 
    clearComparison,
    loading 
  } = useComparison();
  
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  // Set CSS variable for product count
  useEffect(() => {
    document.documentElement.style.setProperty('--product-count', products.length);
  }, [products]);

  useEffect(() => {
    if (comparisonList.length === 0) {
      // If no products at all, redirect after a short delay to allow context to load
      const timer = setTimeout(() => {
        if (comparisonList.length === 0) {
          navigate('/');
        }
      }, 1000);
      return () => clearTimeout(timer);
    }

    if (comparisonList.length >= 1) {
      loadComparisonData();
    }
  }, [comparisonList, navigate]);

  const loadComparisonData = async () => {
    const data = await getComparisonData();
    setProducts(data);
    
    // Extract all available features
    if (data.length > 0) {
      const allFeatures = new Set();
      
      // Add basic features
      allFeatures.add('price');
      allFeatures.add('brand');
      allFeatures.add('stock_quantity');
      
      // Add specification features
      data.forEach(product => {
        if (product.specifications) {
          Object.keys(product.specifications).forEach(key => {
            allFeatures.add(key);
          });
        }
      });
      
      const featuresArray = Array.from(allFeatures);
      setSelectedFeatures(showAllFeatures ? featuresArray : featuresArray.slice(0, 8));
    }
  };

  const getFeatureValue = (product, feature) => {
    switch (feature) {
      case 'price':
        return `${product.price} DT`;
      case 'brand':
        return product.brand;
      case 'stock_quantity':
        return product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Out of stock';
      default:
        return product.specifications?.[feature] || 'N/A';
    }
  };

  const getFeatureDisplayName = (feature) => {
    const displayNames = {
      'price': 'Price',
      'brand': 'Brand',
      'stock_quantity': 'Availability',
      'screen_size': 'Screen Size',
      'ram': 'RAM',
      'storage': 'Storage',
      'main_camera': 'Main Camera',
      'battery_capacity': 'Battery',
      'processor': 'Processor',
      'os': 'Operating System'
    };
    
    return displayNames[feature] || feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleAddToCart = (product) => {
    // Add to cart logic here
    console.log('Adding to cart:', product.name);
    alert(`${product.name} added to cart!`);
  };

  const toggleFeatureView = () => {
    setShowAllFeatures(!showAllFeatures);
    loadComparisonData();
  };

  if (loading) {
    return (
      <div className="comparison-loading">
        <div className="loading-spinner"></div>
        <p>Loading comparison data...</p>
      </div>
    );
  }

  if (products.length === 0 && comparisonList.length === 0) {
    return (
      <div className="comparison-empty">
        <h2>No products to compare</h2>
        <p>Please add at least 2 products to compare</p>
        <button onClick={() => navigate('/')} className="btn-primary">
          Browse Products
        </button>
      </div>
    );
  }

  if (products.length === 0 && comparisonList.length > 0) {
    return (
      <div className="comparison-loading">
        <div className="loading-spinner"></div>
        <p>Loading comparison data...</p>
        <p>Found {comparisonList.length} products in comparison list</p>
      </div>
    );
  }

  return (
    <div className="comparison-page">
      <div className="comparison-header">
        <div className="comparison-header-left">
          <button 
            className="comparison-back-btn"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
          <h1>Compare Products ({products.length})</h1>
        </div>
        
        <div className="comparison-header-right">
          <button 
            className="comparison-toggle-features"
            onClick={toggleFeatureView}
          >
            {showAllFeatures ? 'Show Key Features' : 'Show All Features'}
          </button>
          <button 
            className="comparison-clear-all"
            onClick={clearComparison}
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="comparison-container" style={{ '--product-count': products.length }}>
        <div className="comparison-table">
          {/* Product Headers */}
          <div className="comparison-row comparison-products-row">
            <div className="comparison-feature-label">Products</div>
            {products.map((product) => (
              <div key={product.id} className="comparison-product-card">
                <button
                  className="comparison-remove-product"
                  onClick={() => removeFromComparison(product.id)}
                  title="Remove from comparison"
                >
                  ×
                </button>
                
                <img 
                  src={product.image_url || '/api/placeholder/200/200'} 
                  alt={product.name}
                  className="comparison-product-image"
                />
                
                <div className="comparison-product-info">
                  <h3 className="comparison-product-name">{product.name}</h3>
                  <div className="comparison-product-price">
                    <span className="current-price">{product.price} DT</span>
                    {product.original_price > product.price && (
                      <>
                        <span className="original-price">{product.original_price} DT</span>
                        <span className="discount-badge">-{product.discount}%</span>
                      </>
                    )}
                  </div>
                  
                  <button 
                    className="comparison-add-to-cart"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Feature Comparison Rows */}
          {selectedFeatures.map((feature) => (
            <div key={feature} className="comparison-row">
              <div className="comparison-feature-label">
                {getFeatureDisplayName(feature)}
              </div>
              {products.map((product) => (
                <div key={product.id} className="comparison-feature-value">
                  {getFeatureValue(product, feature)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Suggestions for more products */}
      <div className="comparison-suggestions">
        <h3>Looking for more options?</h3>
        <button 
          className="btn-secondary"
          onClick={() => navigate('/')}
        >
          Browse More Products
        </button>
      </div>
    </div>
  );
};

export default ComparisonPage;
