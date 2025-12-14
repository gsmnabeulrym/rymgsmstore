import React from 'react';

const Logo = ({ className = "", size = "md", showText = true, variant = "default", animated = true }) => {
  const sizeClasses = {
    xs: "h-8",
    sm: "h-10",
    md: "h-12", 
    lg: "h-14",
    xl: "h-20",
    "2xl": "h-28",
    "3xl": "h-36"
  };

  const textSizeClasses = {
    xs: "text-base",
    sm: "text-lg",
    md: "text-xl", 
    lg: "text-2xl",
    xl: "text-3xl",
    "2xl": "text-4xl",
    "3xl": "text-5xl"
  };

  const subTextSizeClasses = {
    xs: "text-xs",
    sm: "text-xs",
    md: "text-sm", 
    lg: "text-sm",
    xl: "text-base",
    "2xl": "text-lg",
    "3xl": "text-xl"
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Image with Animation */}
      <div className={`relative ${animated ? 'group' : ''}`}>
        {/* Glow Effect */}
        {animated && (
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 scale-150"></div>
        )}
        
        {/* Main Logo */}
        <img 
          src="/images/phones/rymgsmlogo.png" 
          alt="RYM GSM Logo"
          className={`${sizeClasses[size]} w-auto object-contain relative z-10 ${
            animated 
              ? 'transition-all duration-500 hover:scale-110 hover:drop-shadow-[0_0_25px_rgba(59,130,246,0.5)]' 
              : ''
          }`}
          style={{
            filter: animated ? 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))' : undefined
          }}
        />
        
        {/* Floating Particles */}
        {animated && (
          <>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary-400 rounded-full animate-ping opacity-75"></div>
            <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"></div>
            <div className="absolute top-1/2 -right-2 w-1 h-1 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
          </>
        )}
      </div>
      
      {/* Logo Text - Optional */}
      {showText && (
        <div className="hidden sm:block">
          <div className={`font-black tracking-tight ${textSizeClasses[size]} ${
            variant === 'light' 
              ? 'text-white drop-shadow-lg' 
              : 'bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient'
          }`}>
            RYM GSM
          </div>
          <div className={`font-semibold tracking-widest uppercase ${subTextSizeClasses[size]} ${
            variant === 'light' 
              ? 'text-white/80' 
              : 'text-gray-500'
          }`}>
            Nabeul
          </div>
        </div>
      )}
    </div>
  );
};

export default Logo;
