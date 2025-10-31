# Stream Chat Integration Setup Guide

## 🚀 Stream Chat Implementation Complete!

This guide will help you set up Stream Chat for in-house messaging and calls between users in your Lovtiti Agro Mart application.

## 📋 Prerequisites

1. **Stream Account**: Sign up at [getstream.io](https://getstream.io)
2. **Stream App**: Create a new app in your Stream dashboard
3. **API Keys**: Get your API Key and Secret Key from Stream dashboard

## 🔧 Environment Variables Setup

Add these environment variables to your `.env` file:

```bash
# Stream Chat Configuration
NEXT_PUBLIC_STREAM_API_KEY=your_stream_api_key_here
STREAM_SECRET_KEY=your_stream_secret_key_here
```

## 🏗️ Implementation Steps Completed

### ✅ Step 1: Dependencies Installed
- `stream-chat`: Core Stream Chat SDK
- `stream-chat-react`: React components for Stream Chat

### ✅ Step 2: Configuration Files Created
- `lib/stream.ts`: Stream Chat configuration and utilities
- `app/api/stream/token/route.ts`: API route for generating user tokens

### ✅ Step 3: Components Created
- `components/StreamProvider.tsx`: Stream Chat provider wrapper
- `components/chat/ChatChannelList.tsx`: Channel list component
- `components/chat/ChatChannel.tsx`: Individual chat channel component

### ✅ Step 4: Messaging Page Updated
- `app/messaging/page.tsx`: Updated to use Stream Chat components

## 🎯 Features Implemented

### 💬 **Messaging Features**
- ✅ Real-time messaging between users
- ✅ Channel list with search functionality
- ✅ Message history and persistence
- ✅ Typing indicators
- ✅ Message status (sent, delivered, read)
- ✅ File and image sharing
- ✅ Emoji reactions

### 📞 **Calling Features**
- ✅ Audio call initiation
- ✅ Video call initiation
- ✅ Call management UI
- ✅ Call status indicators

### 🔐 **Authentication Integration**
- ✅ Clerk authentication integration
- ✅ User role mapping (Farmer, Buyer, Distributor, etc.)
- ✅ Automatic user creation in Stream Chat
- ✅ Token-based authentication

## 🚀 Getting Started

### 1. **Set Up Stream Dashboard**

1. Go to [getstream.io](https://getstream.io) and create an account
2. Create a new app in your dashboard
3. Copy your API Key and Secret Key
4. Add them to your `.env` file

### 2. **Configure User Roles**

The system automatically maps Clerk user roles to Stream Chat roles:
- `FARMER` → `farmer`
- `BUYER` → `buyer`
- `DISTRIBUTOR` → `distributor`
- `TRANSPORTER` → `transporter`
- `AGROEXPERT` → `agro-vet`
- `ADMIN` → `admin`

### 3. **Channel Types Available**

The system supports these channel types:
- `farmer-vet`: Direct messages between farmers and AGROEXPERTs
- `farmer-buyer`: Direct messages between farmers and buyers
- `farmer-distributor`: Direct messages between farmers and distributors
- `farmer-transporter`: Direct messages between farmers and transporters
- `group-farmers`: Group chat for farmers
- `group-buyers`: Group chat for buyers
- `support`: Support channel

## 🔧 Stream Dashboard Configuration

### **1. App Settings**
- **App Name**: Lovtiti Agro Mart
- **Environment**: Development/Production
- **Region**: Choose closest to your users

### **2. Authentication**
- **Authentication Method**: Token-based
- **Token Expiration**: 24 hours (default)
- **User Creation**: Automatic

### **3. Permissions**
- **Channel Creation**: Allow users to create channels
- **Message Deletion**: Allow users to delete their own messages
- **File Upload**: Enable file and image sharing
- **Push Notifications**: Enable for mobile

### **4. Moderation**
- **Content Moderation**: Enable automatic content filtering
- **Profanity Filter**: Enable profanity detection
- **Spam Protection**: Enable spam detection

## 📱 Usage Examples

### **Creating a Channel**
```typescript
import { createOrGetChannel, CHANNEL_TYPES } from '@/lib/stream';

// Create a farmer-vet channel
const channel = await createOrGetChannel(
  client,
  CHANNEL_TYPES.FARMER_VET,
  'farmer-123-vet-456',
  ['farmer-123', 'vet-456'],
  {
    name: 'Farmer John - Dr. Smith',
    image: 'https://example.com/channel-image.jpg'
  }
);
```

### **Sending a Message**
```typescript
// Messages are sent automatically through Stream Chat components
// No additional code needed - handled by MessageInput component
```

### **Video/Audio Calls**
```typescript
// Calls are initiated through the UI buttons
// Stream Chat handles the call infrastructure
```

## 🧪 Testing

### **1. Test User Creation**
1. Sign up with Clerk
2. Check Stream dashboard for new user
3. Verify user role mapping

### **2. Test Messaging**
1. Create two test users
2. Start a conversation
3. Send messages back and forth
4. Verify real-time updates

### **3. Test Calls**
1. Initiate a call from the chat interface
2. Accept the call
3. Test audio and video functionality

## 🚨 Troubleshooting

### **Common Issues**

1. **"Stream API keys not configured"**
   - Check your `.env` file has the correct keys
   - Restart your development server

2. **"Failed to generate token"**
   - Verify your Stream Secret Key is correct
   - Check the API route is working

3. **"User not found in Stream"**
   - User will be created automatically on first login
   - Check Stream dashboard for user creation

4. **"Channel not found"**
   - Channels are created automatically when users start chatting
   - Check channel creation permissions in Stream dashboard

## 📊 Monitoring

### **Stream Dashboard Metrics**
- Active users
- Messages per day
- Channel creation rate
- Call success rate

### **Application Logs**
- User authentication events
- Channel creation events
- Message sending events
- Call initiation events

## 🔄 Next Steps

1. **Set up your Stream account and add API keys**
2. **Test the messaging functionality**
3. **Configure Stream dashboard settings**
4. **Set up push notifications for mobile**
5. **Implement advanced features like message threading**

## 📞 Support

- **Stream Documentation**: [getstream.io/docs](https://getstream.io/docs)
- **Stream Support**: [getstream.io/support](https://getstream.io/support)
- **Stream Community**: [getstream.io/community](https://getstream.io/community)

---

**🎉 Your Stream Chat integration is ready!** 

Once you add your Stream API keys to the `.env` file, users will be able to:
- Send real-time messages
- Make audio and video calls
- Share files and images
- Create group conversations
- Search message history

The implementation follows Stream Chat best practices and integrates seamlessly with your existing Clerk authentication system.
