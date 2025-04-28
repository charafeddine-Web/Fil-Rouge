import React, { useState, useEffect, useRef } from 'react';
import Pusher from 'pusher-js';
import { chatService } from '../services/chatService';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Chat = ({ receiverId, receiverName }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const { user } = useAuth();
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        // Load existing messages
        const loadMessages = async () => {
            try {
                const data = await chatService.getMessages(receiverId);
                setMessages(data);
                scrollToBottom();
            } catch (error) {
                toast.error('Error loading messages');
            }
        };

        loadMessages();

        // Set up Pusher
        const pusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
            cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
            encrypted: true
        });

        const channel = pusher.subscribe('chat-channel');
        channel.bind('new-message', data => {
            const message = data.message;
            if (
                (message.sender_id === user.id && message.receiver_id === receiverId) ||
                (message.sender_id === receiverId && message.receiver_id === user.id)
            ) {
                setMessages(prevMessages => [...prevMessages, message]);
                scrollToBottom();
            }
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, [receiverId, user.id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            await chatService.sendMessage(receiverId, newMessage);
            setNewMessage('');
        } catch (error) {
            toast.error('Error sending message');
        }
    };

    return (
        <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-lg">
            <div className="p-4 border-b bg-blue-600 text-white rounded-t-lg">
                <h2 className="text-xl font-semibold">{receiverName}</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`mb-4 flex ${message.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
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
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
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
    );
};

export default Chat; 