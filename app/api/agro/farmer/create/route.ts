import { NextRequest, NextResponse } from 'next/server';
import { AgroContractService, createAgroContractService } from '@/utils/agroContract';
import { CreateFarmerParams } from '@/types/agro-contract';

// Initialize contract service
const contractService = createAgroContractService(
  process.env.AGRO_CONTRACT_ADDRESS || '',
  (process.env.NETWORK as 'mainnet' | 'testnet' | 'local') || 'testnet'
);

/**
 * POST /api/agro/farmer/create
 * Create a farmer account on the smart contract during signup
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, privateKey, userId } = body;

    // Validate required fields
    if (!walletAddress || !privateKey || !userId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: walletAddress, privateKey, userId' 
        },
        { status: 400 }
      );
    }

    // Validate wallet address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid wallet address format' 
        },
        { status: 400 }
      );
    }

    // Check if farmer already exists
    const farmerCheck = await contractService.isFarmer(walletAddress);
    if (farmerCheck.success && farmerCheck.data) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Farmer already exists on the contract' 
        },
        { status: 409 }
      );
    }

    // Create farmer on contract
    const createParams: CreateFarmerParams = {
      walletAddress,
      privateKey
    };

    const result = await contractService.createFarmer(createParams);

    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error || 'Failed to create farmer on contract' 
        },
        { status: 500 }
      );
    }

    // Log the transaction for audit purposes
    console.log(`Farmer created: ${walletAddress} for user: ${userId}`, {
      transactionHash: result.transactionHash,
      gasUsed: result.gasUsed?.toString()
    });

    return NextResponse.json({
      success: true,
      data: {
        farmerAddress: walletAddress,
        transactionHash: result.transactionHash,
        gasUsed: result.gasUsed?.toString(),
        userId
      }
    });

  } catch (error) {
    console.error('Error creating farmer:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/agro/farmer/[address]
 * Get farmer information from the contract
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

    const result = await contractService.getFarmerInfo(address);

    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error || 'Failed to get farmer information' 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data
    });

  } catch (error) {
    console.error('Error getting farmer info:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
