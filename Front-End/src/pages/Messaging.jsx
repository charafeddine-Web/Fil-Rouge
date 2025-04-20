import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import Button from "../components/Button";

export default function Messaging() {
  const [searchParams] = useSearchParams();
  const rideId = searchParams.get("ride");
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Mock data for conversations
  useEffect(() => {
    // Simulate API call to fetch conversations
    setTimeout(() => {
      const mockConversations = [
        {
          id: "conv1",
          ride: {
            id: "r1",
            departure: {
              city: "San Francisco",
              location: "Caltrain Station",
              datetime: "2025-05-10T08:00:00",
            },
            destination: {
              city: "Los Angeles",
              location: "Union Station",
              datetime: "2025-05-10T16:00:00",
            },
          },
          otherUser: {
            id: "d1",
            name: "Alex Thompson",
            image: "/images/drivers/alex.jpg",
            isDriver: true,
            lastActive: "2025-04-20T11:30:00",
            isOnline: true,
          },
          unreadCount: 2,
          lastMessage: {
            id: "msg12",
            senderId: "d1",
            text: "Looking forward to the ride! Let me know if you have any questions.",
            timestamp: "2025-04-19T16:45:00",
          },
          messages: [
            {
              id: "msg1",
              senderId: "u1", // Current user
              text: "Hi Alex, I booked a seat on your ride to LA.",
              timestamp: "2025-04-18T09:15:00",
            },
            {
              id: "msg2",
              senderId: "d1",
              text: "Hi there! Great to have you on board. Looking forward to the trip!",
              timestamp: "2025-04-18T09:20:00",
            },
            {
              id: "msg3",
              senderId: "u1",
              text: "Thanks! Do you have space for a medium-sized suitcase?",
              timestamp: "2025-04-18T09:25:00",
            },
            {
              id: "msg4",
              senderId: "d1",
              text: "Yes, definitely. The trunk has plenty of space for luggage.",
              timestamp: "2025-04-18T09:30:00",
            },
            {
              id: "msg5",
              senderId: "u1",
              text: "Perfect! Also, is it ok if I bring coffee for the road?",
              timestamp: "2025-04-18T10:15:00",
            },
            {
              id: "msg6",
              senderId: "d1",
              text: "Sure thing! I just ask that it has a secure lid. Had an incident once... 😅",
              timestamp: "2025-04-18T10:20:00",
            },
            {
              id: "msg7",
              senderId: "u1",
              text: "Gotcha, no problem. I'll make sure it's spill-proof!",
              timestamp: "2025-04-18T10:25:00",
            },
            {
              id: "msg8",
              senderId: "d1",
              text: "Great! By the way, I usually make a quick stop at the midpoint for a break. Takes about 15 minutes.",
              timestamp: "2025-04-19T08:30:00",
            },
            {
              id: "msg9",
              senderId: "u1",
              text: "That sounds perfect. Where do you usually stop?",
              timestamp: "2025-04-19T09:05:00",
            },
            {
              id: "msg10",
              senderId: "d1",
              text: "There's a nice rest stop with clean bathrooms and a café near Santa Barbara.",
              timestamp: "2025-04-19T09:15:00",
            },
            {
              id: "msg11",
              senderId: "u1",
              text: "Sounds great! Thanks for letting me know.",
              timestamp: "2025-04-19T09:20:00",
            },
            {
              id: "msg12",
              senderId: "d1",
              text: "Looking forward to the ride! Let me know if you have any questions.",
              timestamp: "2025-04-19T16:45:00",
            },
          ],
        },
        {
          id: "conv2",
          ride: {
            id: "r2",
            departure: {
              city: "Oakland",
              location: "Jack London Square",
              datetime: "2025-05-20T09:30:00",
            },
            destination: {
              city: "Sacramento",
              location: "Capitol Mall",
              datetime: "2025-05-20T12:00:00",
            },
          },
          otherUser: {
            id: "d2",
            name: "Emma Davis",
            image: "/images/drivers/emma.jpg",
            isDriver: true,
            lastActive: "2025-04-19T22:15:00",
            isOnline: false,
          },
          unreadCount: 0,
          lastMessage: {
            id: "emsg5",
            senderId: "u1", // Current user
            text: "Perfect! See you on the 20th.",
            timestamp: "2025-04-19T14:30:00",
          },
          messages: [
            {
              id: "emsg1",
              senderId: "d2",
              text: "Thanks for booking my ride to Sacramento. I'll be departing on time from Jack London Square.",
              timestamp: "2025-04-19T13:00:00",
            },
            {
              id: "emsg2",
              senderId: "u1",
              text: "Great! Do you have a specific meeting point?",
              timestamp: "2025-04-19T13:15:00",
            },
            {
              id: "emsg3",
              senderId: "d2",
              text: "Yes, I'll be parked in front of the main entrance. I drive a blue Honda Civic.",
              timestamp: "2025-04-19T13:45:00",
            },
            {
              id: "emsg4",
              senderId: "d2",
              text: "Also, I'll send you a message when I'm about 10 minutes away.",
              timestamp: "2025-04-19T13:47:00",
            },
            {
              id: "emsg5",
              senderId: "u1",
              text: "Perfect! See you on the 20th.",
              timestamp: "2025-04-19T14:30:00",
            },
          ],
        },
      ];
      
      setConversations(mockConversations);
      
      // If rideId is provided, find and set the active conversation
      if (rideId) {
        const conversation = mockConversations.find(conv => conv.ride.id === rideId);
        if (conversation) {
          setActiveConversation(conversation);
        }
      } else if (mockConversations.length > 0) {
        // Otherwise set the first conversation as active
        setActiveConversation(mockConversations[0]);
      }
      
      setLoading(false);
    }, 1000);
  }, [rideId]);

  useEffect(() => {
    // Scroll to bottom of messages when conversation changes or messages update
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeConversation]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!message.trim() || !activeConversation) return;
    
    const newMessage = {
      id: `new-${Date.now()}`,
      senderId: "u1", // Current user
      text: message,
      timestamp: new Date().toISOString(),
    };
    
    // Update the active conversation with the new message
    const updatedConversation = {
      ...activeConversation,
      messages: [...activeConversation.messages, newMessage],
      lastMessage: newMessage,
      unreadCount: 0, // Reset unread count when sending a message
    };
    
    // Update the conversations list
    const updatedConversations = conversations.map(conv => 
      conv.id === updatedConversation.id ? updatedConversation : conv
    );
    
    setActiveConversation(updatedConversation);
    setConversations(updatedConversations);
    setMessage("");
    
    // Scroll to bottom after sending
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };
  
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getLastActiveStatus = (user) => {
    if (user.isOnline) return "Online";
    
    const lastActive = new Date(user.lastActive);
    const now = new Date();
    const diffHours = Math.abs(now - lastActive) / 36e5; 
    
    if (diffHours < 1) {
      return "Last active recently";
    } else if (diffHours < 24) {
      return `Last active ${Math.floor(diffHours)}h ago`;
    } else {
      return `Last active on ${formatDate(user.lastActive)}`;
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8 flex-grow max-w-7xl">
        {/* <h1 className="text-3xl font-bold text-gray-800 mb-6">Messages</h1> */}
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3">
            {/* Conversation list - hidden on mobile when a conversation is active */}
            <div className={`${activeConversation ? 'hidden md:block' : 'block'} border-r border-gray-200`}>
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-800">Your Conversations</h2>
              </div>
              
              {conversations.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-gray-500">No conversations yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 max-h-[calc(100vh-240px)] overflow-y-auto">
                  {conversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                        activeConversation?.id === conversation.id ? 'bg-green-50' : ''
                      }`}
                      onClick={() => setActiveConversation(conversation)}
                    >
                      <div className="flex items-center">
                        <div className="relative">
                          <img
                            src={conversation.otherUser.image}
                            alt={conversation.otherUser.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          {conversation.otherUser.isOnline && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                          )}
                        </div>
                        <div className="ml-3 flex-grow">
                          <div className="flex justify-between items-center">
                            <p className="font-medium text-gray-900">
                              {conversation.otherUser.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDate(conversation.lastMessage.timestamp)}
                            </p>
                          </div>
                          <p className="text-sm text-gray-600 truncate">
                            {conversation.lastMessage.senderId === "u1" ? "You: " : ""}
                            {conversation.lastMessage.text}
                          </p>
                          <div className="flex justify-between items-center mt-1">
                            <p className="text-xs text-gray-500">
                              {conversation.ride.departure.city} to {conversation.ride.destination.city}
                            </p>
                            {conversation.unreadCount > 0 && (
                              <span className="bg-green-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                                {conversation.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Message Area */}
            <div className="md:col-span-2 flex flex-col h-[calc(100vh-240px)]">
              {!activeConversation ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center p-8">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">No conversation selected</h3>
                    <p className="text-gray-500">Select a conversation to start messaging</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Conversation Header */}
                  <div className="p-4 border-b border-gray-200 flex items-center">
                    <button
                      className="md:hidden mr-2 p-1 text-gray-500 hover:text-gray-700"
                      onClick={() => setActiveConversation(null)}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    
                    <div className="flex items-center flex-grow">
                      <img
                        src={activeConversation.otherUser.image}
                        alt={activeConversation.otherUser.name}
                        className="w-10 h-10 rounded-full object-cover mr-3"
                      />
                      <div>
                        <div className="flex items-center">
                          <h3 className="font-medium text-gray-900">
                            {activeConversation.otherUser.name}
                          </h3>
                          {activeConversation.otherUser.isDriver && (
                            <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                              Driver
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          {getLastActiveStatus(activeConversation.otherUser)}
                        </p>
                      </div>
                    </div>
                    
                    <Link
                      to={`/rides/${activeConversation.ride.id}`}
                      className="text-sm font-medium text-green-600 hover:text-green-700 flex items-center"
                    >
                      <span>View Ride</span>
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                  
                  {/* Ride Info Banner */}
                  <div className="bg-gray-50 p-3 border-b border-gray-200">
                    <div className="flex justify-between items-center text-sm">
                      <div>
                        <p className="font-medium text-gray-800">
                          {activeConversation.ride.departure.city} → {activeConversation.ride.destination.city}
                        </p>
                        <p className="text-gray-600">
                          {formatDate(activeConversation.ride.departure.datetime)}, {formatTime(activeConversation.ride.departure.datetime)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-600">
                          {activeConversation.ride.departure.location}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Messages */}
                  <div className="flex-grow overflow-y-auto p-4 space-y-4">
                    {activeConversation.messages.map(msg => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.senderId === "u1" ? "justify-end" : "justify-start"}`}
                      >
                        {msg.senderId !== "u1" && (
                          <img
                            src={activeConversation.otherUser.image}
                            alt={activeConversation.otherUser.name}
                            className="w-8 h-8 rounded-full object-cover mr-2 self-end"
                          />
                        )}
                        <div className="max-w-[70%]">
                          <div
                            className={`rounded-2xl px-4 py-2 ${
                              msg.senderId === "u1"
                                ? "bg-green-600 text-white"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            <p>{msg.text}</p>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatMessageTime(msg.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                  
                  {/* Message Input */}
                  <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-4">
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-grow rounded-full border border-gray-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <button
                        type="submit"
                        disabled={!message.trim()}
                        className={`ml-2 rounded-full p-2 ${
                          message.trim()
                            ? "bg-green-600 text-white hover:bg-green-700"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
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
}