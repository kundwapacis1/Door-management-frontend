import React from 'react';

// 1. Define the TypeScript interface for the component's props
interface BigButtonProps {
  /** The content of the button (e.g., "Sign in", "Continue") */
  children: React.ReactNode;
  /** Optional click handler for the button */
  onClick?: () => void;
  /** Optional type attribute for the button (e.g., 'submit', 'button') */
  type?: 'button' | 'submit' | 'reset';
  /** Optional additional class names for customization */
  className?: string;
  /** Optional disabled state */
  disabled?: boolean;
}

/**
 * A large, vibrant gradient button component designed with Tailwind CSS.
 * It uses a blue-to-purple gradient, large text, and rounded corners
 * to match the provided image reference.
 */
export const BigButton: React.FC<BigButtonProps> = ({ 
  children, 
  onClick, 
  type = 'button', 
  className = '', 
  disabled = false 
}) => {
  // Base classes for the button, focusing on size, gradient, and responsiveness
  const baseClasses = 
    `w-full sm:w-auto 
     py-4 px-12 
     text-white 
     text-lg md:text-2xl 
     font-extrabold 
     rounded-xl 
     shadow-2xl 
     shadow-purple-500/50 
     transition 
     duration-300 
     ease-in-out 
     focus:outline-none focus:ring-4 focus:ring-purple-300/50`;

  // Gradient classes to match the vibrant look
  const gradientClasses = 
    'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700';

  // Classes for active/interaction state
  const interactiveClasses = 
    'transform active:scale-[0.98] hover:scale-[1.02]';

  // Disabled classes
  const disabledClasses = 
    'opacity-50 cursor-not-allowed shadow-none';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${disabled ? disabledClasses : `${gradientClasses} ${interactiveClasses}`} ${className}`}
    >
      {children}
    </button>
  );
};