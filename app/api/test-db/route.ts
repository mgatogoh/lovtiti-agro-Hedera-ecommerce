import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log('🔍 Testing database connectivity...');
    
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connection successful');

    // Get user count
    const userCount = await prisma.user.count();
    console.log(`📊 Total users in database: ${userCount}`);

    // Get recent users
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    console.log('👥 Recent users:', recentUsers);

    // Test creating a test user (will be cleaned up)
    const testUser = await prisma.user.create({
      data: {
        id: 'test-user-' + Date.now(),
        email: 'test@example.com',
        role: 'BUYER'
      }
    });

    console.log('✅ Test user created:', testUser.id);

    // Clean up test user
    await prisma.user.delete({
      where: { id: testUser.id }
    });

    console.log('🗑️ Test user cleaned up');

    return NextResponse.json({
      success: true,
      message: 'Database connectivity test successful',
      data: {
        userCount,
        recentUsers,
        testUserCreated: true,
        testUserCleaned: true
      }
    });

  } catch (error) {
    console.error('❌ Database test failed:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Database connectivity test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, userData } = body;

    console.log('🔍 Testing database operations...', { action, userData });

    switch (action) {
      case 'create_user':
        if (!userData) {
          return NextResponse.json({
            success: false,
            message: 'User data is required'
          }, { status: 400 });
        }

        const newUser = await prisma.user.create({
          data: {
            id: userData.id || 'user-' + Date.now(),
            email: userData.email || 'test@example.com',
            role: userData.role || 'BUYER'
          }
        });

        console.log('✅ User created:', newUser);

        return NextResponse.json({
          success: true,
          message: 'User created successfully',
          data: newUser
        });

      case 'get_users':
        const users = await prisma.user.findMany({
          orderBy: { createdAt: 'desc' },
          take: 10
        });

        console.log('👥 Retrieved users:', users.length);

        return NextResponse.json({
          success: true,
          message: 'Users retrieved successfully',
          data: users
        });

      case 'delete_test_users':
        const deletedUsers = await prisma.user.deleteMany({
          where: {
            email: {
              contains: 'test@'
            }
          }
        });

        console.log('🗑️ Deleted test users:', deletedUsers.count);

        return NextResponse.json({
          success: true,
          message: 'Test users deleted successfully',
          data: { deletedCount: deletedUsers.count }
        });

      default:
        return NextResponse.json({
          success: false,
          message: 'Invalid action'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ Database operation failed:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Database operation failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}











