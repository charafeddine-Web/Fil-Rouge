import { useState, useEffect, useRef, useContext, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { getEcho, subscribeToUserChannel, subscribeToConversation, leaveChannel, reinitializeEcho } from '../services/echo';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faArrowLeft, faCircle, faUserCircle, faSmile } from '@fortawesome/free-solid-svg-icons';

// Emojis pour améliorer l'expérience
const EMOJIS = ['😊', '👍', '👋', '🚗', '🙏', '👌', '✅', '⭐', '🔥', '😂'];

// Create a global message cache to persist across component unmounts
const messageCache = new Map();

const Chat = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const { userId } = useParams();
  const navigate = useNavigate();
  
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [contactsLoading, setContactsLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [shouldShowContacts, setShouldShowContacts] = useState(true);
  const [showEmojis, setShowEmojis] = useState(false);
  
  const messagesEndRef = useRef(null);
  const chatRef = useRef(null);
  
  // Create a cache key for the active conversation
  const cacheKey = useMemo(() => {
    if (!activeContact || !user) return null;
    return `chat_${user.id}_${activeContact.id}`;
  }, [activeContact, user]);
  
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
  const fetchContacts = async (skipLoadingState = false) => {
    if (!isAuthenticated) return;
    
    try {
      if (!skipLoadingState) {
        setContactsLoading(true);
      }
      setError(null);
      
      const response = await api.get('/messages/contacts');
      
      if (response.data && response.data.contacts) {
        const sortedContacts = response.data.contacts.sort((a, b) => 
          (b.unread - a.unread) || (a.name || '').localeCompare(b.name || '')
        );
        
        setContacts(sortedContacts);
        
        if (userId && !activeContact) {
          const contact = sortedContacts.find(c => c.id.toString() === userId.toString());
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
      
      if (!skipLoadingState) {
        setContactsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
      if (!skipLoadingState) {
        setContactsLoading(false);
      }
      setError('Impossible de charger les contacts. Veuillez réessayer.');
      setContacts([]);
    }
  };
  
  // Load contacts on component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchContacts();
      
      // Set up background contact refresh
      const intervalId = setInterval(() => {
        fetchContacts(true); // Skip loading state for background refresh
      }, 30000);
      
      return () => clearInterval(intervalId);
    }
  }, [isAuthenticated]);
  
  // Update URL when userId param changes
  useEffect(() => {
    if (userId && contacts.length > 0) {
      const contact = contacts.find(c => c.id.toString() === userId.toString());
      if (contact) {
        setActiveContact(contact);
      }
    }
  }, [userId, contacts]);
  
  // Fetch user by ID and create contact
  const fetchUserById = async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      
      // Handle different response formats
      let userData = null;
      
      if (response.data && response.data.user) {
        userData = response.data.user;
      } else if (response.data && response.data.id) {
        // Direct user object in response
        userData = response.data;
      } else if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        // Array of users (take the first one matching the ID)
        userData = response.data.find(u => u.id.toString() === id.toString());
      }
      
      if (!userData) {
        throw new Error('User data not found in response');
      }
      
      // Create contact info from user data
      const displayName = userData.name || 
                         (userData.nom && userData.prenom ? `${userData.nom} ${userData.prenom}` : '') ||
                         userData.email || 
                         `User ${id}`;
      
      const contactInfo = {
        id: parseInt(userData.id) || parseInt(id),
        name: displayName,
        role: userData.role || '',
        avatar: userData.photoDeProfil || userData.avatar || '',
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
    } catch (error) {
      console.error('Error fetching user:', error);
      toast.error('Utilisateur introuvable');
      
      return null;
    }
  };
  
  // Ajouter cette fonctionnalité pour rafraîchir la connexion websocket
  useEffect(() => {
    if (!user || !isAuthenticated) return;

    // Forcer une réinitialisation d'Echo au montage du composant
    reinitializeEcho();
    console.log("Réinitialisation d'Echo pour assurer la connexion en temps réel");

    // Vérifier l'état de la connexion périodiquement
    const pingInterval = setInterval(() => {
      const echoInstance = getEcho();
      if (echoInstance && echoInstance.connector && echoInstance.connector.pusher) {
        const state = echoInstance.connector.pusher.connection.state;
        if (state !== 'connected') {
          console.log(`La connexion est dans l'état ${state}, tentative de reconnexion...`);
          reinitializeEcho();
        }
      }
    }, 15000); // Vérifier toutes les 15 secondes

    return () => clearInterval(pingInterval);
  }, [user, isAuthenticated]);

  // Modifier cette fonction pour debugger les messages reçus en temps réel
  const handleNewMessage = useCallback((data) => {
    console.log('🚨 Nouveau message reçu dans Chat.jsx:', data);
    
    // Handle different message formats
    let message = data;
    
    if (data.message) {
      message = data.message;
    }
    
    // Get IDs using different possible field names
    const senderId = message.sender_id || message.from_id;
    const receiverId = message.receiver_id || message.to_id;
    
    // Normalize the message format before processing
    const normalizedMessage = {
      ...message,
      sender_id: senderId,
      receiver_id: receiverId,
      from_id: senderId,
      to_id: receiverId,
      content: message.content || message.body,
      body: message.body || message.content
    };
    
    console.log('Message normalisé:', normalizedMessage);
    
    // If message is from active contact, add it to messages
    if (activeContact && (senderId === activeContact.id || senderId.toString() === activeContact.id.toString())) {
      setMessages(prev => {
        // Check if this message already exists
        const exists = prev.some(m => m.id === normalizedMessage.id);
        if (exists) {
          console.log('Message déjà présent, ignoré');
          return prev;
        }
        
        // Log addition of new message
        console.log('Ajout du nouveau message à la conversation');
        
        // Update the cache with the new message
        const newMessages = [...prev, normalizedMessage];
        if (cacheKey) {
          messageCache.set(cacheKey, newMessages);
        }
        
        return newMessages;
      });
      
      // Mark as read
      api.post('/messages/read', { from_id: activeContact.id })
        .catch(error => console.warn('Error marking message as read:', error));
    } else {
      console.log('Message non destiné à la conversation active ou pas de contact actif');
    }
    
    // Update unread count for contact
    setContacts(prev => 
      prev.map(contact => {
        if (contact.id === senderId || contact.id.toString() === senderId.toString()) {
          const newUnreadCount = activeContact?.id === senderId ? 0 : (contact.unread || 0) + 1;
          console.log(`Mise à jour du compteur non lu pour ${contact.name}: ${newUnreadCount}`);
          return {
            ...contact, 
            unread: newUnreadCount
          };
        }
        return contact;
      })
    );
  }, [activeContact, cacheKey]);

  // Remplacer l'effet d'écoute des messages utilisateur par cette version
  useEffect(() => {
    if (!user || !isAuthenticated) return;
    
    // Initialize Echo if needed
    const echo = getEcho();
    if (!echo) {
      console.error("Echo n'est pas initialisé, impossible d'écouter les messages");
      return;
    }
    
    console.log(`Configuration de l'écoute des messages pour l'utilisateur ${user.id}`);
    
    // Listen for messages on user's channel
    const userChannelListener = subscribeToUserChannel(user.id, handleNewMessage);
    
    // Clean up
    return () => {
      console.log("Nettoyage des abonnements aux canaux");
      if (userChannelListener) {
        leaveChannel(`private-user.${user.id}`);
      }
      
      if (activeContact) {
        leaveChannel(`private-chat.${user.id}.${activeContact.id}`);
        leaveChannel(`private-chat.${activeContact.id}.${user.id}`);
      }
    };
  }, [user, isAuthenticated, handleNewMessage, activeContact]);

  // Remplacer l'effet d'écoute des conversations par cette version
  useEffect(() => {
    if (!user || !isAuthenticated || !activeContact) return;
    
    // Initialize Echo if needed
    const echo = getEcho();
    if (!echo) {
      console.error("Echo n'est pas initialisé, impossible d'écouter la conversation");
      return;
    }
    
    console.log(`Configuration de l'écoute pour la conversation avec ${activeContact.name} (ID: ${activeContact.id})`);
    
    // Make sure we're listening to both channel combinations
    const channel1 = subscribeToConversation(user.id, activeContact.id, handleNewMessage);
    const channel2 = subscribeToConversation(activeContact.id, user.id, handleNewMessage);
    
    // Clean up
    return () => {
      leaveChannel(`private-chat.${user.id}.${activeContact.id}`);
      leaveChannel(`private-chat.${activeContact.id}.${user.id}`);
    };
  }, [user, isAuthenticated, activeContact, handleNewMessage]);
  
  // Fetch messages when active contact changes
  useEffect(() => {
    if (!activeContact || !cacheKey) return;
    
    const fetchMessages = async () => {
      try {
        setLoading(true);
        
        // Check if we have cached messages
        if (messageCache.has(cacheKey)) {
          console.log('Using cached messages for', cacheKey);
          setMessages(messageCache.get(cacheKey));
          setLoading(false);
          return;
        }
        
        console.log('Fetching messages for', cacheKey);
        const response = await api.get(`/messages/${activeContact.id}`);
        
        if (response.data && response.data.messages) {
          const fetchedMessages = response.data.messages;
          setMessages(fetchedMessages);
          
          // Cache the messages
          messageCache.set(cacheKey, fetchedMessages);
        } else {
          setMessages([]);
          // Clear cache for this conversation
          messageCache.delete(cacheKey);
        }
        
        // Mark as read
        try {
          await api.post('/messages/read', { from_id: activeContact.id });
          
          // Update contact's unread count
          setContacts(prev => 
            prev.map(contact => 
              contact.id === activeContact.id ? { ...contact, unread: 0 } : contact
            )
          );
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
  }, [activeContact, navigate, cacheKey]);
  
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
      setMessages(prev => {
        const newMessages = [...prev, tempMessage];
        
        // Update cache
        if (cacheKey) {
          messageCache.set(cacheKey, newMessages);
        }
        
        return newMessages;
      });
      
      // Clear the input so user can type the next message
      setMessageText('');
      
      // Send the message
      const response = await api.post('/messages', {
        to_id: activeContact.id,
        content: messageText.trim()
      });
      
      if (response.data && response.data.message) {
        // Replace the temporary message with the real one from server
        setMessages(prev => {
          const newMessages = prev.map(msg => 
            msg.id === tempMessage.id ? response.data.message : msg
          );
          
          // Update cache
          if (cacheKey) {
            messageCache.set(cacheKey, newMessages);
          }
          
          return newMessages;
        });
      } else {
        throw new Error('Invalid response format');
      }
      
      setSending(false);
    } catch (error) {
      console.error('Error sending message:', error);
      setSending(false);
      
      // Remove the temporary message if sending failed
      setMessages(prev => {
        const newMessages = prev.filter(msg => !msg.temporary);
        
        // Update cache
        if (cacheKey) {
          messageCache.set(cacheKey, newMessages);
        }
        
        return newMessages;
      });
      
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
  
  // Ajout d'un émoji au message
  const addEmoji = (emoji) => {
    setMessageText(prev => prev + emoji);
    setShowEmojis(false);
  };
  
  return (
    <>
      <Header />
      <div className="container mx-auto py-6 px-4 max-w-6xl">
        <h1 className="text-3xl font-bold mb-6 text-green-700">Messages 💬</h1>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-md shadow">
            <p>❌ {error}</p>
            <button 
              onClick={handleRetry}
              className="mt-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition duration-200"
            >
              🔄 Réessayer
            </button>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
          <div className="flex flex-col md:flex-row h-[70vh]">
            {/* Contacts sidebar */}
            {shouldShowContacts && (
              <div className="w-full md:w-1/3 lg:w-1/4 border-r border-gray-200 overflow-y-auto bg-gray-50">
                <div className="p-4 bg-gradient-to-r from-green-500 to-green-600 text-white sticky top-0 z-10">
                  <h2 className="font-semibold text-lg">👥 Contacts</h2>
                </div>
                
                {contactsLoading && contacts.length === 0 ? (
                  <div className="flex justify-center items-center h-32">
                    <Loader />
                  </div>
                ) : contacts.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    <FontAwesomeIcon icon={faUserCircle} className="text-4xl text-gray-300 mb-2" />
                    <p>Aucun contact trouvé 😕</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {contacts.map(contact => (
                      <li 
                        key={contact.id}
                        className={`
                          cursor-pointer transition duration-200
                          ${activeContact?.id === contact.id ? 'bg-green-50 border-l-4 border-green-500' : 'hover:bg-gray-100 border-l-4 border-transparent'}
                        `}
                        onClick={() => handleContactSelect(contact)}
                      >
                        <div className="flex items-center p-3">
                          <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-400 to-green-500 flex items-center justify-center overflow-hidden shadow-sm">
                              {contact.avatar ? (
                                <img 
                                  src={contact.avatar} 
                                  alt={contact.name} 
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-lg font-semibold text-white">
                                  {contact.name ? contact.name.charAt(0).toUpperCase() : '?'}
                                </span>
                              )}
                            </div>
                            {contact.unread > 0 && (
                              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                                {contact.unread}
                              </span>
                            )}
                          </div>
                          <div className="ml-3 flex-1">
                            <div className="font-medium text-gray-800">{contact.name}</div>
                            <div className="text-xs text-gray-500 flex items-center">
                              <span className={`inline-block w-2 h-2 rounded-full mr-1 ${contact.unread > 0 ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                              {contact.role === 'conducteur' ? '🚗 Conducteur' : 
                               contact.role === 'passager' ? '🧳 Passager' : 
                               '👤 Utilisateur'}
                            </div>
                          </div>
                          {contact.unread > 0 && (
                            <FontAwesomeIcon 
                              icon={faCircle} 
                              className="text-green-500 text-xs"
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
            <div className={`flex-1 flex flex-col ${!shouldShowContacts ? 'block' : 'hidden md:flex'}`} ref={chatRef}>
              {!activeContact ? (
                <div className="flex-1 flex flex-col items-center justify-center p-4 bg-gray-50">
                  <FontAwesomeIcon icon={faUserCircle} className="text-6xl text-gray-300 mb-4" />
                  <p className="text-gray-500 text-center">
                    Sélectionnez un contact pour commencer à discuter 💬
                  </p>
                </div>
              ) : (
                <>
                  {/* Chat header */}
                  <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 text-white flex items-center sticky top-0 z-10">
                    {!shouldShowContacts && (
                      <button 
                        onClick={handleBackToContacts} 
                        className="mr-2 text-white md:hidden hover:bg-green-600 p-2 rounded-full transition duration-200"
                      >
                        <FontAwesomeIcon icon={faArrowLeft} />
                      </button>
                    )}
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-sm">
                      {activeContact.avatar ? (
                        <img 
                          src={activeContact.avatar} 
                          alt={activeContact.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-lg font-semibold text-green-500">
                          {activeContact.name ? activeContact.name.charAt(0).toUpperCase() : '?'}
                        </span>
                      )}
                    </div>
                    <div className="ml-3">
                      <div className="font-medium text-white">{activeContact.name}</div>
                      <div className="text-xs text-green-100">
                        {activeContact.role === 'conducteur' ? '🚗 Conducteur' : 
                         activeContact.role === 'passager' ? '🧳 Passager' : 
                         '👤 Utilisateur'}
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
                      <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                        <FontAwesomeIcon icon={faPaperPlane} className="text-4xl text-gray-300 mb-2" />
                        <p>Aucun message pour l'instant 📭</p>
                        <p className="text-sm mt-2">Envoyez un message pour commencer la conversation 👋</p>
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
                                ${message.temporary ? 'opacity-70' : ''}
                                ${(message.sender_id === user.id || message.from_id === user.id)
                                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md' 
                                  : 'bg-white text-gray-800 border border-gray-200 shadow-sm'}
                              `}
                            >
                              <div className="text-sm">{message.content || message.body}</div>
                              <div className={`text-xs mt-1 text-right flex items-center justify-end gap-1 ${
                                (message.sender_id === user.id || message.from_id === user.id) 
                                  ? 'text-green-100' 
                                  : 'text-gray-500'
                              }`}>
                                {formatMessageTime(message.created_at)}
                                {(message.sender_id === user.id || message.from_id === user.id) && (
                                  <span>
                                    {message.seen ? '✅' : '✓'}
                                  </span>
                                )}
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
                    {showEmojis && (
                      <div className="mb-2 p-2 bg-gray-100 rounded-md flex flex-wrap gap-2">
                        {EMOJIS.map(emoji => (
                          <button 
                            key={emoji} 
                            onClick={() => addEmoji(emoji)}
                            className="text-xl hover:bg-gray-200 p-1 rounded-md transition duration-200"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    )}
                    <form onSubmit={handleSendMessage} className="flex items-center">
                      <button
                        type="button"
                        onClick={() => setShowEmojis(!showEmojis)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-l-lg px-3 py-2 focus:outline-none transition duration-200"
                      >
                        <FontAwesomeIcon icon={faSmile} />
                      </button>
                      <input
                        type="text"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        className="flex-1 border border-gray-300 border-x-0 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Tapez votre message... 📝"
                        disabled={sending}
                      />
                      <button
                        type="submit"
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-r-lg px-4 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-green-600 transition duration-200"
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