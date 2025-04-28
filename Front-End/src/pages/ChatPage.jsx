import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Chat from '../components/Chat';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const ChatPage = () => {
    const { receiverId } = useParams();
    const [receiver, setReceiver] = useState(null);
    const { user } = AuthContext();

    useEffect(() => {
        const fetchReceiver = async () => {
            try {
                const response = await api.get(`/users/${receiverId}`);
                setReceiver(response.data);
            } catch (error) {
                console.error('Error fetching receiver details:', error);
            }
        };

        if (receiverId) {
            fetchReceiver();
        }
    }, [receiverId]);

    if (!receiver) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto">
                <Chat 
                    receiverId={parseInt(receiverId)} 
                    receiverName={`${receiver.name}`}
                />
            </div>
        </div>
    );
};

export default ChatPage; 