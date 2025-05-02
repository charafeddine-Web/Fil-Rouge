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
  return window.Echo || null;
};

export default {
  initEcho,
  getEcho,
}; 