import { NextRequest, NextResponse } from 'next/server';
import { StreamChat } from 'stream-chat';
import { STREAM_API_KEY, STREAM_SECRET_KEY, getUserRoleForStream } from '@/lib/stream';

export async function POST(request: NextRequest) {
  try {
    const { userId, userRole } = await request.json();

    if (!userId || !userRole) {
      return NextResponse.json(
        { error: 'User ID and role are required' },
        { status: 400 }
      );
    }

    if (!STREAM_API_KEY || !STREAM_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Stream API keys not configured' },
        { status: 500 }
      );
    }

    // Initialize Stream Chat server client
    const serverClient = StreamChat.getInstance(STREAM_API_KEY, STREAM_SECRET_KEY);

    // Create or update user in Stream Chat
    const streamRole = getUserRoleForStream(userRole);
    
    await serverClient.upsertUser({
      id: userId,
      role: streamRole,
      name: `User ${userId}`,
      // Add more user metadata as needed
    });

    // Generate token for the user
    const token = serverClient.createToken(userId);

    return NextResponse.json({ 
      token,
      userId,
      userRole: streamRole 
    });

  } catch (error) {
    console.error('Error generating Stream token:', error);
    return NextResponse.json(
      { error: 'Failed to generate token' },
      { status: 500 }
    );
  }
}











