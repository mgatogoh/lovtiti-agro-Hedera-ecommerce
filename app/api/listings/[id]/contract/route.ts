import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * POST /api/listings/[id]/contract
 * Update listing with contract information
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { contractProductId, contractTxHash, contractPrice, contractStock } = body;

    // Validate required fields
    if (!contractProductId || !contractTxHash) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: contractProductId, contractTxHash' 
        },
        { status: 400 }
      );
    }

    // Update listing with contract information
    const updatedListing = await prisma.listing.update({
      where: { id },
      data: {
        //contractProductId,
        //contractTxHash,
        //contractPrice: contractPrice ? parseFloat(contractPrice.toString()) : null,
        //contractStock: contractStock ? parseInt(contractStock.toString()) : null,
        //contractCreatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedListing
    });

  } catch (error) {
    console.error('Error updating listing contract info:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update listing contract information' 
      },
      { status: 500 }
    );
  }
}






