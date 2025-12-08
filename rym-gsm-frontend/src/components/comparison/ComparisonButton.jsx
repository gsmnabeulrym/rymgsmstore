import React from 'react';
import { useComparison } from '../../contexts/ComparisonContext';
import './ComparisonButton.css';

const ComparisonButton = ({ product, variant = 'default' }) => {
  const { addToComparison, removeFromComparison, isInComparison, isFull } = useComparison();
  
  const isInCompare = isInComparison(product.id);
  
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInCompare) {
      removeFromComparison(product.id);
    } else {
      addToComparison(product);
    }
  };

  const getButtonClass = () => {
    let baseClass = 'comparison-btn';
    
    if (variant === 'floating') {
      baseClass += ' comparison-btn-floating';
    } else if (variant === 'small') {
      baseClass += ' comparison-btn-small';
    }
    
    if (isInCompare) {
      baseClass += ' comparison-btn-active';
    }
    
    if (isFull && !isInCompare) {
      baseClass += ' comparison-btn-disabled';
    }
    
    return baseClass;
  };

  const getButtonText = () => {
    if (isInCompare) {
      return variant === 'small' ? '✓' : '✓ Added';
    }
    
    if (isFull && !isInCompare) {
      return variant === 'small' ? '⚠' : 'Limit Reached';
    }
    
    return variant === 'small' ? '+' : '+ Compare';
  };

  const getTooltip = () => {
    if (isInCompare) {
      return 'Remove from comparison';
    }
    
    if (isFull && !isInCompare) {
      return 'Maximum 4 products can be compared';
    }
    
    return 'Add to comparison';
  };

  return (
    <button
      className={getButtonClass()}
      onClick={handleClick}
      disabled={isFull && !isInCompare}
      title={getTooltip()}
      aria-label={getTooltip()}
    >
      {variant === 'floating' ? (
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
        >
          {isInCompare ? (
            <path d="M20 6L9 17l-5-5" />
          ) : (
            <path d="M12 5v14M5 12h14" />
          )}
        </svg>
      ) : (
        <span className="comparison-btn-text">{getButtonText()}</span>
      )}
    </button>
  );
};

export default ComparisonButton;
