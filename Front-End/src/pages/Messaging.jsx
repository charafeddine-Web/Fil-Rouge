import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import Button from "../components/Button";
import api from "../services/api";
import { toast } from "react-toastify";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Messaging() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const rideId = searchParams.get("ride");
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        
        // Get all messages for the current user
        const messagesResponse = await api.get('/chat/messages/all');
        const messages = messagesResponse.data || [];
        
        if (messages.length === 0) {
          setConversations([]);
          setLoading(false);
          return;
        }
        
        // Group messages by conversation partner
        const conversationMap = new Map();
        
        messages.forEach(msg => {
          const partnerId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
          if (!conversationMap.has(partnerId)) {
            conversationMap.set(partnerId, {
              id: partnerId,
              messages: [],
              lastMessage: null,
              unreadCount: 0
            });
          }
          
          const conversation = conversationMap.get(partnerId);
          conversation.messages.push(msg);
          
          if (!conversation.lastMessage || new Date(msg.created_at) > new Date(conversation.lastMessage.created_at)) {
            conversation.lastMessage = msg;
          }
          
          if (!msg.is_read && msg.sender_id === partnerId) {
            conversation.unreadCount++;
          }
        });
        
        // Convert map to array and fetch user details for each conversation
        const conversationsData = await Promise.all(
          Array.from(conversationMap.values()).map(async (conv) => {
            try {
              const userResponse = await api.get(`/users/${conv.id}`);
              return {
                ...conv,
                otherUser: userResponse.data
              };
            } catch (error) {
              console.error(`Error fetching user ${conv.id}:`, error);
              return null;
            }
          })
        );
        
        // Filter out any null conversations (where user fetch failed)
        const validConversations = conversationsData.filter(conv => conv !== null);
        setConversations(validConversations);
        
        // If rideId is provided, find and set the active conversation
        if (rideId) {
          const conversation = validConversations.find(conv => conv.ride_id === rideId);
          if (conversation) {
            setActiveConversation(conversation);
          }
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
        if (error.response?.data?.error) {
          toast.error(error.response.data.error);
        } else {
          toast.error('Failed to load conversations. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [rideId, user.id]);

  const handleStartChat = (userId) => {
    const conversation = conversations.find(conv => conv.otherUser.id === userId);
    if (conversation) {
      setActiveConversation(conversation);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !activeConversation) return;

    try {
      const response = await api.post('/chat/send', {
        receiver_id: activeConversation.otherUser.id,
        message: message
      });

      setMessage('');
      // Update the conversation with the new message
      setActiveConversation(prev => ({
        ...prev,
        messages: [...prev.messages, response.data],
        lastMessage: response.data
      }));
      
      // Update the conversations list
      setConversations(prev => 
        prev.map(conv => 
          conv.id === activeConversation.id 
            ? { ...conv, lastMessage: response.data }
            : conv
        )
      );
    } catch (error) {
      console.error('Error sending message:', error);
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Failed to send message. Please try again later.');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-[600px]">
            <Loader />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Conversations List */}
          <div className="md:col-span-1 bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold mb-4">Conversations</h2>
            {conversations.length === 0 ? (
              <div className="text-center text-gray-500 py-4">
                No conversations yet
              </div>
            ) : (
              conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                    activeConversation?.id === conversation.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => handleStartChat(conversation.otherUser.id)}
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={conversation.otherUser.photoDeProfil || '/images/default-avatar.png'}
                      alt={conversation.otherUser.nom}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{`${conversation.otherUser.nom} ${conversation.otherUser.prenom}`}</h3>
                      <p className="text-sm text-gray-500">
                        {conversation.lastMessage?.message || 'No messages yet'}
                      </p>
                    </div>
                    {conversation.unreadCount > 0 && (
                      <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Chat Area */}
          <div className="md:col-span-2 bg-white rounded-lg shadow-md p-4">
            {activeConversation ? (
              <div className="flex flex-col h-[600px]">
                {/* Chat Header */}
                <div className="flex items-center space-x-3 border-b pb-4">
                  <img
                    src={activeConversation.otherUser.photoDeProfil || '/images/default-avatar.png'}
                    alt={activeConversation.otherUser.nom}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-medium">{`${activeConversation.otherUser.nom} ${activeConversation.otherUser.prenom}`}</h3>
                    <p className="text-sm text-gray-500">
                      {activeConversation.otherUser.isOnline ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4">
                  {activeConversation.messages.length === 0 ? (
                    <div className="text-center text-gray-500 py-4">
                      No messages yet. Start the conversation!
                    </div>
                  ) : (
                    activeConversation.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`mb-4 flex ${
                          message.sender_id === user.id ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            message.sender_id === user.id
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-800'
                          }`}
                        >
                          <p>{message.message}</p>
                          <span className="text-xs opacity-75">
                            {new Date(message.created_at).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="border-t p-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 p-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Send
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[600px] text-gray-500">
                Select a conversation to start chatting
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}