import React from 'react';

const GlassCard = ({ 
  children, 
  className = '', 
  hover = false,
  onClick,
  padding = 'p-6',
  ...props 
}) => {
  const baseClasses = `
    glass-card
    ${padding}
    ${hover ? 'hover:bg-opacity-20 hover:scale-105 cursor-pointer' : ''}
    ${onClick ? 'cursor-pointer' : ''}
    transition-all duration-300
    ${className}
  `;

  return (
    <div 
      className={baseClasses}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;