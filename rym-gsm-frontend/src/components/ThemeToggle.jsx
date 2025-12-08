import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = ({ variant = 'default', className = '' }) => {
  const { theme, toggleTheme, isDark } = useTheme();

  if (variant === 'icon-only') {
    return (
      <button
        onClick={toggleTheme}
        className={`theme-toggle-icon ${className}`}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        {isDark ? (
          <Sun className="w-5 h-5 text-yellow-400" />
        ) : (
          <Moon className="w-5 h-5 text-gray-600" />
        )}
      </button>
    );
  }

  if (variant === 'switch') {
    return (
      <button
        onClick={toggleTheme}
        className={`theme-toggle-switch ${isDark ? 'dark' : 'light'} ${className}`}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        <div className="toggle-track">
          <div className="toggle-thumb">
            {isDark ? (
              <Moon className="w-4 h-4 text-white" />
            ) : (
              <Sun className="w-4 h-4 text-yellow-500" />
            )}
          </div>
        </div>
      </button>
    );
  }

  // Default variant with label
  return (
    <button
      onClick={toggleTheme}
      className={`theme-toggle-default ${className}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <div className="toggle-icon">
        {isDark ? (
          <Moon className="w-5 h-5" />
        ) : (
          <Sun className="w-5 h-5" />
        )}
      </div>
      <span className="toggle-label">
        {isDark ? 'Dark' : 'Light'} Mode
      </span>
    </button>
  );
};

export default ThemeToggle;
