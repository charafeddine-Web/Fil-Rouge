import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import { useContext } from 'react';

import {AuthContext} from '../context/AuthContext';

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

const RealtimeChat = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const { userId } = useParams();
  const navigate = useNavigate();
  
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [shouldShowContacts, setShouldShowContacts] = useState(true);
  const [sending, setSending] = useState(false);
  const [echo, setEcho] = useState(null);
  
  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  useEffect(() => {
    if (!user || !isAuthenticated) return;
    
    window.Pusher = Pusher;
    
    const echoInstance = new Echo({
      broadcaster: 'pusher',
      key: import.meta.env.VITE_PUSHER_APP_KEY || 'your-pusher-key',
      cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER || 'eu',
      forceTLS: true,
      encrypted: true,
      authEndpoint: '/api/broadcasting/auth',
      auth: {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          Accept: 'application/json',
        },
      },
    });
    
    setEcho(echoInstance);
    
    return () => {
      if (echoInstance) {
        echoInstance.disconnect();
      }
    };
  }, [user, isAuthenticated]);
  
  useEffect(() => {
    if (userId) {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        setShouldShowContacts(false);
      }
    }
    
    const handleResize = () => {
      if (activeContact) {
        setShouldShowContacts(window.innerWidth >= 768);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [userId, activeContact]);
  
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const fetchContacts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await api.get('/api/rtchat/contacts');
        
        if (response.data && response.data.status) {
          const contactsList = response.data.contacts;
          
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
              } catch (error) {
                console.error('Failed to fetch user by ID:', error);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching contacts:', error);
        setError('Failed to load contacts. Please try again later.');
        toast.error('Failed to load contacts');
      } finally {
        setLoading(false);
      }
    };
    
    fetchContacts();
    
    const intervalId = setInterval(() => {
      fetchContacts();
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, [isAuthenticated, userId]);
  
  // Fetch user by ID
  const fetchUserById = async (id) => {
    try {
      let response;
      try {
        response = await api.get(`/api/users/chat/${id}`);
      } catch (error) {
        response = await api.get(`/api/users/${id}`);
      }
      
      if (response.data) {
        const contactInfo = {
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role,
          avatar: response.data.avatar || null
        };
        
        const displayName = contactInfo.name || contactInfo.email || `User ${contactInfo.id}`;
        console.log(`Contact established with ${displayName} (${contactInfo.id})`);
        
        setActiveContact(contactInfo);
        
        if (!contacts.some(c => c.id === contactInfo.id)) {
          setContacts(prev => [...prev, contactInfo]);
        }
        
        try {
          await api.post('/api/chatify/addContact', { user_id: id });
        } catch (error) {
          console.error('Could not add contact:', error);
        }
        
        return contactInfo;
      } else {
        throw new Error('User data not found');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      toast.error('Utilisateur introuvable');
      
      const placeholderContact = {
        id: id,
        name: `User ${id}`,
        email: null,
        role: null,
        avatar: null
      };
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
        console.log(`Fetching messages with contact ID ${activeContact.id}`);
        
        const response = await api.get(`/api/rtchat/messages/${activeContact.id}`);
        
        if (response.data && Array.isArray(response.data.messages)) {
          const newMessages = response.data.messages;
          
          const validMessages = newMessages.filter(msg => msg.id && msg.body);
          
          const typeCorrectedMessages = validMessages.map(msg => ({
            ...msg,
            from_id: parseInt(msg.from_id),
            to_id: parseInt(msg.to_id),
          }));
          
          setMessages(typeCorrectedMessages);
        } else {
          setMessages([]);
        }
        
        // Subscribe to private chat channel when active contact changes
        if (echo && user) {
          const fromId = parseInt(user.id);
          const toId = parseInt(activeContact.id);
          
          // Create a consistent channel name by sorting IDs
          const users = [fromId, toId];
          users.sort((a, b) => a - b);
          const channelName = `chat.${users[0]}.${users[1]}`;
          
          console.log(`Subscribing to channel: ${channelName}`);
          
          echo.private(channelName)
            .listen('.message.sent', (data) => {
              console.log('New message received via Echo:', data);
              
              // Add message to the list
              setMessages(prev => {
                const messageExists = prev.some(msg => 
                  msg.id === data.id || 
                  (msg.temporary && msg.body === data.body && msg.from_id === data.from_id)
                );
                
                if (messageExists) {
                  return prev.map(msg => {
                    if (msg.temporary && msg.body === data.body && msg.from_id === data.from_id) {
                      return { ...data, temporary: false };
                    }
                    return msg;
                  });
                } else {
                  return [...prev, data];
                }
              });
              
              if (data.from_id === activeContact.id) {
                api.post('/api/rtchat/seen', { from_id: activeContact.id })
                  .catch(error => console.error('Error marking message as seen:', error));
              }
              
              messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            });
        }
        
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast.error('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessages();
    
    if (activeContact) {
      api.post('/api/rtchat/seen', { from_id: activeContact.id })
        .catch(error => console.error('Error marking messages as seen:', error));
    }
    
  }, [activeContact, echo, user]);
  
  useEffect(() => {
    if (isAuthenticated && contacts.length === 0) {
      try {
        const recentContacts = localStorage.getItem('recentContacts');
        if (recentContacts) {
          const parsed = JSON.parse(recentContacts);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setContacts(parsed);
          }
        }
      } catch (error) {
        console.error('Error parsing recent contacts:', error);
      }
    }
  }, [isAuthenticated, contacts.length]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Send message with real-time delivery
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!messageText.trim() || !activeContact || sending) return;
    
    try {
      setSending(true);
      
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
      
      setMessageText('');
      
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      
      const response = await api.post('/api/rtchat/send', {
        to_id: activeContact.id,
        message: tempMessage.body
      });
      
      if (response.data && response.data.status) {
        console.log('Message sent successfully');
        
        setMessages(prev => 
          prev.map(msg => 
            msg.id === tempMessage.id 
              ? { ...response.data.message, temporary: false } 
              : msg
          )
        );
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      
      setMessages(prev => prev.filter(msg => msg.id !== `temp-${Date.now()}`));
    } finally {
      setSending(false);
    }
  };
  
  const handleContactClick = (contact) => {
    setActiveContact(contact);
    
    if (window.innerWidth < 768) {
      setShouldShowContacts(false);
    }
    
    navigate(`/realtime-chat/${contact.id}`, { replace: true });
  };
  
  const toggleContacts = () => {
    setShouldShowContacts(!shouldShowContacts);
  };
  
  if (!isAuthenticated) {
    return null; 
  }
  
  if (error && contacts.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow container mx-auto px-4 py-8 flex justify-center items-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h3 className="text-red-700 text-lg font-semibold mb-2">Error</h3>
            <p className="text-red-600">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            >
              Retry
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  // Render loading state
  if (loading && !activeContact && contacts.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <Loader />
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="flex-grow container mx-auto px-4 py-8">
        {/* Switch back to regular chat button */}
        <div className="mb-4 flex justify-end">
          <a 
            href={activeContact ? `/chat/${activeContact.id}` : '/chat'} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-colors mr-2"
          >
            Switch to Regular Chat
          </a>
        </div>
        
        {/* Mobile toggle button */}
        {activeContact && (
          <button 
            className="md:hidden mb-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md flex items-center"
            onClick={toggleContacts}
          >
            {shouldShowContacts ? 'Hide Contacts' : 'Show Contacts'}
          </button>
        )}
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden h-[calc(100vh-240px)] min-h-[500px]">
          <div className="grid grid-cols-1 md:grid-cols-3 h-full">
            {/* Contacts sidebar */}
            {shouldShowContacts && (
              <div className="md:col-span-1 border-r border-gray-200 overflow-y-auto">
                <div className="p-4 border-b bg-blue-50">
                  <h2 className="text-lg font-semibold text-gray-700">Contacts</h2>
                </div>
                
                <div>
                  {contacts.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      {loading ? 'Loading contacts...' : 'No contacts found'}
                    </div>
                  ) : (
                    <ul>
                      {contacts.map(contact => (
                        <li 
                          key={contact.id} 
                          className={`
                            p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors
                            ${activeContact?.id === contact.id ? 'bg-blue-50' : ''}
                          `}
                          onClick={() => handleContactClick(contact)}
                        >
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-blue-600 font-semibold mr-3">
                              {contact.avatar ? (
                                <img src={contact.avatar} alt={contact.name} className="w-10 h-10 rounded-full" />
                              ) : (
                                contact.name?.[0]?.toUpperCase() || 'U'
                              )}
                            </div>
                            <div>
                              <h3 className="font-medium">{contact.name || `User ${contact.id}`}</h3>
                              <p className="text-xs text-gray-500 capitalize">{contact.role || 'User'}</p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
            
            {/* Chat area */}
            <div className={`${shouldShowContacts ? 'md:col-span-2' : 'col-span-full'} flex flex-col h-full`}>
              {!activeContact ? (
                <div className="flex-grow flex items-center justify-center p-4 text-center text-gray-500">
                  <div>
                    <p className="mb-4">Select a contact to start chatting</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Chat header */}
                  <div className="p-4 border-b flex items-center justify-between bg-blue-50">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-blue-600 font-semibold mr-3">
                        {activeContact.avatar ? (
                          <img src={activeContact.avatar} alt={activeContact.name} className="w-10 h-10 rounded-full" />
                        ) : (
                          activeContact.name?.[0]?.toUpperCase() || 'U'
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{activeContact.name || `User ${activeContact.id}`}</h3>
                        <p className="text-xs text-gray-500 capitalize">{activeContact.role || 'User'}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Messages */}
                  <div className="flex-grow overflow-y-auto p-4 bg-gray-50">
                    {messages.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-gray-500">
                        {loading ? 'Loading messages...' : 'No messages yet. Start the conversation!'}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {messages.map((message, index) => {
                          const isSentByMe = message.from_id === user?.id;
                          return (
                            <div 
                              key={message.id || index} 
                              className={`
                                flex 
                                ${isSentByMe ? 'justify-end' : 'justify-start'}
                                ${message.temporary ? 'opacity-70' : ''}
                              `}
                            >
                              <div 
                                className={`
                                  max-w-[80%] rounded-lg p-3 
                                  ${isSentByMe ? 'bg-blue-500 text-white' : 'bg-white border border-gray-200 text-gray-800'}
                                  ${message.temporary ? 'animate-pulse' : ''}
                                `}
                              >
                                <div className="text-sm break-words">{message.body}</div>
                                <div className={`text-xs mt-1 ${isSentByMe ? 'text-blue-100' : 'text-gray-500'}`}>
                                  {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  {isSentByMe && (
                                    <span className="ml-2">
                                      {message.seen === 1 ? '✓✓' : '✓'}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </div>
                  
                  {/* Message input */}
                  <form onSubmit={handleSendMessage} className="p-4 border-t bg-white" style={{ height: '80px', minHeight: '80px' }}>
                    <div className="flex items-center h-full">
                      <input
                        type="text"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-grow border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="submit"
                        disabled={!messageText.trim() || sending}
                        className={`
                          bg-blue-500 text-white px-4 py-2 rounded-r-lg
                          ${(!messageText.trim() || sending) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}
                        `}
                      >
                        {sending ? 'Sending...' : 'Send'}
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

export default RealtimeChat; 