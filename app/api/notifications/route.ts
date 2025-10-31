import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // In production, this would fetch notifications from Redis/database
    // For now, return mock data
    const notifications = [
      {
        id: '1',
        type: 'message',
        title: 'New message from Dr. Ahmed Vet',
        content: 'Your soil test results are ready!',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        isRead: false,
        priority: 'medium'
      },
      {
        id: '2',
        type: 'order',
        title: 'Order Update',
        content: 'Your order #12345 has been shipped',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        isRead: false,
        priority: 'high'
      },
      {
        id: '3',
        type: 'system',
        title: 'System Maintenance',
        content: 'Scheduled maintenance on Sunday 2AM-4AM',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
        isRead: true,
        priority: 'low'
      }
    ];

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, type, title, content, priority = 'medium' } = body;

    // In production, this would create a notification in Redis/database
    // For now, just return success
    const notification = {
      id: Date.now().toString(),
      userId,
      type,
      title,
      content,
      timestamp: new Date(),
      isRead: false,
      priority
    };

    return NextResponse.json({ 
      success: true, 
      notification 
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { notificationId, isRead } = body;

    // In production, this would update the notification in Redis/database
    // For now, just return success
    return NextResponse.json({ 
      success: true, 
      message: 'Notification updated' 
    });
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    );
  }
}
