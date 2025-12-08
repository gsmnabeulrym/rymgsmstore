import React from 'react';
import { useComparison } from '../../contexts/ComparisonContext';
import { useNavigate } from 'react-router-dom';
import './ComparisonBar.css';

const ComparisonBar = () => {
  const { 
    comparisonList, 
    comparisonCount, 
    canCompare, 
    removeFromComparison, 
    clearComparison,
    openComparison 
  } = useComparison();
  
  const navigate = useNavigate();

  if (comparisonCount === 0) {
    return null;
  }

  const handleCompare = () => {
    if (canCompare) {
      navigate('/compare');
    }
  };

  const handleRemoveProduct = (productId, e) => {
    e.stopPropagation();
    removeFromComparison(productId);
  };

  return (
    <div className="comparison-bar">
      <div className="comparison-bar-content">
        <div className="comparison-bar-left">
          <div className="comparison-bar-title">
            <span className="comparison-icon">⚖️</span>
            Compare Products ({comparisonCount}/4)
          </div>
          
          <div className="comparison-bar-products">
            {comparisonList.map((product) => (
              <div key={product.id} className="comparison-bar-product">
                <img 
                  src={product.image_url || '/api/placeholder/40/40'} 
                  alt={product.name}
                  className="comparison-bar-product-image"
                />
                <div className="comparison-bar-product-info">
                  <span className="comparison-bar-product-name">
                    {product.name.length > 20 ? 
                      `${product.name.substring(0, 20)}...` : 
                      product.name
                    }
                  </span>
                  <span className="comparison-bar-product-price">
                    {product.price} DT
                  </span>
                </div>
                <button
                  className="comparison-bar-remove"
                  onClick={(e) => handleRemoveProduct(product.id, e)}
                  title="Remove from comparison"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="comparison-bar-right">
          <button
            className="comparison-bar-clear"
            onClick={clearComparison}
            title="Clear all"
          >
            Clear All
          </button>
          
          <button
            className={`comparison-bar-compare ${canCompare ? 'enabled' : 'disabled'}`}
            onClick={handleCompare}
            disabled={!canCompare}
          >
            {canCompare ? 'Compare Now' : 'Add More Products'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComparisonBar;
