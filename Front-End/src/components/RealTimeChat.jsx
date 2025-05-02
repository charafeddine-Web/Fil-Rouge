import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import ChatTripInfo from './ChatTripInfo';
import { formatDistance } from 'date-fns';
import { getEcho } from '../services/echo';

const RealTimeChat = ({ contact, user }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const navigate = useNavigate();

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Fetch messages when contact changes
  useEffect(() => {
    if (!contact || !contact.id) return;

    const fetchMessages = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await api.get(`/rtchat/messages/${contact.id}`);
        
        if (response.data && response.data.status && response.data.messages) {
          const validMessages = response.data.messages.filter(msg => msg.id && msg.body);
          
          const typeCorrectedMessages = validMessages.map(msg => ({
            ...msg,
            from_id: parseInt(msg.from_id),
            to_id: parseInt(msg.to_id),
          }));
          
          setMessages(typeCorrectedMessages);
        } else {
          setMessages([]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError('Failed to load messages');
        setLoading(false);
      }
    };

    fetchMessages();

    // Set up real-time connection
    const echo = getEcho();
    if (echo) {
      try {
        // Create a private channel for this chat
        const channel = echo.private(`chat.${user.id}.${contact.id}`);
        
        // Listen for new messages
        channel.listen('.message.sent', (data) => {
          if ((data.from_id === contact.id && data.to_id === user.id) || 
              (data.from_id === user.id && data.to_id === contact.id)) {
            // Add new message to state
            setMessages(prev => [...prev, data]);
            
            // Mark as seen if it's from the contact
            if (data.from_id === contact.id) {
              api.post('/rtchat/seen', { from_id: contact.id })
                .catch(err => console.error('Error marking messages as seen:', err));
            }
          }
        });

        // Cleanup
        return () => {
          channel.stopListening('.message.sent');
        };
      } catch (error) {
        console.error('Error setting up Echo listener:', error);
      }
    }
  }, [contact, user]);

  // Send message handler
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!messageText.trim() || sending) return;
    
    try {
      setSending(true);
      
      // Create temporary message for immediate display
      const tempMessage = {
        id: `temp-${Date.now()}`,
        from_id: user?.id,
        to_id: contact.id,
        body: messageText.trim(),
        created_at: new Date().toISOString(),
        seen: 0,
        temporary: true
      };
      
      // Show message in UI immediately
      setMessages(prev => [...prev, tempMessage]);
      
      // Send the actual message
      const response = await api.post('/rtchat/send', {
        to_id: contact.id,
        message: messageText.trim()
      });
      
      // Clear input
      setMessageText('');
      
      if (response.data && response.data.status) {
        const actualMessage = { ...response.data.message, temporary: false };
        
        // Replace the temporary message with the real one
        setMessages(prev => 
          prev.map(msg => 
            msg.id === tempMessage.id ? actualMessage : msg
          )
        );
      }
      
      setSending(false);
    } catch (err) {
      console.error('Error sending message:', err);
      setSending(false);
      
      // Remove the temporary message if sending failed
      setMessages(prev => prev.filter(msg => !msg.temporary));
    }
  };

  // Format time
  const formatMessageTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return formatDistance(date, new Date(), { addSuffix: true });
    } catch (err) {
      return 'just now';
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex-1 p-4 flex flex-col bg-white rounded-lg">
        <div className="animate-pulse space-y-4 w-full">
          <div className="h-10 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex-1 p-4 flex items-center justify-center bg-white rounded-lg">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => navigate('/chat')} 
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go back to contacts
          </button>
        </div>
      </div>
    );
  }

  // Render empty state
  if (!contact) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center bg-white rounded-lg">
        <div className="text-center text-gray-500">
          <svg 
            className="w-16 h-16 mx-auto mb-4 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
            />
          </svg>
          <h3 className="text-xl font-semibold mb-2">No conversation selected</h3>
          <p>Choose a contact from the list to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white rounded-lg overflow-hidden">
      {/* Chat header */}
      <div className="p-4 border-b flex items-center justify-between bg-white shadow-sm">
        <div className="flex items-center">
          <div className="relative">
            <img 
              src={contact.avatar || 'https://via.placeholder.com/150'} 
              alt={contact.name} 
              className="w-10 h-10 rounded-full object-cover"
            />
            {contact.active_status ? (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
            ) : null}
          </div>
          <div className="ml-3">
            <h3 className="font-medium">{contact.name}</h3>
            <div className="text-xs text-gray-500 flex items-center">
              <span className={`inline-block w-2 h-2 rounded-full mr-1 ${contact.active_status ? 'bg-green-500' : 'bg-gray-400'}`}></span>
              <span>{contact.active_status ? 'Online' : 'Offline'}</span>
              {contact.role && (
                <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                  {contact.role === 'conducteur' ? 'Driver' : contact.role === 'passager' ? 'Passenger' : contact.role}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Trip information */}
      <ChatTripInfo contactId={contact.id} />
      
      {/* Messages container */}
      <div 
        ref={chatContainerRef}
        className="flex-1 p-4 overflow-y-auto"
        style={{ backgroundColor: '#f0f2f5' }}
      >
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message, index) => (
              <div 
                key={message.id || index} 
                className={`flex ${message.from_id === user.id ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.from_id === user.id 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white text-gray-800'
                  } ${message.temporary ? 'opacity-70' : ''}`}
                >
                  <p>{message.body}</p>
                  <p 
                    className={`text-xs mt-1 text-right ${
                      message.from_id === user.id ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    {formatMessageTime(message.created_at)}
                    {message.from_id === user.id && (
                      <span className="ml-2">
                        {message.seen === 1 ? '✓✓' : '✓'}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      {/* Message input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t bg-white">
        <div className="flex items-center">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={sending || !messageText.trim()}
            className={`bg-blue-500 text-white px-4 py-2 rounded-r-lg ${
              sending || !messageText.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
            }`}
          >
            {sending ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RealTimeChat; 