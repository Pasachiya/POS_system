import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  showCloseButton = true 
}) => {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="modal-backdrop fixed inset-0"
        onClick={onClose}
      />
      
      {/* Modal container */}
      <div className="min-h-screen px-4 text-center">
        {/* This element is to trick the browser into centering the modal contents */}
        <span className="inline-block h-screen align-middle" aria-hidden="true">
          &#8203;
        </span>
        
        {/* Modal content */}
        <div className={`
          inline-block w-full ${sizeClasses[size]} 
          glass-card p-6 my-8 text-left align-middle 
          transform transition-all duration-300 ease-out
        `}>
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between mb-4">
              {title && (
                <h3 className="text-lg font-medium text-white">
                  {title}
                </h3>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="glass-button p-2 hover:bg-opacity-30"
                >
                  <X size={20} className="text-gray-300" />
                </button>
              )}
            </div>
          )}
          
          {/* Content */}
          <div className="text-gray-100">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;