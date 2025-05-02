# Setting Up Real-Time Chat with Pusher

This guide will walk you through setting up real-time chat functionality in your application using Pusher.

## Step 1: Create a Pusher Account

1. Go to [Pusher](https://pusher.com/) and create an account
2. Create a new Channels app
3. Take note of your app credentials:
   - App ID
   - Key
   - Secret
   - Cluster

## Step 2: Configure Backend (Laravel)

1. Update your `.env` file in the `Back-End` directory:

```
BROADCAST_DRIVER=pusher
PUSHER_APP_ID=your_app_id
PUSHER_APP_KEY=your_pusher_key
PUSHER_APP_SECRET=your_pusher_secret
PUSHER_APP_CLUSTER=your_pusher_cluster
```

2. Make sure your `config/app.php` has broadcasting provider uncommented:

```php
App\Providers\BroadcastServiceProvider::class,
```

3. Make sure the Laravel Echo Server is installed and configured if you're using it:

```bash
npm install -g laravel-echo-server
laravel-echo-server init
```

## Step 3: Configure Frontend

1. Update the Pusher configuration in `Front-End/src/config/pusher.js`:

```javascript
const PUSHER_CONFIG = {
  key: 'your_pusher_key', // Replace with your actual Pusher key
  cluster: 'your_pusher_cluster', // Replace with your Pusher cluster
  encrypted: true
};

export default PUSHER_CONFIG;
```

## Step 4: Testing Your Chat

1. Start your Laravel backend server
2. Start your Frontend application
3. Open two browser windows and log in with different accounts
4. Try sending messages between the accounts - they should appear instantly!

## Troubleshooting

If real-time updates are not working:

1. Check browser console for errors
2. Verify Pusher credentials in both frontend and backend
3. Make sure CORS is properly configured in Laravel
4. Check that the Laravel broadcast event is properly configured

For more details on Laravel broadcasting, see the [official documentation](https://laravel.com/docs/10.x/broadcasting). 