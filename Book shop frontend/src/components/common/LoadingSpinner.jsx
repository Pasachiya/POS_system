import React from 'react';

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'white',
  className = '',
  text = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const colorClasses = {
    white: 'border-white border-l-transparent',
    blue: 'border-blue-500 border-l-transparent',
    gray: 'border-gray-500 border-l-transparent',
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div 
        className={`
          spinner 
          ${sizeClasses[size]} 
          ${colorClasses[color]}
          border-2 rounded-full
        `}
      />
      {text && (
        <p className="mt-2 text-sm text-gray-300 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;