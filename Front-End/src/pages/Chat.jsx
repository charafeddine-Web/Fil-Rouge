import { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { getEcho } from '../services/echo';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Loader from '../components/Loader';

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
      
      let response;
      try {
        // Utiliser les contacts pertinents (liés à des réservations)
        response = await api.get('/chatify/relevant-contacts');
      } catch (relevantError) {
        console.warn('Relevant contacts failed, falling back to regular contacts:', relevantError);
        
        // Fallback to standard chatify contacts
        try {
          response = await api.get('/chatify/contacts');
        } catch (chatifyError) {
          console.warn('Chatify contacts failed, falling back to regular contacts:', chatifyError);
          response = await api.get('/chat/contacts');
        }
      }
      
      if (response.data && (Array.isArray(response.data.contacts) || Array.isArray(response.data))) {
        const contactsList = Array.isArray(response.data.contacts) 
          ? response.data.contacts 
          : response.data;
        
        const uniqueMap = new Map();
        contactsList.forEach(contact => {
          if (!uniqueMap.has(contact.id)) {
            uniqueMap.set(contact.id, contact);
          }
        });
        
        const uniqueContacts = Array.from(uniqueMap.values());
        
        const sortedContacts = uniqueContacts.sort((a, b) => 
          (a.name || '').localeCompare(b.name || '')
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
      let response;
      try {
        response = await api.get(`/users/chat/${id}`);
      } catch (chatUserError) {
        console.warn('Error with chat user endpoint, trying regular user endpoint:', chatUserError);
        
        // Fallback to standard user endpoint
        try {
          response = await api.get(`/users/${id}`);
        } catch (userError) {
          console.warn('Error with standard user endpoint, using placeholder:', userError);
          
          // Create a placeholder user
          response = {
            data: {
              status: true,
              user: {
                id: id,
                name: 'User ' + id,
                placeholder: true
              }
            }
          };
        }
      }
      
      if (response.data && (response.data.user || response.data)) {
        const userData = response.data.user || response.data;
        
        // Create contact info from user data
        const displayName = userData.name || 
                           (userData.nom && userData.prenom ? `${userData.nom} ${userData.prenom}` : '') ||
                           userData.email || 
                           `User ${id}`;
        
        const contactInfo = {
          id: userData.id,
          name: displayName,
          role: userData.role || '',
          active_status: false,
          unread: 0,
          placeholder: userData.placeholder
        };
        
        console.log(`Contact established with ${displayName} (${contactInfo.id})`);
        
        setActiveContact(contactInfo);
        
        if (!contacts.some(c => c.id === contactInfo.id)) {
          setContacts(prev => [...prev, contactInfo]);
        }
        
        try {
          await api.post('/chatify/addContact', { user_id: id });
          console.log(`Contact with ${contactInfo.name} established via Chatify`);
        } catch (chatifyError) {
          console.warn('Error with Chatify addContact, trying API ChatController:', chatifyError);
          
          try {
            await api.post('/chat/addContact', { user_id: id });
            console.log(`Contact with ${contactInfo.name} established via ChatController`);
          } catch (chatControllerError) {
            console.warn('Error with ChatController, proceeding anyway:', chatControllerError);
          }
        }
        
        return contactInfo;
      } else {
        throw new Error('Invalid user data format');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      toast.error('Utilisateur introuvable');
      
      const placeholderContact = {
        id: id,
        name: `Utilisateur ${id}`,
        role: '',
        active_status: false,
        unread: 0,
        placeholder: true
      };
      
      setActiveContact(placeholderContact);
      setContacts(prev => [...prev, placeholderContact]);
      
      return placeholderContact;
    }
  };
  
  // Fetch messages when active contact changes
  useEffect(() => {
    if (!activeContact) return;
    
    const fetchMessages = async () => {
      try {
        setLoading(true);
        
        const isDriver = user?.role === 'conducteur';
        console.log(`Fetching messages as ${isDriver ? 'DRIVER' : 'PASSENGER'} with contact ID ${activeContact.id}`);
        
        let response = null;
        let successfulFetch = false;
        
        if (isDriver) {
          console.log("Special driver method activated");
          
          try {
            const driverResponse = await api.get(`/api/chatify/driverMessages/${activeContact.id}`);
            
            if (driverResponse.data && Array.isArray(driverResponse.data.messages)) {
              console.log(`Found ${driverResponse.data.messages.length} messages from driver endpoint`);
              response = driverResponse;
              successfulFetch = true;
            }
          } catch (driverError) {
            console.error('Error with driver endpoint:', driverError);
          }
          
          if (!successfulFetch) {
            try {
              const directResponse = await api.get(`/api/chatify/directMessages/${activeContact.id}`);
              
              if (directResponse.data && Array.isArray(directResponse.data.messages)) {
                console.log(`Found ${directResponse.data.messages.length} messages from direct endpoint`);
                response = directResponse;
                successfulFetch = true;
              }
            } catch (directError) {
              console.warn('Failed with direct endpoint:', directError);
            }
          }
          
          if (!successfulFetch) {
            try {
              const customResponse = await api.post('/chatify/fetchMessages', {
                id: activeContact.id
              });
              
              if (customResponse.data && Array.isArray(customResponse.data.messages)) {
                console.log(`Found ${customResponse.data.messages.length} messages from standard method`);
                response = customResponse;
                successfulFetch = true;
              } else if (customResponse.data && typeof customResponse.data.messages === 'string') {
                console.warn("Unexpected HTML response from Chatify");
                response = { data: { messages: [], status: true } };
                successfulFetch = true;
              }
            } catch (fallbackError) {
              console.error('All methods failed:', fallbackError);
            }
          }
        } else {
          try {
            console.log(`Trying direct endpoint for ${activeContact.id}`);
            const directResponse = await api.get(`/api/chatify/directMessages/${activeContact.id}`);
            
            if (directResponse.data && Array.isArray(directResponse.data.messages)) {
              response = directResponse;
              successfulFetch = true;
            }
          } catch (directError) {
            console.warn('Failed with direct endpoint:', directError);
          }
          
          if (!successfulFetch) {
            try {
              const chatifyResponse = await api.post('/chatify/fetchMessages', {
                id: activeContact.id
              });
              
              if (chatifyResponse.data && chatifyResponse.data.messages && Array.isArray(chatifyResponse.data.messages)) {
                response = chatifyResponse;
                successfulFetch = true;
              }
            } catch (chatifyError) {
              console.warn('Failed to fetch from Chatify:', chatifyError);
            }
          }
        }
        
        if (!response) {
          response = { data: { messages: [] } };
        }
        
        if (response.data && Array.isArray(response.data.messages)) {
          const newMessages = response.data.messages;
          
          const validMessages = newMessages.filter(msg => msg.id && msg.body);
          
          const typeCorrectedMessages = validMessages.map(msg => ({
            ...msg,
            from_id: parseInt(msg.from_id), 
            to_id: parseInt(msg.to_id),
            seen: parseInt(msg.seen || 0)
          }));
          
          const sortedMessages = [...typeCorrectedMessages].sort((a, b) => {
            return new Date(a.created_at) - new Date(b.created_at);
          });
          
          const currentMsgCount = messages?.length || 0;
          const newMsgCount = sortedMessages.length;
          
          if (currentMsgCount !== newMsgCount || messagesHaveChanged(messages, sortedMessages)) {
            setMessages(sortedMessages);
          }
          
          try {
            await api.post('/chatify/makeSeen', { id: activeContact.id });
          } catch (error) {
            console.warn('Error marking messages as read:', error);
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setLoading(false);
      }
    };
    
    // Check if messages have changed
    const messagesHaveChanged = (oldMessages, newMessages) => {
      if (!oldMessages || !newMessages) return true;
      if (oldMessages.length !== newMessages.length) return true;
      
      if (oldMessages.length > 0 && newMessages.length > 0) {
        const lastOldMsg = oldMessages[oldMessages.length - 1];
        const lastNewMsg = newMessages[newMessages.length - 1];
        
        return lastOldMsg.id !== lastNewMsg.id || 
               lastOldMsg.body !== lastNewMsg.body;
      }
      
      return false;
    };
    
    fetchMessages();
    
    const messageInterval = setInterval(() => {
      if (activeContact) {
        fetchMessages();
      }
    }, 20000);
    
    navigate(`/chat/${activeContact.id}`, { replace: true });
    
    try {
      const recentContacts = JSON.parse(localStorage.getItem('recentContacts') || '[]');
      const existingIndex = recentContacts.findIndex(c => c.id === activeContact.id);
      
      if (existingIndex >= 0) {
        recentContacts[existingIndex] = activeContact;
      } else {
        recentContacts.push(activeContact);
      }
      
      const limitedContacts = recentContacts.slice(-10);
      localStorage.setItem('recentContacts', JSON.stringify(limitedContacts));
    } catch (e) {
      console.error('Error saving contact to localStorage:', e);
    }
    
    return () => {
      clearInterval(messageInterval);
    };
  }, [activeContact, navigate, messages, user]);
  
  useEffect(() => {
    if (isAuthenticated && contacts.length === 0) {
      try {
        const recentContacts = JSON.parse(localStorage.getItem('recentContacts') || '[]');
        if (recentContacts.length > 0) {
          // Merge with existing contacts without duplicates
          setContacts(prevContacts => {
            const allContacts = [...prevContacts, ...recentContacts];
            const uniqueMap = new Map();
            allContacts.forEach(contact => {
              if (!uniqueMap.has(contact.id)) {
                uniqueMap.set(contact.id, contact);
              }
            });
            return Array.from(uniqueMap.values());
          });
        }
      } catch (e) {
        console.error('Error loading contacts from localStorage:', e);
      }
    }
  }, [isAuthenticated, contacts.length]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!messageText.trim() || !activeContact || sending) return;
    
    try {
      setSending(true);
      
      // Check if user is a driver
      const isDriver = user?.role === 'conducteur';
      
      try {
        // Create temporary message for immediate display
        const tempMessage = {
          id: `temp-${Date.now()}`,
          from_id: user?.id,
          to_id: activeContact.id,
          body: messageText.trim(),
          created_at: new Date().toISOString(),
          seen: 0,
          temporary: true
        };
        
        setMessages(prev => [...prev, tempMessage]);
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        setMessageText('');
        
        let messageSent = false;
        
        // DRIVER-SPECIFIC ENDPOINT FIRST
        if (isDriver) {
          try {
            console.log(`Using driver endpoint for message to ${activeContact.id}`);
            const driverResponse = await api.post('/api/chatify/sendDriverMessage', {
              id: activeContact.id,
              message: tempMessage.body,
              temporaryMsgId: tempMessage.id
            });
            
            if (driverResponse.data && driverResponse.data.status) {
              messageSent = true;
            }
          } catch (driverError) {
            console.warn('Error with driver endpoint:', driverError);
          }
        }
        
        // TRY STANDARD ENDPOINT IF DRIVER ENDPOINT FAILED
        if (!messageSent) {
          try {
            const response = await api.post('/chatify/sendMessage', {
              id: activeContact.id,
              type: 'user',
              message: tempMessage.body,
            });
            
            if (response.data && response.data.status) {
              messageSent = true;
            }
          } catch (chatifyError) {
            console.warn('Error with Chatify endpoint:', chatifyError);
          }
        }
        
        // TRY API CONTROLLER ENDPOINT
        if (!messageSent) {
          try {
            const response = await api.post('/api/chatify/sendMessage', {
              id: activeContact.id,
              type: 'user',
              message: tempMessage.body,
            });
            
            if (response.data && response.data.status) {
              messageSent = true;
            }
          } catch (apiError) {
            console.error('API endpoint failed:', apiError);
          }
        }
        
        // LAST RESORT: DIRECT DATABASE INSERTION
        if (!messageSent) {
          try {
            const response = await api.post('/api/chatify/sendMessageDirect', {
              id: activeContact.id,
              message: tempMessage.body,
              temporaryMsgId: tempMessage.id
            });
            
            if (response.data) {
              messageSent = true;
            }
          } catch (directError) {
            console.error('All sending methods failed:', directError);
          }
        }
        
        // Refresh messages after sending for drivers
        if (messageSent && isDriver) {
          setTimeout(() => {
            fetchMessages();
          }, 500);
        }
        
      } catch (error) {
        console.error('Error sending message:', error);
      } finally {
        setSending(false);
      }
    } catch (error) {
      console.error('Fatal error sending message:', error);
      setSending(false);
    }
  };
  
  const formatMessageTime = (timestamp) => {
    try {
      return format(new Date(timestamp), 'p');
    } catch (error) {
      return '';
    }
  };
  
  const handleContactSelect = (contact) => {
    setActiveContact(contact);
    
    if (window.innerWidth < 768) {
      setShouldShowContacts(false);
    }
    
    navigate(`/chat/${contact.id}`, { replace: true });
  };
  
  const handleRetry = () => {
    fetchContacts();
  };
  
  const handleBackToContacts = () => {
    setShouldShowContacts(true);
  };
  
  useEffect(() => {
    if (!activeContact || !isAuthenticated || !user) return;
    
    const echo = getEcho();
    if (!echo) {
      console.error('Echo is not initialized');
      return;
    }
    
    try {
      const channel = echo.private('chatify');
      
      channel.listen('.message.created', (data) => {
        if ((data.from_id === activeContact.id && data.to_id === user.id) || 
            (data.from_id === user.id && data.to_id === activeContact.id)) {
          console.log('New message received via Echo:', data);
          
          setMessages(prev => {
            const messageExists = prev.some(msg => 
              msg.id === data.id || 
              (msg.temporary && msg.body === data.body && msg.from_id === data.from_id)
            );
            
            if (messageExists) {
              return prev.map(msg => {
                if (msg.temporary && msg.body === data.body && msg.from_id === data.from_id) {
                  return { ...data, replaced: true };
                }
                return msg;
              });
            } else {
              return [...prev, data];
            }
          });
          
          if (data.from_id === activeContact.id) {
            try {
              api.post('/chatify/makeSeen', { id: activeContact.id })
                .catch(err => console.error('Error marking message as seen:', err));
            } catch (error) {
              console.error('Error marking message as seen:', error);
            }
          }
          
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
      });
      
      return () => {
        channel.stopListening('.message.created');
      };
    } catch (error) {
      console.error('Error setting up Echo listener:', error);
    }
  }, [activeContact, isAuthenticated, user]);
  
  if (!isAuthenticated) {
    return null; //  redirect in useEffect
  }
  
  if (error && contacts.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-16 w-16 text-red-500 mx-auto mb-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            <h2 className="text-xl font-semibold mb-4">Service de messagerie indisponible</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex justify-center space-x-4">
              <button 
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                onClick={handleRetry}
              >
                Réessayer
              </button>
              <button 
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                onClick={() => navigate('/')}
              >
                Retour à l'accueil
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (loading && !activeContact && contacts.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
          <Loader/>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 h-[600px]">
            {/* Contact sidebar - conditionally displayed */}
            {shouldShowContacts && (
              <div className="border-r md:block h-full">
                <div className="p-4 border-b flex justify-between items-center bg-blue-50">
                  <h2 className="text-xl font-semibold text-blue-700">Contacts</h2>
                  <button 
                    onClick={fetchContacts}
                    className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition-colors"
                    disabled={loading}
                  >
                    {loading ? 'Chargement...' : 'Actualiser'}
                  </button>
                </div>
                <div className="overflow-y-auto h-[calc(600px-64px)]">
                  {loading && contacts.length === 0 ? (
                    <div className="p-4 text-center">
                      <div className="animate-spin mx-auto rounded-full h-8 w-8 border-2 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent"></div>
                      <p className="mt-2 text-gray-600">Chargement des contacts...</p>
                    </div>
                  ) : contacts.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <p className="mt-4 font-medium">Aucun contact trouvé</p>
                      <p className="mt-2 text-sm mb-4">
                        Les contacts apparaîtront ici quand vous commencerez à échanger des messages.
                      </p>
                      {error && (
                        <button 
                          className="mt-3 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
                          onClick={handleRetry}
                        >
                          Réessayer
                        </button>
                      )}
                    </div>
                  ) : (
                    <ul>
                      {contacts.map((contact) => (
                        <li 
                          key={`contact-${contact.id}`}
                          onClick={() => handleContactSelect(contact)}
                          className={`p-3 border-b cursor-pointer hover:bg-blue-50 flex items-center transition-colors ${
                            activeContact?.id === contact.id ? 'bg-blue-100' : ''
                          }`}
                        >
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-gray-800">{contact.name}</span>
                              {contact.unread > 0 && (
                                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 ml-2">
                                  {contact.unread}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {contact.role === 'conducteur' ? 'Conducteur' : 
                               contact.role === 'passager' ? 'Passager' : 
                               contact.role || 'Utilisateur'}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
            
            <div className={`${shouldShowContacts ? 'md:col-span-2' : 'col-span-full'} flex flex-col h-full`}>
              {!activeContact ? (
                <div className="flex items-center justify-center h-full bg-gray-50">
                  <div className="text-center p-6">
                    <div className="text-gray-400 mb-4">
                      <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-600">Bienvenue dans votre messagerie</h3>
                    <p className="mt-2 text-gray-500">Sélectionnez un contact pour commencer à discuter</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="p-4 border-b flex items-center justify-between bg-blue-50">
                    <div className="flex items-center">
                      {!shouldShowContacts && window.innerWidth < 768 && (
                        <button 
                          onClick={handleBackToContacts} 
                          className="mr-3 p-1 rounded-full hover:bg-blue-100"
                        >
                          <svg 
                            className="w-6 h-6 text-blue-500" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24" 
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M15 19l-7-7 7-7" 
                            />
                          </svg>
                        </button>
                      )}
                      <div>
                        <h3 className="font-medium text-blue-800">{activeContact.name}</h3>
                        <div className="flex items-center text-xs text-gray-500">
                          <span className="flex items-center">
                            {activeContact.role === 'conducteur' ? (
                              <>
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                                </svg>
                                Conducteur
                              </>
                            ) : activeContact.role === 'passager' ? (
                              <>
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                                </svg>
                                Passager
                              </>
                            ) : (
                              activeContact.role || 'Utilisateur'
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Messages */}
                  <div className="flex-1 p-4 overflow-y-auto bg-gray-50" style={{ height: 'calc(100% - 140px)' }}>
                    {loading ? (
                      <div className="flex flex-col items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-t-blue-500 border-r-blue-300 border-b-blue-500 border-l-blue-300 mb-3"></div>
                        <p className="text-gray-600 text-sm">
                          {user?.role === 'conducteur' 
                            ? 'Chargement des messages de conversation...' 
                            : 'Chargement des messages...'}
                        </p>
                        {user?.role === 'conducteur' && (
                          <p className="text-xs text-gray-500 mt-2 max-w-md text-center">
                            Si aucun message n'apparaît après le chargement, 
                            essayez d'envoyer un premier message pour démarrer la conversation.
                          </p>
                        )}
                      </div>
                    ) : !messages || messages.length === 0 ? (
                      <div className="text-center p-8">
                        <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        <p className="mt-4 text-gray-500 font-medium">Aucun message pour le moment</p>
                        <p className="mt-2 text-gray-500">Commencez la conversation!</p>
                        {user?.role === 'conducteur' && (
                          <p className="mt-4 text-sm text-blue-600">
                            En tant que conducteur, vous pouvez envoyer un message pour démarrer la conversation.
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {Array.isArray(messages) && messages.map((message, index) => (
                          <div 
                            key={message.id || index} 
                            className={`flex ${message.from_id === user.id ? 'justify-end' : 'justify-start'}`}
                          >
                            <div 
                              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg shadow-sm ${
                                message.from_id === user.id 
                                  ? 'bg-blue-600 text-white' 
                                  : 'bg-white text-gray-800 border'
                              }`}
                            >
                              <p className="break-words">{message.body}</p>
                              <p 
                                className={`text-xs mt-1 text-right ${
                                  message.from_id === user.id ? 'text-blue-100' : 'text-gray-500'
                                }`}
                              >
                                {formatMessageTime(message.created_at)}
                              </p>
                            </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </div>
                  
                  <form onSubmit={handleSendMessage} className="p-4 border-t bg-white" style={{ height: '80px', minHeight: '80px' }}>
                    <div className="flex items-center h-full">
                      <input
                        type="text"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Tapez un message"
                        className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        autoComplete="off"
                      />
                      <button
                        type="submit"
                        disabled={sending || !messageText.trim()}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-r-lg disabled:opacity-50 transition-colors"
                      >
                        {sending ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Envoi...
                          </span>
                        ) : 'Envoyer'}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Chat; 