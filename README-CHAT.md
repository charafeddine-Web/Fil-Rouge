# Real-time Chat Implementation for Carpooling App

This document outlines how to set up the real-time chat functionality between drivers and passengers using Chatify.

## Overview

The chat system allows:
- Drivers to chat with passengers who have reserved seats on their trips
- Passengers to chat with drivers of trips they've reserved
- Chat messages are delivered in real-time using Pusher
- Trip information is displayed in the chat interface

## Backend Setup

1. **Install Pusher and Chatify**:
   ```bash
   cd Back-End
   composer require munafio/chatify
   composer require pusher/pusher-php-server
   ```

2. **Publish Chatify Assets**:
   ```bash
   php artisan chatify:publish
   ```

3. **Set Environment Variables**:
   Add these to your `.env` file:
   ```
   BROADCAST_DRIVER=pusher
   
   # Pusher settings
   PUSHER_APP_ID=your-pusher-app-id
   PUSHER_APP_KEY=your-pusher-key
   PUSHER_APP_SECRET=your-pusher-secret
   PUSHER_HOST=
   PUSHER_PORT=443
   PUSHER_SCHEME=https
   PUSHER_APP_CLUSTER=eu
   
   # Chatify configuration
   CHATIFY_NAME=Carpooling Chat
   CHATIFY_MAX_FILE_SIZE=50
   CHATIFY_ROUTES_PREFIX=chat
   CHATIFY_ROUTES_MIDDLEWARE=web,auth
   CHATIFY_API_ROUTES_PREFIX=chat/api
   CHATIFY_API_ROUTES_MIDDLEWARE=api
   ```

4. **Run Migrations**:
   ```bash
   php artisan migrate
   ```

## Frontend Setup

1. **Install Required Packages**:
   ```bash
   cd Front-End
   npm install laravel-echo pusher-js date-fns
   ```

2. **Set Environment Variables**:
   Create a `.env` file with these variables:
   ```
   VITE_API_BASE_URL=http://localhost:8000/api
   VITE_BACKEND_URL=http://localhost:8000
   
   # Pusher (for real-time chat)
   VITE_PUSHER_APP_KEY=your-pusher-key
   VITE_PUSHER_APP_CLUSTER=eu
   VITE_PUSHER_HOST=localhost
   VITE_PUSHER_PORT=6001
   VITE_PUSHER_SCHEME=http
   ```

## Using the Chat

1. **Access the Chat**:
   - From a trip detail page, click on the "Chat" button next to a driver or passenger
   - Directly navigate to `/chat` to see all your conversations
   - Use `/chat/:userId` to start a chat with a specific user

2. **Features**:
   - Real-time message delivery
   - Message read status
   - Trip details displayed in the chat
   - Proper formatting of message timestamps

## Custom Backend Routes

- `GET /api/chat/contacts` - Get all contacts (drivers/passengers) the user can chat with
- `GET /api/chat/trip/{userId}` - Get trip information related to the chat with a user
- `GET /chat/with/{userId}` - Start a chat with a specific user (web route)

## Important Files

- `Back-End/app/Http/Controllers/ChatController.php` - Custom controller for chat functionality
- `Front-End/src/components/ChatifyChat.jsx` - Main chat component
- `Front-End/src/components/ChatTripInfo.jsx` - Component to display trip info in the chat
- `Front-End/src/services/echo.js` - Service to initialize Laravel Echo

## Troubleshooting

- If you encounter CORS issues, make sure your backend CORS settings allow your frontend domain
- If real-time updates aren't working, check your Pusher credentials and ensure the service is running
- For message persistence issues, verify that the database migrations have run successfully

## Notes

This implementation allows only users with confirmed reservations to chat with their respective drivers/passengers, ensuring that the chat system is only used for legitimate trip communications. 