import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, ProfileType } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * POST /api/users/update-contact
 * Update user contract information
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, contractAddress, isContractFarmer } = body;

    // Validate required fields
    if (!userId || !contractAddress) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: userId, contractAddress'
        },
        { status: 400 }
      );
    }

    // Validate wallet address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid wallet address format'
        },
        { status: 400 }
      );
    }

    // Get user and update their profile with contract information
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profiles: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Find or create the primary profile for the user's role
    let profile = user.profiles.find(p => p.type === user.role);

    if (!profile) {
      // Create a new profile if none exists for this role
      profile = await prisma.profile.create({
        data: {
          userId: userId,
          type: user.role as ProfileType,
          fullName:  'User',
          phone: 'Not provided',
          idNumber: 'Not provided',
          hederaWallet: contractAddress,
          country: 'Not provided',
          address: 'Not provided'
        }
      });
    } else {
      // Update existing profile
      profile = await prisma.profile.update({
        where: { id: profile.id },
        data: { hederaWallet: contractAddress }
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        userId: user.id,
        hederaWallet: profile.hederaWallet,
        updatedAt: profile.updatedAt
      }
    });

  } catch (error) {
    console.error('Error updating user contract info:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update user contract information'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}






