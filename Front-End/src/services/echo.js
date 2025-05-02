import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Set window.Pusher to allow Echo to use it
window.Pusher = Pusher;

// Initialize Laravel Echo
let echo = null;

export const initEcho = (token) => {
  if (echo) return echo;

  const options = {
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY || '12345',
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER || 'eu',
    forceTLS: true,
    encrypted: true,
    authEndpoint: `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/broadcasting/auth`,
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    },
  };

  echo = new Echo(options);
  window.Echo = echo;
  console.log('Echo initialized with token');
  return echo;
};

export const getEcho = () => {
  if (!echo) {
    const token = localStorage.getItem('token');
    if (token) {
      return initEcho(token);
    }
    console.error('No token available for Echo initialization');
    return null;
  }
  return echo;
};

export const subscribeToUserChannel = (userId, callback) => {
  const echoInstance = getEcho();
  if (!echoInstance) return null;
  
  return echoInstance.private(`user.${userId}`)
    .listen('.message.sent', callback);
};

export const subscribeToConversation = (userId, otherId, callback) => {
  const echoInstance = getEcho();
  if (!echoInstance) return null;
  
  return echoInstance.private(`chat.${userId}.${otherId}`)
    .listen('.message.sent', callback);
};

export const leaveChannel = (channel) => {
  const echoInstance = getEcho();
  if (!echoInstance || !channel) return;
  
  echoInstance.leave(channel);
};

export default {
  initEcho,
  getEcho,
  subscribeToUserChannel,
  subscribeToConversation,
  leaveChannel,
}; 