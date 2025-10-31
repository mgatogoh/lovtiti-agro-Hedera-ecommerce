import { NextRequest, NextResponse } from 'next/server';
import { AgroContractService, createAgroContractService } from '@/utils/agroContract';
import { BuyProductParams, WithdrawBalanceParams } from '@/types/agro-contract';

// Initialize contract service
const contractService = createAgroContractService(
  process.env.AGRO_CONTRACT_ADDRESS || '',
  (process.env.NETWORK as 'mainnet' | 'testnet' | 'local') || 'testnet'
);

/**
 * POST /api/agro/purchase/buy
 * Buy a product from the marketplace
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, amount, value, walletAddress, privateKey, userId } = body;

    // Validate required fields
    if (!productId || !amount || !value || !walletAddress || !privateKey || !userId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: productId, amount, value, walletAddress, privateKey, userId' 
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

    // Get product information to validate purchase
    const productResult = await contractService.getProduct(BigInt(productId));
    if (!productResult.success || !productResult.data) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Product not found' 
        },
        { status: 404 }
      );
    }

    const product = productResult.data;

    // Validate purchase conditions
    if (product.stock < BigInt(amount)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Insufficient stock available' 
        },
        { status: 400 }
      );
    }

    const requiredValue = product.price * BigInt(amount);
    if (BigInt(value) < requiredValue) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Insufficient payment amount' 
        },
        { status: 400 }
      );
    }

    if (product.owner.toLowerCase() === walletAddress.toLowerCase()) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Cannot buy your own product' 
        },
        { status: 400 }
      );
    }

    // Execute purchase on contract
    const buyParams: BuyProductParams = {
      productId: BigInt(productId),
      amount: BigInt(amount),
      value: BigInt(value),
      walletAddress,
      privateKey
    };

    const result = await contractService.buyProduct(buyParams);

    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error || 'Failed to purchase product' 
        },
        { status: 500 }
      );
    }

    // Log the transaction for audit purposes
    console.log(`Product purchased: ${productId} by buyer: ${walletAddress}`, {
      amount: amount,
      value: value,
      sellerAddress: product.owner,
      transactionHash: result.transactionHash,
      gasUsed: result.gasUsed?.toString()
    });

    return NextResponse.json({
      success: true,
      data: {
        productId,
        amount: amount,
        value: value,
        buyerAddress: walletAddress,
        sellerAddress: product.owner,
        transactionHash: result.transactionHash,
        gasUsed: result.gasUsed?.toString(),
        userId
      }
    });

  } catch (error) {
    console.error('Error purchasing product:', error);
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
 * POST /api/agro/purchase/withdraw
 * Withdraw farmer balance
 */
export async function PUT(request: NextRequest) {
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

    // Get farmer balance
    const farmerInfo = await contractService.getFarmerInfo(walletAddress);
    if (!farmerInfo.success || !farmerInfo.data) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to get farmer information' 
        },
        { status: 500 }
      );
    }

    if (farmerInfo.data.balance <= 0n) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No balance to withdraw' 
        },
        { status: 400 }
      );
    }

    // Withdraw balance from contract
    const withdrawParams: WithdrawBalanceParams = {
      walletAddress,
      privateKey
    };

    const result = await contractService.withdrawBalance(withdrawParams);

    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error || 'Failed to withdraw balance' 
        },
        { status: 500 }
      );
    }

    // Log the transaction for audit purposes
    console.log(`Balance withdrawn by farmer: ${walletAddress}`, {
      withdrawnAmount: farmerInfo.data.balance.toString(),
      transactionHash: result.transactionHash,
      gasUsed: result.gasUsed?.toString()
    });

    return NextResponse.json({
      success: true,
      data: {
        farmerAddress: walletAddress,
        withdrawnAmount: farmerInfo.data.balance.toString(),
        transactionHash: result.transactionHash,
        gasUsed: result.gasUsed?.toString(),
        userId
      }
    });

  } catch (error) {
    console.error('Error withdrawing balance:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
