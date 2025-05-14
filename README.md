# SwiftCar

## Overview

The chat system allows:
- Drivers to chat with passengers who have reserved seats on their trips
- Passengers to chat with drivers of trips they've reserved
- Chat messages are delivered in real-time using Pusher
- Notifications for unread messages

## Requirements

- Pusher account (https://pusher.com)
- Laravel backend with Pusher PHP server package
- React frontend with Pusher JS and Laravel Echo

## Backend Setup

1. **Install Required Packages**:
   ```bash
   cd Back-End
   composer require pusher/pusher-php-server
   ```

2. **Set Environment Variables**:
   Add these to your `.env` file:
   ```
   BROADCAST_DRIVER=pusher
   
   # Pusher settings
   PUSHER_APP_ID=your-pusher-app-id
   PUSHER_APP_KEY=your-pusher-key
   PUSHER_APP_SECRET=your-pusher-secret
   PUSHER_APP_CLUSTER=eu
   ```

3. **Update BroadcastServiceProvider**:
   Make sure it's uncommented in `config/app.php`:
   ```php
   App\Providers\BroadcastServiceProvider::class,
   ```

4. **Run Migrations**:
   ```bash
   php artisan migrate
   ```

## Frontend Setup

1. **Install Required Packages**:
   ```bash
   cd Front-End
   npm install laravel-echo pusher-js
   ```

2. **Set Environment Variables**:
   Create or update `.env` file with these variables:
   ```
   VITE_API_BASE_URL=http://localhost:8000/api
   
   # Pusher (for real-time chat)
   VITE_PUSHER_APP_KEY=your-pusher-key
   VITE_PUSHER_APP_CLUSTER=eu
   ```

## Pusher Channel Setup

The application uses three types of channels:
1. **User channel**: `user.{userId}` - For notifications
2. **Chat channel**: `chat.{userId}.{otherUserId}` - For direct messages
3. **Broadcast authentication**: `/api/broadcasting/auth` endpoint authenticates channels

## Components

- `MessageController.php` - Handles message CRUD operations
- `NewMessage.php` - Event for real-time message broadcasting
- `echo.js` - Frontend service for Pusher/Echo initialization
- `Chat.jsx` - Main chat interface
- `MessageButton.jsx` - Component for initiating conversations
- `ChatNotifications.jsx` - Notifications for unread messages

## Using the Chat

1. **For Passengers**:
   - View available trips
   - Click "Contact Driver" to start a conversation
   - The driver will be added to your contacts
   - Messages are delivered in real-time

2. **For Drivers**:
   - View all passenger messages in the chat interface
   - Respond to passenger inquiries
   - Get real-time notifications of new messages

## Troubleshooting

If you encounter issues with the real-time functionality:

1. **Check Pusher Credentials**:
   - Verify your Pusher credentials in both the backend and frontend
   - Make sure the cluster settings match

2. **Connection Issues**:
   - Check browser console for WebSocket connection errors
   - Verify CORS settings in your Laravel application

3. **Message Delivery**:
   - Make sure broadcasting events are properly set up
   - Check that the correct channels are being subscribed to

4. **Authentication**:
   - Ensure the broadcasting/auth endpoint is properly authenticating users
   - Check that Sanctum/auth tokens are being properly passed 
