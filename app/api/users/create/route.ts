import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { logUserRegistration } from '@/utils/userActivityLogger';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, email, role } = body;

    console.log('🔍 Creating user manually:', { id, email, role });

    if (!id || !email) {
      return NextResponse.json({
        success: false,
        message: 'User ID and email are required'
      }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (existingUser) {
      console.log('⚠️ User already exists:', existingUser.id);
      return NextResponse.json({
        success: false,
        message: 'User already exists',
        data: existingUser
      }, { status: 409 });
    }

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        id,
        email,
        role: (role as any) || 'BUYER'
      }
    });

    console.log('✅ User created successfully:', newUser);

    // Log user registration activity
    logUserRegistration(newUser.id, newUser.role, newUser.email, {
      registrationMethod: 'manual',
      timestamp: new Date().toISOString(),
      source: 'api'
    });

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      data: newUser
    });

  } catch (error) {
    console.error('❌ Error creating user:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to create user',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET() {
  try {
    console.log('🔍 Fetching all users...');

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    });

    console.log('✅ Users fetched successfully:', users.length);

    return NextResponse.json({
      success: true,
      message: 'Users fetched successfully',
      data: users,
      count: users.length
    });

  } catch (error) {
    console.error('❌ Error fetching users:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch users',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}











