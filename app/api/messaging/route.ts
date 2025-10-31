import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // In production, this would integrate with STREAM API
    // For now, return mock data
    const mockChats = [
      {
        id: '1',
        name: 'Dr. Ahmed Vet',
        type: 'individual',
        participants: ['farmer1', 'vet1'],
        lastMessage: {
          id: '1',
          sender: 'vet1',
          content: 'Your soil test results are ready. The pH level is perfect for tomatoes.',
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          type: 'text',
          isRead: false
        },
        unreadCount: 2,
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=40&h=40&fit=crop&crop=face',
        isOnline: true
      },
      {
        id: '2',
        name: 'Green Valley Farmers Group',
        type: 'group',
        participants: ['farmer1', 'farmer2', 'farmer3', 'distributor1'],
        lastMessage: {
          id: '2',
          sender: 'farmer2',
          content: 'The new irrigation system is working perfectly!',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
          type: 'text',
          isRead: true
        },
        unreadCount: 0,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
        isOnline: false
      }
    ];

    return NextResponse.json({ chats: mockChats });
  } catch (error) {
    console.error('Error fetching chats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chats' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { chatId, message, sender, type = 'text' } = body;

    // In production, this would send the message via STREAM API
    // For now, just return success
    const newMessage = {
      id: Date.now().toString(),
      chatId,
      sender,
      content: message,
      type,
      timestamp: new Date(),
      isRead: false
    };

    return NextResponse.json({ 
      success: true, 
      message: newMessage 
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
