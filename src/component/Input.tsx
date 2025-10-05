import React from 'react';

// Define the Props interface for type safety and clarity
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id?: string;
  value?:string;
  name?: string;
  placeholder?: string;
  error?: string; // Optional error message
  isDark?: boolean; // Controls the theme (Dark or Light)
}

/**
 * A highly reusable and responsive custom Input component.
 * It supports dark/light modes and displays error messages.
 */
export const Input: React.FC<InputProps> = ({ 
  label, 
  value,
  id, 
  name, 
  placeholder, 
  error, 
  isDark = true, // Default to dark theme based on the visual reference
  className,
  ...rest 
}) => {
  // Define styles based on the theme
  const containerClass = `w-full transition-all duration-300 ${className || ''}`;

  const labelClass = isDark 
    ? "text-gray-300" // Light label on dark background
    : "text-gray-700"; // Dark label on light background

  const inputBaseClass = `
    w-full py-3 px-4 
    rounded-xl 
    text-base 
    transition-all duration-200 
    shadow-inner
    focus:outline-none 
  `;

  const inputDarkClass = `
    bg-gray-800 
    border border-gray-700 
    text-white 
    placeholder-gray-500 
    focus:border-amber-500 
    focus:ring-1 focus:ring-amber-500
  `;

  const inputLightClass = `
    bg-white 
    border border-gray-300 
    text-gray-900 
    placeholder-gray-500 
    focus:border-[#154576] 
    focus:ring-1 focus:ring-[#154576]
  `;
  
  // Combine classes, adding error styles if present
  const inputFinalClass = `
    ${inputBaseClass} 
    ${isDark ? inputDarkClass : inputLightClass}
    ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
  `;

  return (
    <div className={containerClass}>
      <label htmlFor={id} className={`block text-sm font-medium mb-1 ${labelClass}`}>
        {label}
      </label>
      <input
        id={id}
        value={value}
        name={name}
        placeholder={placeholder}
        className={inputFinalClass}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        {...rest}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
};