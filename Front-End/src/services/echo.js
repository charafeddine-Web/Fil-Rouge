import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

Pusher.logToConsole = true;

// Set window.Pusher to allow Echo to use it
window.Pusher = Pusher;

// Initialize Laravel Echo
let echo = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

export const initEcho = (token) => {
  if (echo) return echo;

  console.log('Initialisation d\'Echo avec les variables d\'environnement:', {
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    authEndpoint: `${import.meta.env.VITE_BACKEND_URL}/api/broadcasting/auth`,
  });

  const options = {
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY || '8004fc9fb5ecb6c1dd86',
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER || 'mt1',
    forceTLS: true,
    encrypted: true,
    authEndpoint: `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}/api/broadcasting/auth`,
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    },
    // Options supplémentaires pour améliorer la fiabilité
    disableStats: true,
   
    
    activityTimeout: 120000,
  };

  try {
    echo = new Echo(options);
    window.Echo = echo;
    console.log('Echo initialisé avec succès avec le token');

    // Configuration des événements de connexion
    const pusher = echo.connector.pusher;
    
    pusher.connection.bind('connected', () => {
      console.log('Connexion Pusher établie ✅');
      reconnectAttempts = 0;
    });
    
    pusher.connection.bind('disconnected', () => {
      console.log('Connexion Pusher perdue ❌');
    });
    
    pusher.connection.bind('error', (err) => {
      console.error('Erreur de connexion Pusher:', err);
      
      if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        reconnectAttempts++;
        console.log(`Tentative de reconnexion ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}...`);
        
        // Tentative de reconnexion après un délai
        setTimeout(() => {
          pusher.connect();
        }, 3000);
      }
    });
    
    return echo;
  } catch (error) {
    console.error('Échec de l\'initialisation d\'Echo:', error);
    return null;
  }
};

export const reinitializeEcho = () => {
  if (echo) {
    try {
      echo.connector.pusher.disconnect();
    } catch (e) {
      console.error('Erreur lors de la déconnexion d\'Echo:', e);
    }
    echo = null;
  }
  
  const token = localStorage.getItem('token');
  if (token) {
    return initEcho(token);
  }
  return null;
};

export const getEcho = () => {
  if (!echo) {
    const token = localStorage.getItem('token');
    if (token) {
      return initEcho(token);
    }
    console.error('Aucun token disponible pour l\'initialisation d\'Echo');
    return null;
  }
  
  // Vérifier l'état de la connexion
  if (echo.connector.pusher.connection.state !== 'connected') {
    console.log('Connexion Echo non établie, état actuel:', echo.connector.pusher.connection.state);
    try {
      echo.connector.pusher.connect();
    } catch (e) {
      console.error('Erreur lors de la reconnexion:', e);
      // En cas d'échec, réinitialiser complètement
      return reinitializeEcho();
    }
  }
  
  return echo;
};

export const subscribeToUserChannel = (userId, callback) => {
  const echoInstance = getEcho();
  if (!echoInstance) return null;
  
  console.log(`Abonnement au canal utilisateur: user.${userId}`);
  return echoInstance.private(`user.${userId}`)
    .listen('.message.sent', (data) => {
      console.log('Message reçu sur le canal utilisateur:', data);
      callback(data);
    });
};

export const subscribeToConversation = (userId, otherId, callback) => {
  const echoInstance = getEcho();
  if (!echoInstance) return null;
  
  console.log(`Abonnement au canal de conversation: chat.${userId}.${otherId}`);
  return echoInstance.private(`chat.${userId}.${otherId}`)
    .listen('.message.sent', (data) => {
      console.log('Message reçu sur le canal de conversation:', data);
      callback(data);
    });
};

export const leaveChannel = (channel) => {
  const echoInstance = getEcho();
  if (!echoInstance || !channel) return;
  
  console.log(`Désinscription du canal: ${channel}`);
  echoInstance.leave(channel);
};

export default {
  initEcho,
  getEcho,
  reinitializeEcho,
  subscribeToUserChannel,
  subscribeToConversation,
  leaveChannel,
}; 