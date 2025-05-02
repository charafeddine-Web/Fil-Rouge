import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';

// This component has icon SVG inline, but if real avatar images are added later,
// they should use '/assets/placeholder-avatar.png' as fallback instead of placeholder.com

const MessageButton = ({ userId, userName, className }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const startConversation = async () => {
    // Vérifier si l'utilisateur est authentifié
    if (!isAuthenticated) {
      toast.error('Vous devez être connecté pour envoyer un message');
      navigate('/login', { state: { redirectTo: `/chat/${userId}` } });
      return;
    }

    try {
      // Première tentative : Ajouter le contact via Chatify
      try {
        await api.post('/chatify/addContact', { user_id: userId });
      } catch (chatifyError) {
        console.warn('Error with Chatify addContact, trying API ChatController:', chatifyError);
        
        // Deuxième tentative : Utiliser le ChatController standard
        try {
          await api.post('/chat/addContact', { user_id: userId });
        } catch (chatControllerError) {
          console.warn('Error with ChatController, proceeding anyway:', chatControllerError);
          // Continue anyway - we'll just navigate to the chat page
        }
      }
      
      // Rediriger vers la conversation avec cet utilisateur
      navigate(`/chat/${userId}`);
      
      toast.success(`Conversation avec ${userName} ouverte`);
    } catch (error) {
      console.error('Erreur lors de l\'ouverture de la conversation:', error);
      
      // Even if we had an error, still try to navigate to chat
      if (error.response && error.response.status === 403) {
        toast.error('Vous ne pouvez pas contacter cet utilisateur. Vérifiez que vous avez une réservation avec lui.');
      } else {
        toast.warning('Redirection vers la messagerie. La conversation pourrait ne pas être initialisée correctement.');
        navigate(`/chat/${userId}`);
      }
    }
  };

  return (
    <button
      onClick={startConversation}
      className={`flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors ${className || ''}`}
    >
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
      <span>Message</span>
    </button>
  );
};

export default MessageButton; 