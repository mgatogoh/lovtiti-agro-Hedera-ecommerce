import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { auth } from "@clerk/nextjs/server";

// GET /api/listings/farmer - Get current farmer's listings
export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get user and verify they are a farmer
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { profiles: true },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const hasValidProfile = user.profiles.some((p) =>
            ["FARMER", "AGROEXPERT"].includes(p.type)
        );

        if (!hasValidProfile) {
            return NextResponse.json(
                { error: "Farmer or Agro Expert profile required." },
                { status: 403 }
            );
        }

        // Get farmer's listings
        const listings = await prisma.listing.findMany({
            where: {
                sellerId: userId,
            },
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                orders: {
                    select: {
                        id: true,
                        status: true,
                        amountCents: true,
                        createdAt: true,
                    },
                },
            },
        });

        // Add some computed fields
        const listingsWithStats = listings.map(listing => ({
            ...listing,
            totalOrders: listing.orders.length,
            totalRevenue: listing.orders.reduce((sum, order) => sum + order.amountCents, 0),
            pendingOrders: listing.orders.filter(order => order.status === 'PENDING').length,
        }));

        return NextResponse.json({
            success: true,
            listings: listingsWithStats,
            total: listings.length,
        });

    } catch (error) {
        console.error('Error fetching farmer listings:', error);
        return NextResponse.json(
            { error: 'Failed to fetch listings' },
            { status: 500 }
        );
    }
}