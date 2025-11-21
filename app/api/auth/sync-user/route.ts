import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getRoleDisplayName, getRolePermissions, UserRole } from '@/utils/roleManager';
import { requireAuth } from '@/lib/auth'; // JWT auth helper

export async function GET() {
  try {
    // Require authentication
    const session = await requireAuth();
    const userId = session.id;

    console.log(`[SYNC-USER] Fetching profile for user: ${userId}`);

    // Fetch user from database with profiles
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profiles: true }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Build role metadata
    const roleInfo = {
      role: user.role,
      displayName: getRoleDisplayName(user.role as UserRole),
      permissions: getRolePermissions(user.role as UserRole),
    };

    return NextResponse.json({
      success: true,
      message: 'User profile fetched successfully',
      data: {
        user,
        profiles: user.profiles,
        roleInfo,
      },
    });
  } catch (error) {
    console.error('[SYNC-USER] Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch user profile',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
