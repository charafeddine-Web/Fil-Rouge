import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const ChatButton = ({ userId, className }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);

  const handleStartChat = () => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      navigate('/login', { state: { redirectTo: `/chat/${userId}` } });
      return;
    }

    // Navigate to chat with the specific user
    navigate(`/chat/${userId}`);
  };

  return (
    <button
      onClick={handleStartChat}
      className={`flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors ${className || ''}`}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
      </svg>
      <span>Chat</span>
    </button>
  );
};

export default ChatButton; 