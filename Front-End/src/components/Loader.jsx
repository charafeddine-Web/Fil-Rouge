import React from "react";

const Loader = ({ size = "md", fullScreen = false, text = "Loading..." }) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg",
  };

  // Animated circles with the main color
  const LoaderCircles = () => (
    <div className="relative">
      <div
        className={`${sizeClasses[size]} rounded-full border-4 border-gray-200`}
      ></div>
      <div
        className={`absolute top-0 left-0 ${sizeClasses[size]} rounded-full border-4 border-green-500 border-t-transparent animate-spin`}
      ></div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-80 flex flex-col items-center justify-center z-50">
        <LoaderCircles />
        {text && (
          <p
            className={`mt-4 font-urbanist font-medium text-gray-600 ${textSizes[size]}`}
          >
            {text}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <LoaderCircles />
      {text && (
        <p
          className={`mt-2 font-urbanist font-medium text-gray-600 ${textSizes[size]}`}
        >
          {text}
        </p>
      )}
    </div>
  );
};

export default Loader;