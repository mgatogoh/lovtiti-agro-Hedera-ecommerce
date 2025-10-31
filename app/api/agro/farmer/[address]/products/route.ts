import { NextRequest, NextResponse } from 'next/server';
import { AgroContractService, createAgroContractService } from '@/utils/agroContract';

// Initialize contract service
const contractService = createAgroContractService(
  process.env.AGRO_CONTRACT_ADDRESS || '',
  (process.env.NETWORK as 'mainnet' | 'testnet' | 'local') || 'testnet'
);

/**
 * GET /api/agro/farmer/[address]/products
 * Get all products for a specific farmer
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    const { address } = params;

    if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid wallet address format' 
        },
        { status: 400 }
      );
    }

    const result = await contractService.getFarmerProducts(address);

    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error || 'Failed to get farmer products' 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data
    });

  } catch (error) {
    console.error('Error getting farmer products:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
