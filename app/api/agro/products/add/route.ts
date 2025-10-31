import { NextRequest, NextResponse } from 'next/server';
import { AgroContractService, createAgroContractService } from '@/utils/agroContract';
import { AddProductParams, UpdateStockParams, IncreasePriceParams } from '@/types/agro-contract';

// Initialize contract service
const contractService = createAgroContractService(
  process.env.AGRO_CONTRACT_ADDRESS || '',
  (process.env.NETWORK as 'mainnet' | 'testnet' | 'local') || 'testnet'
);

/**
 * POST /api/agro/products/add
 * Add a new product to the marketplace
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { price, amount, walletAddress, privateKey, userId } = body;

    // Validate required fields
    if (!price || !amount || !walletAddress || !privateKey || !userId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: price, amount, walletAddress, privateKey, userId' 
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

    // Check if user is a farmer
    const farmerCheck = await contractService.isFarmer(walletAddress);
    if (!farmerCheck.success || !farmerCheck.data) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'User is not a registered farmer' 
        },
        { status: 403 }
      );
    }

    // Add product to contract
    const addParams: AddProductParams = {
      price: BigInt(price),
      amount: BigInt(amount),
      walletAddress,
      privateKey
    };

    const result = await contractService.addProduct(addParams);

    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error || 'Failed to add product to contract' 
        },
        { status: 500 }
      );
    }

    // Log the transaction for audit purposes
    console.log(`Product added by farmer: ${walletAddress} for user: ${userId}`, {
      productId: result.data?.productId?.toString(),
      price: price,
      amount: amount,
      transactionHash: result.transactionHash,
      gasUsed: result.gasUsed?.toString()
    });

    return NextResponse.json({
      success: true,
      data: {
        productId: result.data?.productId?.toString(),
        price: price,
        amount: amount,
        farmerAddress: walletAddress,
        transactionHash: result.transactionHash,
        gasUsed: result.gasUsed?.toString(),
        userId
      }
    });

  } catch (error) {
    console.error('Error adding product:', error);
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
 * PUT /api/agro/products/[productId]/stock
 * Update product stock
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const { productId } = params;
    const body = await request.json();
    const { stock, walletAddress, privateKey, userId } = body;

    // Validate required fields
    if (!stock || !walletAddress || !privateKey || !userId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: stock, walletAddress, privateKey, userId' 
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

    // Update stock on contract
    const updateParams: UpdateStockParams = {
      productId: BigInt(productId),
      stock: BigInt(stock),
      walletAddress,
      privateKey
    };

    const result = await contractService.updateStock(updateParams);

    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error || 'Failed to update product stock' 
        },
        { status: 500 }
      );
    }

    // Log the transaction for audit purposes
    console.log(`Stock updated for product: ${productId} by farmer: ${walletAddress}`, {
      newStock: stock,
      transactionHash: result.transactionHash,
      gasUsed: result.gasUsed?.toString()
    });

    return NextResponse.json({
      success: true,
      data: {
        productId,
        newStock: stock,
        farmerAddress: walletAddress,
        transactionHash: result.transactionHash,
        gasUsed: result.gasUsed?.toString(),
        userId
      }
    });

  } catch (error) {
    console.error('Error updating stock:', error);
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
 * PATCH /api/agro/products/[productId]/price
 * Increase product price
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const { productId } = params;
    const body = await request.json();
    const { price, walletAddress, privateKey, userId } = body;

    // Validate required fields
    if (!price || !walletAddress || !privateKey || !userId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: price, walletAddress, privateKey, userId' 
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

    // Increase price on contract
    const increaseParams: IncreasePriceParams = {
      productId: BigInt(productId),
      price: BigInt(price),
      walletAddress,
      privateKey
    };

    const result = await contractService.increasePrice(increaseParams);

    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error || 'Failed to increase product price' 
        },
        { status: 500 }
      );
    }

    // Log the transaction for audit purposes
    console.log(`Price increased for product: ${productId} by farmer: ${walletAddress}`, {
      newPrice: price,
      transactionHash: result.transactionHash,
      gasUsed: result.gasUsed?.toString()
    });

    return NextResponse.json({
      success: true,
      data: {
        productId,
        newPrice: price,
        farmerAddress: walletAddress,
        transactionHash: result.transactionHash,
        gasUsed: result.gasUsed?.toString(),
        userId
      }
    });

  } catch (error) {
    console.error('Error increasing price:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
