import api from './api';

export const chatService = {
    sendMessage: async (receiverId, message) => {
        const response = await api.post('/chat/send', {
            receiver_id: receiverId,
            message: message
        });
        return response.data;
    },

    getMessages: async (userId) => {
        if (userId === 'all') {
            const response = await api.get('/chat/messages/all');
            return response.data;
        }
        
        const response = await api.get(`/chat/messages/${userId}`);
        return response.data;
    },
    
    getAllMessages: async () => {
        const response = await api.get('/chat/messages/all');
        return response.data;
    },

    markAsRead: async (messageId) => {
        const response = await api.patch(`/chat/messages/${messageId}/read`);
        return response.data;
    }
}; 