import { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { getEcho, subscribeToUserChannel, subscribeToConversation, leaveChannel } from '../services/echo';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faArrowLeft, faCircle } from '@fortawesome/free-solid-svg-icons';

const Chat = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const { userId } = useParams();
  const navigate = useNavigate();
  
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [shouldShowContacts, setShouldShowContacts] = useState(true);
  
  const messagesEndRef = useRef(null);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Vous devez être connecté pour accéder aux messages');
      navigate('/login', { state: { redirectTo: `/chat${userId ? `/${userId}` : ''}` } });
    }
  }, [isAuthenticated, navigate, userId]);
  
  // Determine if we should show contacts sidebar
  useEffect(() => {
    if (userId) {
      const isMobile = window.innerWidth < 768;
      setShouldShowContacts(!isMobile);
    } else {
      setShouldShowContacts(true);
    }

    const handleResize = () => {
      if (activeContact) {
        const isMobile = window.innerWidth < 768;
        setShouldShowContacts(!isMobile);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [userId, activeContact]);
  
  // Fetch contacts
  const fetchContacts = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/messages/contacts');
      
      if (response.data && response.data.contacts) {
        const sortedContacts = response.data.contacts.sort((a, b) => 
          (b.unread - a.unread) || (a.name || '').localeCompare(b.name || '')
        );
        
        setContacts(sortedContacts);
        
        if (userId) {
          const contact = sortedContacts.find(c => c.id.toString() === userId);
          if (contact) {
            setActiveContact(contact);
          } else {
            try {
              await fetchUserById(userId);
            } catch (userError) {
              console.error('Error fetching user:', userError);
              toast.error('Utilisateur introuvable');
            }
          }
        }
      } else {
        console.warn('Invalid response format:', response.data);
        setContacts([]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setLoading(false);
      setError('Impossible de charger les contacts. Veuillez réessayer.');
      setContacts([]);
    }
  };
  
  // Load contacts on component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchContacts();
      
      const intervalId = setInterval(() => {
        fetchContacts();
      }, 30000);
      
      return () => clearInterval(intervalId);
    }
  }, [isAuthenticated]);
  
  // Update URL when userId param changes
  useEffect(() => {
    if (userId && contacts.length > 0) {
      const contact = contacts.find(c => c.id.toString() === userId);
      if (contact) {
        setActiveContact(contact);
      }
    }
  }, [userId, contacts]);
  
  // Fetch user by ID and create contact
  const fetchUserById = async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      
      if (response.data && response.data.user) {
        const userData = response.data.user;
        
        // Create contact info from user data
        const displayName = userData.name || 
                           (userData.nom && userData.prenom ? `${userData.nom} ${userData.prenom}` : '') ||
                           userData.email || 
                           `User ${id}`;
        
        const contactInfo = {
          id: userData.id,
          name: displayName,
          role: userData.role || '',
          avatar: userData.photoDeProfil || '',
          active_status: false,
          unread: 0
        };
        
        setActiveContact(contactInfo);
        
        if (!contacts.some(c => c.id === contactInfo.id)) {
          setContacts(prev => [...prev, contactInfo]);
        }
        
        // Add contact
        try {
          await api.post('/messages/contact', { user_id: id });
        } catch (error) {
          console.warn('Error adding contact:', error);
        }
        
        return contactInfo;
      } else {
        throw new Error('Invalid user data format');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      toast.error('Utilisateur introuvable');
      
      return null;
    }
  };
  
  // Subscribe to message channels
  useEffect(() => {
    if (!user || !isAuthenticated) return;
    
    // Initialize Echo if needed
    const echo = getEcho();
    if (!echo) return;
    
    // Listen for messages on user's channel
    subscribeToUserChannel(user.id, (data) => {
      const message = data.message;
      
      // If message is from active contact, add it to messages
      if (activeContact && message.sender_id === activeContact.id) {
        setMessages(prev => [...prev, message]);
        
        // Mark as read
        api.post('/messages/read', { from_id: activeContact.id })
          .catch(error => console.warn('Error marking message as read:', error));
      }
      
      // Update unread count for contact
      setContacts(prev => 
        prev.map(contact => 
          contact.id === message.sender_id 
            ? { ...contact, unread: activeContact?.id === message.sender_id ? 0 : (contact.unread || 0) + 1 }
            : contact
        )
      );
    });
    
    // Clean up
    return () => {
      // Leave channels
      leaveChannel(`private-user.${user.id}`);
      
      if (activeContact) {
        leaveChannel(`private-chat.${user.id}.${activeContact.id}`);
        leaveChannel(`private-chat.${activeContact.id}.${user.id}`);
      }
    };
  }, [user, isAuthenticated, activeContact]);
  
  // Fetch messages when active contact changes
  useEffect(() => {
    if (!activeContact) return;
    
    const fetchMessages = async () => {
      try {
        setLoading(true);
        
        const response = await api.get(`/messages/${activeContact.id}`);
        
        if (response.data && response.data.messages) {
          setMessages(response.data.messages);
        } else {
          setMessages([]);
        }
        
        // Mark as read
        try {
          await api.post('/messages/read', { from_id: activeContact.id });
        } catch (error) {
          console.warn('Error marking messages as read:', error);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setLoading(false);
        setError('Impossible de charger les messages. Veuillez réessayer.');
        setMessages([]);
      }
    };
    
    fetchMessages();
    
    // Update the URL without reloading
    navigate(`/chat/${activeContact.id}`, { replace: true });
  }, [activeContact, navigate]);
  
  // Subscribe to conversation channel when active contact changes
  useEffect(() => {
    if (!user || !isAuthenticated || !activeContact) return;
    
    // Initialize Echo if needed
    const echo = getEcho();
    if (!echo) return;
    
    // Listen for messages on conversation channel
    subscribeToConversation(user.id, activeContact.id, (data) => {
      const message = data.message;
      setMessages(prev => [...prev, message]);
      
      // Mark as read if from active contact
      if (message.sender_id === activeContact.id) {
        api.post('/messages/read', { from_id: activeContact.id })
          .catch(error => console.warn('Error marking message as read:', error));
      }
    });
    
    // Clean up
    return () => {
      leaveChannel(`private-chat.${user.id}.${activeContact.id}`);
      leaveChannel(`private-chat.${activeContact.id}.${user.id}`);
    };
  }, [user, isAuthenticated, activeContact]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Handle sending message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!messageText.trim() || !activeContact) return;
    
    try {
      setSending(true);
      
      // Create temporary message for immediate display
      const tempMessage = {
        id: `temp-${Date.now()}`,
        from_id: user?.id,
        to_id: activeContact.id,
        sender_id: user?.id,
        receiver_id: activeContact.id,
        content: messageText.trim(),
        body: messageText.trim(), // Include both field names for compatibility
        created_at: new Date().toISOString(),
        seen: false,
        temporary: true,
        sender: {
          id: user?.id,
          nom: user?.nom,
          prenom: user?.prenom,
          email: user?.email,
          photoDeProfil: user?.photoDeProfil,
          role: user?.role
        }
      };
      
      // Add to messages immediately for better UX
      setMessages(prev => [...prev, tempMessage]);
      
      // Send the message
      const response = await api.post('/messages', {
        to_id: activeContact.id,
        content: messageText.trim(),
        body: messageText.trim() // Include both field names
      });
      
      if (response.data && response.data.message) {
        // Replace the temporary message with the real one from server
        setMessages(prev => 
          prev.map(msg => 
            msg.id === tempMessage.id ? response.data.message : msg
          )
        );
        setMessageText('');
      } else {
        throw new Error('Invalid response format');
      }
      
      setSending(false);
    } catch (error) {
      console.error('Error sending message:', error);
      setSending(false);
      
      // Remove the temporary message if sending failed
      setMessages(prev => prev.filter(msg => !msg.temporary));
      
      toast.error('Impossible d\'envoyer le message. Veuillez réessayer.');
    }
  };
  
  // Format message time
  const formatMessageTime = (timestamp) => {
    try {
      return format(new Date(timestamp), 'HH:mm');
    } catch (error) {
      return '';
    }
  };
  
  // Handle contact select
  const handleContactSelect = (contact) => {
    setActiveContact(contact);
    
    // On mobile, hide contacts list
    if (window.innerWidth < 768) {
      setShouldShowContacts(false);
    }
  };
  
  // Handle retry
  const handleRetry = () => {
    setError(null);
    fetchContacts();
  };
  
  // Handle back to contacts
  const handleBackToContacts = () => {
    setShouldShowContacts(true);
  };
  
  return (
    <>
      <Header />
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold mb-6">Messages</h1>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            <p>{error}</p>
            <button 
              onClick={handleRetry}
              className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Réessayer
            </button>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex flex-col md:flex-row h-[600px]">
            {/* Contacts sidebar */}
            {shouldShowContacts && (
              <div className="w-full md:w-1/3 border-r border-gray-200 overflow-y-auto">
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                  <h2 className="font-semibold text-gray-700">Contacts</h2>
                </div>
                
                {loading && contacts.length === 0 ? (
                  <div className="flex justify-center items-center h-32">
                    <Loader />
                  </div>
                ) : contacts.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    Aucun contact trouvé
                  </div>
                ) : (
                  <ul>
                    {contacts.map(contact => (
                      <li 
                        key={contact.id}
                        className={`
                          border-b border-gray-100 cursor-pointer 
                          ${activeContact?.id === contact.id ? 'bg-blue-50' : 'hover:bg-gray-50'}
                        `}
                        onClick={() => handleContactSelect(contact)}
                      >
                        <div className="flex items-center p-3">
                          <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
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
                            {contact.unread > 0 && (
                              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {contact.unread}
                              </span>
                            )}
                          </div>
                          <div className="ml-3 flex-1">
                            <div className="font-medium text-gray-800">{contact.name}</div>
                            <div className="text-xs text-gray-500">
                              {contact.role === 'conducteur' ? 'Conducteur' : 
                               contact.role === 'passager' ? 'Passager' : 
                               'Utilisateur'}
                            </div>
                          </div>
                          {contact.unread > 0 && (
                            <FontAwesomeIcon 
                              icon={faCircle} 
                              className="text-blue-500 text-xs"
                            />
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            
            {/* Chat area */}
            <div className={`flex-1 flex flex-col ${!shouldShowContacts ? 'block' : 'hidden md:flex'}`}>
              {!activeContact ? (
                <div className="flex-1 flex items-center justify-center p-4 bg-gray-50">
                  <p className="text-gray-500 text-center">
                    Sélectionnez un contact pour commencer à discuter
                  </p>
                </div>
              ) : (
                <>
                  {/* Chat header */}
                  <div className="p-3 bg-gray-50 border-b border-gray-200 flex items-center">
                    {!shouldShowContacts && (
                      <button 
                        onClick={handleBackToContacts} 
                        className="mr-2 text-gray-600 md:hidden"
                      >
                        <FontAwesomeIcon icon={faArrowLeft} />
                      </button>
                    )}
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      {activeContact.avatar ? (
                        <img 
                          src={activeContact.avatar} 
                          alt={activeContact.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-lg font-semibold text-gray-600">
                          {activeContact.name ? activeContact.name.charAt(0).toUpperCase() : '?'}
                        </span>
                      )}
                    </div>
                    <div className="ml-3">
                      <div className="font-medium text-gray-800">{activeContact.name}</div>
                      <div className="text-xs text-gray-500">
                        {activeContact.role === 'conducteur' ? 'Conducteur' : 
                         activeContact.role === 'passager' ? 'Passager' : 
                         'Utilisateur'}
                      </div>
                    </div>
                  </div>
                  
                  {/* Messages */}
                  <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                    {loading ? (
                      <div className="flex justify-center items-center h-full">
                        <Loader />
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="text-center text-gray-500 mt-4">
                        Aucun message pour l'instant
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {messages.map((message) => (
                          <div 
                            key={message.id} 
                            className={`flex ${
                              (message.sender_id === user.id || message.from_id === user.id) 
                                ? 'justify-end' 
                                : 'justify-start'
                            }`}
                          >
                            <div 
                              className={`
                                max-w-xs md:max-w-md lg:max-w-lg rounded-lg py-2 px-3 
                                ${(message.sender_id === user.id || message.from_id === user.id)
                                  ? 'bg-blue-500 text-white' 
                                  : 'bg-white text-gray-800 border border-gray-200'}
                              `}
                            >
                              <div className="text-sm">{message.content || message.body}</div>
                              <div className={`text-xs mt-1 text-right ${
                                (message.sender_id === user.id || message.from_id === user.id) 
                                  ? 'text-blue-100' 
                                  : 'text-gray-500'
                              }`}>
                                {formatMessageTime(message.created_at)}
                              </div>
                            </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </div>
                  
                  {/* Message input */}
                  <div className="p-3 border-t border-gray-200 bg-white">
                    <form onSubmit={handleSendMessage} className="flex items-center">
                      <input
                        type="text"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        className="flex-1 border border-gray-300 rounded-l-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Tapez votre message..."
                        disabled={sending}
                      />
                      <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white rounded-r-lg px-4 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
                        disabled={sending || !messageText.trim()}
                      >
                        {sending ? (
                          <span className="flex items-center justify-center">
                            <div className="w-5 h-5 border-t-2 border-r-2 border-white rounded-full animate-spin" />
                          </span>
                        ) : (
                          <FontAwesomeIcon icon={faPaperPlane} />
                        )}
                      </button>
                    </form>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Chat; 