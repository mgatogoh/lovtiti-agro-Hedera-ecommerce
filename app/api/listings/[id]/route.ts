import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import prisma from '@/lib/prisma';
// GET /api/listings/[id] - Get a specific listing
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const listing = await prisma.listing.findUnique({
      where: { id: params.id },
      include: {
        seller: {
          select: {
            id: true,
            email: true,
            profiles: {
              where: { type: 'FARMER' },
              select: {
                fullName: true,
                country: true,
                address: true,
                phone: true,
                kycStatus: true,
              },
            },
          },
        },
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

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    return NextResponse.json(listing);
  } catch (error) {
    console.error('Error fetching listing:', error);
    return NextResponse.json(
      { error: 'Failed to fetch listing' },
      { status: 500 }
    );
  }
}

// PUT /api/listings/[id] - Update a listing
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Check if listing exists and user owns it
    const existingListing = await prisma.listing.findUnique({
      where: { id: params.id },
      select: { sellerId: true },
    });

    if (!existingListing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    if (existingListing.sellerId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updatedListing = await prisma.listing.update({
      where: { id: params.id },
      data: {
        ...body,
        priceCents: body.priceCents ? parseInt(body.priceCents) : undefined,
        quantity: body.quantity ? parseFloat(body.quantity) : undefined,
        harvestDate: body.harvestDate ? new Date(body.harvestDate) : undefined,
        expiryDate: body.expiryDate ? new Date(body.expiryDate) : undefined,
      },
      include: {
        seller: {
          select: {
            id: true,
            email: true,
            profiles: {
              where: { type: 'FARMER' },
              select: {
                fullName: true,
                country: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(updatedListing);
  } catch (error) {
    console.error('Error updating listing:', error);
    return NextResponse.json(
      { error: 'Failed to update listing' },
      { status: 500 }
    );
  }
}

// PATCH /api/listings/[id] - Update specific fields of a listing
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Check if listing exists and user owns it
    const existingListing = await prisma.listing.findUnique({
      where: { id: params.id },
      select: { sellerId: true },
    });

    if (!existingListing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    if (existingListing.sellerId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updatedListing = await prisma.listing.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json(updatedListing);
  } catch (error) {
    console.error('Error updating listing:', error);
    return NextResponse.json(
      { error: 'Failed to update listing' },
      { status: 500 }
    );
  }
}

// DELETE /api/listings/[id] - Delete a listing
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if listing exists and user owns it
    const existingListing = await prisma.listing.findUnique({
      where: { id: params.id },
      select: { sellerId: true },
    });

    if (!existingListing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    if (existingListing.sellerId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Hard delete the listing
    await prisma.listing.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Error deleting listing:', error);
    return NextResponse.json(
      { error: 'Failed to delete listing' },
      { status: 500 }
    );
  }
}
