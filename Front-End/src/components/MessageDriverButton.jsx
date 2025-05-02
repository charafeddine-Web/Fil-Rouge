import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';

// This component has icon SVG inline, but if real avatar images are added later,
// they should use '/assets/placeholder-avatar.png' as fallback instead of placeholder.com

const MessageDriverButton = ({ driverId, driverName, className }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const startChatWithDriver = async () => {
    // Vérifier si l'utilisateur est authentifié
    if (!isAuthenticated) {
      toast.error('Vous devez être connecté pour contacter le conducteur');
      navigate('/login');
      return;
    }
    
    console.log(`Attempting to contact driver ${driverId} (${driverName})`);
    
    try {
      setLoading(true);
      
      // Ajouter le conducteur comme contact
      await api.post('/messages/contact', { user_id: driverId });
      
      // Naviguer vers la page de chat
      navigate(`/chat/${driverId}`);
    } catch (error) {
      console.error('Error with adding contact, proceeding anyway:', error);
      // Still try to navigate to chat even if adding contact fails
      navigate(`/chat/${driverId}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={startChatWithDriver}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''} ${className || ''}`}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      )}
      <span>Contacter le conducteur</span>
    </button>
  );
};

export default MessageDriverButton; 