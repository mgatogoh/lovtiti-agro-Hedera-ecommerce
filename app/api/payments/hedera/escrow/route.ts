import { NextRequest, NextResponse } from 'next/server';
import {
  Client,
  PrivateKey,
  AccountId,
  TransferTransaction,
  Hbar,
  ContractCreateFlow,
  ContractFunctionParameters,
  ContractCallQuery,
  ContractExecuteTransaction
} from '@hashgraph/sdk';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, deliveryInfo, totals } = body;

    // Validate required fields
    if (!items || !deliveryInfo || !totals) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Initialize Hedera client
    const accountId = process.env.HEDERA_ACCOUNT_ID!;
    const privateKey = process.env.HEDERA_PRIVATE_KEY!;

    if (!accountId || !privateKey) {
      throw new Error('Hedera credentials not configured');
    }

    let privateKeyObj;
    if (privateKey.startsWith('0x')) {
      privateKeyObj = PrivateKey.fromString(privateKey.slice(2));
    } else {
      privateKeyObj = PrivateKey.fromString(privateKey);
    }

    const client = Client.forTestnet().setOperator(
      AccountId.fromString(accountId),
      privateKeyObj
    );

    // Convert HBAR to HBAR (simplified conversion rate)
    // In production, you would use a real-time exchange rate API
    const HBARToHbarRate = 0.0001; // 1 HBAR = 0.0001 HBAR (example rate)
    const hbarAmount = Math.round(totals.total * HBARToHbarRate * 100) / 100; // Round to 2 decimal places

    // Create escrow transaction
    const escrowData = {
      orderId: `AGRO-${Date.now()}`,
      buyerId: deliveryInfo.email, // Using email as buyer identifier
      sellerId: items[0]?.sellerId || 'unknown',
      amount: hbarAmount,
      items: items.map((item: any) => ({
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      deliveryInfo: {
        address: deliveryInfo.address,
        city: deliveryInfo.city,
        state: deliveryInfo.state,
        phone: deliveryInfo.phone,
      },
      createdAt: new Date().toISOString(),
    };

    // Create a simple escrow using Hedera's native functionality
    // In production, you would deploy a smart contract for more complex escrow logic
    const escrowTransaction = new TransferTransaction()
      .addHbarTransfer(accountId, Hbar.fromTinybars(-Math.round(hbarAmount * 100000000))) // Convert HBAR to tinybars
      .addHbarTransfer(AccountId.fromString('0.0.3'), Hbar.fromTinybars(Math.round(hbarAmount * 100000000))) // Escrow account
      .setTransactionMemo(JSON.stringify(escrowData));

    // Execute the transaction
    const response = await escrowTransaction.execute(client);
    const receipt = await response.getReceipt(client);

    if (receipt.status.toString() !== 'SUCCESS') {
      throw new Error(`Hedera transaction failed: ${receipt.status}`);
    }

    const transactionId = response.transactionId.toString();

    // Store escrow information
    const escrowRecord = {
      transactionId,
      orderId: escrowData.orderId,
      amount: hbarAmount,
      currency: 'HBAR',
      status: 'escrowed',
      buyerId: escrowData.buyerId,
      sellerId: escrowData.sellerId,
      items: escrowData.items,
      deliveryInfo: escrowData.deliveryInfo,
      createdAt: escrowData.createdAt,
      escrowAccount: '0.0.3', // Hedera escrow account
    };

    // TODO: Save escrow record to database
    console.log('Hedera escrow created:', escrowRecord);

    return NextResponse.json({
      success: true,
      transactionId,
      orderId: escrowData.orderId,
      amount: hbarAmount,
      currency: 'HBAR',
      message: 'Payment escrowed successfully. Funds will be released upon delivery confirmation.',
      escrowRecord,
    });

  } catch (error) {
    console.error('Hedera escrow error:', error);
    return NextResponse.json(
      {
        error: 'Hedera payment failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Function to release escrow funds (to be called when delivery is confirmed)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { transactionId, orderId, sellerAccountId } = body;

    if (!transactionId || !orderId || !sellerAccountId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Initialize Hedera client
    const accountId = process.env.HEDERA_ACCOUNT_ID!;
    const privateKey = process.env.HEDERA_PRIVATE_KEY!;

    let privateKeyObj;
    if (privateKey.startsWith('0x')) {
      privateKeyObj = PrivateKey.fromString(privateKey.slice(2));
    } else {
      privateKeyObj = PrivateKey.fromString(privateKey);
    }

    const client = Client.forTestnet().setOperator(
      AccountId.fromString(accountId),
      privateKeyObj
    );

    // TODO: Retrieve escrow amount from database using transactionId
    const escrowAmount = 1.0; // This should come from the database

    // Release escrow funds to seller
    const releaseTransaction = new TransferTransaction()
      .addHbarTransfer(AccountId.fromString('0.0.3'), Hbar.fromTinybars(-Math.round(escrowAmount * 100000000)))
      .addHbarTransfer(AccountId.fromString(sellerAccountId), Hbar.fromTinybars(Math.round(escrowAmount * 100000000)))
      .setTransactionMemo(`Release escrow for order ${orderId}`);

    const response = await releaseTransaction.execute(client);
    const receipt = await response.getReceipt(client);

    if (receipt.status.toString() !== 'SUCCESS') {
      throw new Error(`Hedera release transaction failed: ${receipt.status}`);
    }

    const releaseTransactionId = response.transactionId.toString();

    // TODO: Update escrow record status to 'released'
    console.log('Hedera escrow released:', {
      originalTransactionId: transactionId,
      releaseTransactionId,
      orderId,
      sellerAccountId,
      amount: escrowAmount,
      releasedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      releaseTransactionId,
      message: 'Escrow funds released successfully',
    });

  } catch (error) {
    console.error('Hedera escrow release error:', error);
    return NextResponse.json(
      {
        error: 'Escrow release failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
