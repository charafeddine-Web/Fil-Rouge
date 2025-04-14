import React from "react";

const Button = ({ 
  children, 
  type = "button", 
  onClick, 
  variant = "primary", 
  size = "md", 
  fullWidth = false, 
  disabled = false,
  loading = false,
  className = "",
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 font-urbanist";
  
  const variants = {
    primary: "bg-green-500 hover:bg-green-600 active:bg-green-700 text-white focus:ring-green-500",
    secondary: "bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-800 focus:ring-gray-300",
    outline: "bg-transparent border border-gray-300 hover:bg-gray-50 text-gray-700 focus:ring-gray-300",
    danger: "bg-red-500 hover:bg-red-600 active:bg-red-700 text-white focus:ring-red-500",
  };
  
  const sizes = {
    sm: "text-sm py-1.5 px-3",
    md: "text-base py-2.5 px-5",
    lg: "text-lg py-3 px-6",
  };
  
  const widthClass = fullWidth ? "w-full" : "";
  const disabledClass = disabled ? "opacity-60 cursor-not-allowed" : "";
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseStyles} 
        ${variants[variant]} 
        ${sizes[size]} 
        ${widthClass} 
        ${disabledClass} 
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;