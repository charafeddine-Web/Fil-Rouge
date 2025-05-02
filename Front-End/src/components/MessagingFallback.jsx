import React from 'react';
import { Link } from 'react-router-dom';

const MessagingFallback = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-8 text-center">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-16 w-16 text-gray-400 mb-4 mx-auto" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={1.5} 
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
        />
      </svg>
      <h2 className="text-xl font-semibold mb-2">Messaging System Unavailable</h2>
      <p className="text-gray-600 mb-4">
        We're unable to load your conversations at the moment. The messaging service might be experiencing technical difficulties.
      </p>
      <p className="text-gray-600 mb-6">
        Please try again later or contact support if the problem persists.
      </p>
      <div className="flex justify-center space-x-4">
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
        <Link 
          to="/" 
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default MessagingFallback; 