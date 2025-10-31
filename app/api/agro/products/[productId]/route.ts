import { NextRequest, NextResponse } from 'next/server';
import { AgroContractService, createAgroContractService } from '@/utils/agroContract';

// Initialize contract service
const contractService = createAgroContractService(
  process.env.AGRO_CONTRACT_ADDRESS || '',
  (process.env.NETWORK as 'mainnet' | 'testnet' | 'local') || 'testnet'
);

/**
 * GET /api/agro/products/[productId]
 * Get specific product information
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const { productId } = params;

    if (!productId || isNaN(Number(productId))) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid product ID' 
        },
        { status: 400 }
      );
    }

    const result = await contractService.getProduct(BigInt(productId));

    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error || 'Failed to get product information' 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data
    });

  } catch (error) {
    console.error('Error getting product:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
