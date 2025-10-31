import { StreamChat } from 'stream-chat';

// Stream Chat configuration
export const STREAM_API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY || '';
export const STREAM_SECRET_KEY = process.env.STREAM_SECRET_KEY || '';

// Initialize Stream Chat client
export const streamClient = StreamChat.getInstance(STREAM_API_KEY);

// User role mapping for Stream Chat
export const getUserRoleForStream = (clerkRole: string) => {
  const roleMap: Record<string, string> = {
    'FARMER': 'farmer',
    'BUYER': 'buyer',
    'DISTRIBUTOR': 'distributor',
    'TRANSPORTER': 'transporter',
    'AGROEXPERT': 'agro-vet',
    'ADMIN': 'admin'
  };
  return roleMap[clerkRole] || 'buyer';
};

// Generate Stream Chat user token
export const generateStreamToken = async (userId: string, userRole: string) => {
  try {
    const response = await fetch('/api/stream/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        userRole,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate Stream token');
    }

    const { token } = await response.json();
    return token;
  } catch (error) {
    console.error('Error generating Stream token:', error);
    throw error;
  }
};

// Create or get channel
export const createOrGetChannel = async (
  client: StreamChat,
  channelType: string,
  channelId: string,
  members: string[],
  metadata?: Record<string, any>
) => {
  try {
    const channel = client.channel(channelType, channelId, {
      members,
      ...metadata,
    });

    await channel.create();
    return channel;
  } catch (error) {
    console.error('Error creating/getting channel:', error);
    throw error;
  }
};

// Stream Chat channel types for different user interactions
export const CHANNEL_TYPES = {
  FARMER_VET: 'farmer-vet',
  FARMER_BUYER: 'farmer-buyer',
  FARMER_DISTRIBUTOR: 'farmer-distributor',
  FARMER_TRANSPORTER: 'farmer-transporter',
  GROUP_FARMERS: 'group-farmers',
  GROUP_BUYERS: 'group-buyers',
  SUPPORT: 'support',
} as const;

export type ChannelType = typeof CHANNEL_TYPES[keyof typeof CHANNEL_TYPES];











