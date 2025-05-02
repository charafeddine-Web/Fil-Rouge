import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { getEcho } from '../services/echo';

const ChatNotifications = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState(false);
  const [shouldRetry, setShouldRetry] = useState(true);
  const [lastFetchTime, setLastFetchTime] = useState(0);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    let isMounted = true;
    let retryCount = 0;
    const MAX_RETRIES = 3;
    const MIN_FETCH_INTERVAL = 30000; // 30 seconds between fetches

    // Fetch unread count with backoff strategy
    const fetchUnreadCount = async () => {
      // Skip if too many retries or too soon since last fetch
      const now = Date.now();
      if (!shouldRetry || retryCount >= MAX_RETRIES) {
        if (isMounted) {
          setError(true);
          // Stop retrying after max attempts to avoid console spam
          setShouldRetry(false);
        }
        return;
      }
      
      if (now - lastFetchTime < MIN_FETCH_INTERVAL && lastFetchTime !== 0) {
        // Skip this fetch since it's too soon
        return;
      }
      
      setLastFetchTime(now);

      try {
        // First try: Standard endpoint
        try {
          const response = await api.get('/chatify/getUnreadMessagesCount');
          if (response.data && response.data.status && isMounted) {
            setUnreadCount(response.data.count);
            setError(false);
            retryCount = 0; // Reset retry counter on success
            return;
          }
        } catch (error) {
          // Only log first error to avoid console spam
          if (retryCount === 0) {
            console.warn('Primary unread count endpoint failed, trying alternatives');
          }
        }
        
        // Second try: Alternative - count from contacts
        try {
          const contactsResponse = await api.get('/chatify/relevant-contacts');
          if (contactsResponse.data && contactsResponse.data.status && isMounted) {
            const contacts = contactsResponse.data.contacts || [];
            const totalUnread = contacts.reduce((sum, contact) => sum + (contact.unread || 0), 0);
            setUnreadCount(totalUnread);
            setError(false);
            retryCount = 0; // Reset retry counter on success
            return;
          }
        } catch (altError) {
          // Don't log to avoid console spam
        }
        
        // Third try: Check direct messages table
        try {
          const debugResponse = await api.get('/debug/chat');
          if (debugResponse.data && debugResponse.data.status === 'ok' && isMounted) {
            // Just knowing the system is working is good enough
            setError(false);
            return;
          }
        } catch (debugError) {
          // Don't log to avoid console spam
        }

        if (isMounted) {
          retryCount++;
          // Exponential backoff for retries
          if (shouldRetry) {
            const backoffTime = Math.min(5000 * Math.pow(2, retryCount), 30000);
            setTimeout(fetchUnreadCount, backoffTime);
          }
        }
      } catch (error) {
        if (retryCount === 0 && isMounted) {
          console.warn('Error fetching unread message count:', error.message);
        }
        
        if (isMounted) {
          retryCount++;
          if (shouldRetry) {
            const backoffTime = Math.min(5000 * Math.pow(2, retryCount), 30000);
            setTimeout(fetchUnreadCount, backoffTime);
          }
        }
      }
    };

    // Initial fetch
    fetchUnreadCount();

    // Setup a less frequent polling interval (60s)
    const intervalId = setInterval(() => {
      if (shouldRetry) {
        fetchUnreadCount();
      }
    }, 60000); // Check every minute instead of every 30 seconds

    // Listen for new messages with Echo (real-time updates)
    const echo = getEcho();
    if (echo) {
      try {
        const channel = echo.private('chatify');
        
        channel.listen('.message.created', (data) => {
          // If message is to the current user and not from them
          if (data.to_id === user.id && data.from_id !== user.id && isMounted) {
            setUnreadCount(prev => prev + 1);
          }
        });
      } catch (echoError) {
        // Echo error is non-critical since we have polling
        console.warn('Error setting up Echo listener:', echoError.message);
      }
    }

    return () => {
      isMounted = false;
      clearInterval(intervalId);
      if (echo) {
        try {
          echo.private('chatify').stopListening('.message.created');
        } catch (error) {
          // Don't log cleanup errors
        }
      }
    };
  }, [isAuthenticated, user, shouldRetry, lastFetchTime]);

  if (!isAuthenticated) return null;

  return (
    <Link 
      to="/chat" 
      className="relative flex items-center"
      onClick={() => setUnreadCount(0)} // Reset count when clicked
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-6 w-6 text-blue-600" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={1.5} 
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" 
        />
      </svg>
      
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Link>
  );
};

export default ChatNotifications; 