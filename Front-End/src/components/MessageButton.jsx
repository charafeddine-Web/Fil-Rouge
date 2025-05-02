import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage } from '@fortawesome/free-solid-svg-icons';

// This component has icon SVG inline, but if real avatar images are added later,
// they should use '/assets/placeholder-avatar.png' as fallback instead of placeholder.com

const MessageButton = ({ userId, buttonText = 'Contacter', className = '', variant = 'primary' }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleMessageClick = async () => {
    try {
      setLoading(true);
      
      // Add the user as a contact
      await api.post('/messages/contact', { user_id: userId });
      
      // Navigate to the chat page with this user
      navigate(`/chat/${userId}`);
    } catch (error) {
      console.error('Error initiating chat:', error);
      toast.error('Impossible de démarrer la conversation');
    } finally {
      setLoading(false);
    }
  };

  // Style variants
  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-500 hover:bg-blue-600 text-white';
      case 'secondary':
        return 'bg-gray-200 hover:bg-gray-300 text-gray-800';
      case 'outline':
        return 'bg-white hover:bg-gray-100 text-blue-500 border border-blue-500';
      case 'green':
        return 'bg-green-500 hover:bg-green-600 text-white';
      default:
        return 'bg-blue-500 hover:bg-blue-600 text-white';
    }
  };

  return (
    <button
      onClick={handleMessageClick}
      disabled={loading}
      className={`flex items-center px-3 py-1.5 rounded transition-colors ${getButtonStyle()} ${className}`}
    >
      {loading ? (
        <span className="flex items-center justify-center w-5 h-5">
          <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
        </span>
      ) : (
        <>
          <FontAwesomeIcon icon={faMessage} className="mr-1.5" />
          {buttonText}
        </>
      )}
    </button>
  );
};

export default MessageButton; 