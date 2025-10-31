import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { getRoleDisplayName, getRolePermissions, UserRole } from '@/utils/roleManager';

const syncUserSchema = z.object({
  userId: z.string().min(1, 'Missing Clerk user ID'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = syncUserSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({
        success: false,
        message: 'Invalid request data',
        errors: validation.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      }, { status: 400 });
    }

    const { userId } = validation.data;

    console.log(`[SYNC-USER] Syncing user: ${userId}`);

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profiles: true }
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User not found in database',
      }, { status: 404 });
    }

    // Sync role metadata to Clerk
    try {
      const currentUser = await clerkClient.users.getUser(userId);
      const currentMetadata = currentUser.publicMetadata || {};

      await clerkClient.users.updateUserMetadata(userId, {
        publicMetadata: {
          ...currentMetadata,
          role: user.role,
          synced: true,
          syncedAt: new Date().toISOString(),
        },
      });

      console.log(`[SYNC-USER] ✅ Successfully synced role ${user.role} to Clerk for user ${userId}`);
    } catch (clerkError) {
      console.warn('[SYNC-USER] ⚠️ Failed to sync to Clerk:', clerkError);
      // Don't fail the request if Clerk sync fails
    }

    const roleInfo = {
      role: user.role,
      displayName: getRoleDisplayName(user.role as UserRole),
      permissions: getRolePermissions(user.role as UserRole),
    };

    return NextResponse.json({
      success: true,
      message: 'User synced successfully',
      data: {
        user,
        profiles: user.profiles,
        roleInfo,
      },
    });
  } catch (error) {
    console.error('[SYNC-USER] Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to sync user',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}