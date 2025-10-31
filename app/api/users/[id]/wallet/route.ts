import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, ProfileType } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const userId = params.id;

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        // Get user's wallet information from profile
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                role: true,
                profiles: {
                    select: {
                        hederaWallet: true,
                        type: true
                    }
                }
            }
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Get the primary profile's wallet (matching user role or first available)
        const primaryProfile = user.profiles.find(p => p.type === user.role) || user.profiles[0];
        const hederaWallet = primaryProfile?.hederaWallet || 'Not provided';

        return NextResponse.json({
            success: true,
            userId: user.id,
            hederaWallet: hederaWallet,
            role: user.role,
            name: "Name",
        });

    } catch (error) {
        console.error('Error fetching user wallet:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const userId = params.id;
        const { hederaWallet } = await request.json();

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        if (!hederaWallet) {
            return NextResponse.json(
                { error: 'Hedera wallet address is required' },
                { status: 400 }
            );
        }

        // Validate Hedera wallet format (basic validation)
        if (!hederaWallet.match(/^0\.0\.\d+$/)) {
            return NextResponse.json(
                { error: 'Invalid Hedera wallet format. Expected format: 0.0.123456' },
                { status: 400 }
            );
        }

        // Get user and their profile
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                profiles: true
            }
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
                    fullName: 'User',
                    phone: 'Not provided',
                    idNumber: 'Not provided',
                    hederaWallet: hederaWallet,
                    country: 'Not provided',
                    address: 'Not provided'
                }
            });
        } else {
            // Update existing profile
            profile = await prisma.profile.update({
                where: { id: profile.id },
                data: { hederaWallet }
            });
        }

        return NextResponse.json({
            success: true,
            message: 'Wallet updated successfully',
            userId: user.id,
            hederaWallet: profile.hederaWallet,
            role: user.role,
            name: "User",
        });

    } catch (error) {
        console.error('Error updating user wallet:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}