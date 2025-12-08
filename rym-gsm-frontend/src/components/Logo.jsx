import React from 'react';

const Logo = ({ className = "", size = "md" }) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12", 
    lg: "w-16 h-16",
    xl: "w-20 h-20"
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Logo Icon */}
      <div className={`${sizeClasses[size]} relative`}>
        {/* Main Circle Background */}
        <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center shadow-lg">
          {/* RYM Text */}
          <div className="text-white font-bold text-xs leading-none text-center">
            <div className="font-display font-black">RYM</div>
            <div className="text-xs font-semibold">GSM</div>
          </div>
        </div>
        
        {/* Floating Device Icons */}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center animate-float">
          <div className="w-2 h-2 bg-white rounded-sm"></div>
        </div>
        
        <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-primary-300 rounded-full flex items-center justify-center animate-bounce-slow">
          <div className="w-1 h-1 bg-white rounded-full"></div>
        </div>
        
        <div className="absolute top-0 -left-2 w-2 h-2 bg-primary-400 rounded-full animate-pulse-slow"></div>
        
        <div className="absolute -bottom-2 right-0 w-2 h-2 bg-primary-300 rounded-full animate-pulse-slow delay-1000"></div>
      </div>
      
      {/* Logo Text */}
      <div className="hidden sm:block">
        <div className="font-display font-bold text-xl gradient-text">
          RYM GSM
        </div>
        <div className="text-xs text-gray-600 font-medium">
          Mobile Solutions
        </div>
      </div>
    </div>
  );
};

export default Logo;
