import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getEcho, subscribeToUserChannel } from '../services/echo';
import api from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCircle, faEnvelope } from '@fortawesome/free-solid-svg-icons';

const ChatNotifications = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch unread message count
  const fetchUnreadCount = async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await api.get('/messages/unread/count');
      if (response.data && response.data.count !== undefined) {
        setUnreadCount(response.data.count);
      }
    } catch (error) {
      console.error('Error fetching unread message count:', error);
    }
  };

  // Fetch recent messages
  const fetchRecentMessages = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const response = await api.get('/messages/contacts');
      
      if (response.data && response.data.contacts) {
        // Sort by unread count and only keep the ones with unread messages
        const unreadContacts = response.data.contacts
          .filter(contact => contact.unread > 0)
          .sort((a, b) => b.unread - a.unread)
          .slice(0, 5);  // Limit to 5 recent unread conversations
          
        setRecentMessages(unreadContacts);
      }
    } catch (error) {
      console.error('Error fetching recent messages:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initialize and fetch data
  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadCount();
      
      // Set up polling for unread count
      const intervalId = setInterval(fetchUnreadCount, 60000); // Every minute
      
      return () => clearInterval(intervalId);
    }
  }, [isAuthenticated]);

  // Fetch recent messages when dropdown is opened
  useEffect(() => {
    if (showDropdown) {
      fetchRecentMessages();
    }
  }, [showDropdown]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!isAuthenticated || !user) return;
    
    // Get Echo instance
    const echo = getEcho();
    if (!echo) return;
    
    // Subscribe to user's channel
    subscribeToUserChannel(user.id, (data) => {
      // Increment unread count when new message received
      setUnreadCount(prev => prev + 1);
      
      // Refetch recent messages if dropdown is open
      if (showDropdown) {
        fetchRecentMessages();
      }
    });
    
    return () => {
      // Cleanup Echo subscription
      if (echo) {
        echo.leave(`private-user.${user.id}`);
      }
    };
  }, [isAuthenticated, user, showDropdown]);

  // Toggle dropdown
  const toggleDropdown = () => {
    setShowDropdown(prev => !prev);
  };

  // Format name
  const formatName = (name) => {
    if (!name) return 'Utilisateur';
    if (name.length > 18) {
      return name.substring(0, 15) + '...';
    }
    return name;
  };

  if (!isAuthenticated) return null;

  return (
    <div className="relative">
      <button 
        className="relative p-1 rounded-full text-gray-600 hover:text-blue-500 focus:outline-none"
        onClick={toggleDropdown}
        aria-label="Notifications de messages"
      >
        <FontAwesomeIcon icon={faBell} className="text-lg" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>
      
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50 overflow-hidden border border-gray-200">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold text-gray-700">Messages non lus</h3>
              <Link 
                to="/chat" 
                className="text-xs text-blue-500 hover:text-blue-700"
                onClick={() => setShowDropdown(false)}
              >
                Voir tous
              </Link>
            </div>
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">
                <div className="w-6 h-6 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin mx-auto mb-2"></div>
                Chargement...
              </div>
            ) : recentMessages.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <FontAwesomeIcon icon={faEnvelope} className="text-gray-300 text-2xl mb-2" />
                <p>Pas de messages non lus</p>
              </div>
            ) : (
              <ul>
                {recentMessages.map(contact => (
                  <li key={contact.id} className="border-b border-gray-100 last:border-0">
                    <Link 
                      to={`/chat/${contact.id}`} 
                      className="block px-4 py-3 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      <div className="flex items-center">
                        <div className="relative flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                            {contact.avatar ? (
                              <img 
                                src={contact.avatar} 
                                alt={contact.name} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-lg font-semibold text-gray-600">
                                {contact.name ? contact.name.charAt(0).toUpperCase() : '?'}
                              </span>
                            )}
                          </div>
                          <FontAwesomeIcon 
                            icon={faCircle} 
                            className="absolute -bottom-1 -right-1 text-xs text-blue-500" 
                          />
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-800">{formatName(contact.name)}</span>
                            <span className="text-xs bg-red-500 text-white rounded-full px-2 py-0.5">
                              {contact.unread}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">
                            {contact.role === 'conducteur' ? 'Conducteur' : 
                             contact.role === 'passager' ? 'Passager' : 
                             'Utilisateur'}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatNotifications; 