import { NextRequest, NextResponse } from 'next/server';
import Web3 from 'web3';

// Contract addresses for different tokens (Ethereum mainnet)
const CONTRACT_ADDRESSES = {
  ETH: '0x0000000000000000000000000000000000000000', // Native ETH
  USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7', // Tether USD
  USDC: '0xA0b86a33E6441b8c4C8C0E4A8b8c4C8C0E4A8b8c', // USD Coin
  DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F', // Dai Stablecoin
};

// ERC-20 ABI for token transfers
const ERC20_ABI = [
  {
    "constant": false,
    "inputs": [
      { "name": "_to", "type": "address" },
      { "name": "_value", "type": "uint256" }
    ],
    "name": "transfer",
    "outputs": [{ "name": "", "type": "bool" }],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{ "name": "_owner", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "name": "balance", "type": "uint256" }],
    "type": "function"
  }
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, deliveryInfo, totals, tokenType = 'USDT' } = body;

    // Validate required fields
    if (!items || !deliveryInfo || !totals) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate token type
    if (!CONTRACT_ADDRESSES[tokenType as keyof typeof CONTRACT_ADDRESSES]) {
      return NextResponse.json(
        { error: 'Unsupported token type' },
        { status: 400 }
      );
    }

    // Convert HBAR to token amount (simplified conversion)
    // In production, you would use real-time exchange rates
    const conversionRates = {
      ETH: 0.0001, // 1 HBAR = 0.0001 ETH (example)
      USDT: 0.001, // 1 HBAR = 0.001 USDT (example)
      USDC: 0.001, // 1 HBAR = 0.001 USDC (example)
      DAI: 0.001,  // 1 HBAR = 0.001 DAI (example)
    };

    const rate = conversionRates[tokenType as keyof typeof conversionRates];
    const tokenAmount = totals.total * rate;

    // Create transaction data
    const transactionData = {
      orderId: `AGRO-${Date.now()}`,
      tokenType,
      tokenAmount,
      HBARAmount: totals.total,
      conversionRate: rate,
      recipientAddress: process.env.METAMASK_RECIPIENT_ADDRESS || '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', // Your business wallet
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

    // Generate transaction parameters for MetaMask
    let transactionParams;

    if (tokenType === 'ETH') {
      // Native ETH transaction
      transactionParams = {
        to: transactionData.recipientAddress,
        value: Web3.utils.toHex(Web3.utils.toWei(tokenAmount.toString(), 'ether')),
        gas: '0x5208', // 21000 gas for simple transfer
        gasPrice: '0x4a817c800', // 20 gwei (example)
        data: '0x', // Empty data for simple transfer
      };
    } else {
      // ERC-20 token transaction
      const contractAddress = CONTRACT_ADDRESSES[tokenType as keyof typeof CONTRACT_ADDRESSES];
      const web3 = new Web3();

      // Encode the transfer function call
      const transferData = web3.eth.abi.encodeFunctionCall(
        {
          name: 'transfer',
          type: 'function',
          inputs: [
            { type: 'address', name: '_to' },
            { type: 'uint256', name: '_value' }
          ]
        },
        [
          transactionData.recipientAddress,
          Web3.utils.toHex(Web3.utils.toWei(tokenAmount.toString(), 'ether'))
        ]
      );

      transactionParams = {
        to: contractAddress,
        value: '0x0', // No ETH value for token transfers
        gas: '0x7530', // 30000 gas for token transfer
        gasPrice: '0x4a817c800', // 20 gwei (example)
        data: transferData,
      };
    }

    // Store transaction data for tracking
    const transactionRecord = {
      ...transactionData,
      transactionParams,
      status: 'pending',
      network: 'ethereum',
      contractAddress: tokenType !== 'ETH' ? CONTRACT_ADDRESSES[tokenType as keyof typeof CONTRACT_ADDRESSES] : null,
    };

    // TODO: Save transaction record to database
    console.log('MetaMask transaction created:', transactionRecord);

    return NextResponse.json({
      success: true,
      orderId: transactionData.orderId,
      tokenType,
      tokenAmount,
      HBARAmount: totals.total,
      conversionRate: rate,
      transactionParams,
      message: `Please confirm the ${tokenType} transaction in MetaMask`,
      instructions: [
        '1. Open MetaMask extension',
        '2. Review the transaction details',
        '3. Confirm the transaction',
        '4. Wait for blockchain confirmation',
        '5. You will receive a confirmation email once processed',
      ],
    });

  } catch (error) {
    console.error('MetaMask transaction creation error:', error);
    return NextResponse.json(
      {
        error: 'MetaMask payment failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Function to verify transaction on blockchain
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const transactionHash = searchParams.get('hash');
    const tokenType = searchParams.get('token') || 'USDT';

    if (!transactionHash) {
      return NextResponse.json(
        { error: 'Transaction hash is required' },
        { status: 400 }
      );
    }

    // Initialize Web3 (you would use a real Ethereum node or service like Infura)
    const web3 = new Web3(process.env.ETHEREUM_RPC_URL || 'https://mainnet.infura.io/v3/YOUR_PROJECT_ID');

    try {
      // Get transaction receipt
      const receipt = await web3.eth.getTransactionReceipt(transactionHash);

      if (!receipt) {
        return NextResponse.json({
          success: false,
          message: 'Transaction not found or still pending',
        });
      }

      // Check if transaction was successful
      const isSuccessful = receipt.status === 1n;

      if (isSuccessful) {
        // Get transaction details
        const transaction = await web3.eth.getTransaction(transactionHash);

        const transactionData = {
          hash: transactionHash,
          blockNumber: receipt.blockNumber,
          blockHash: receipt.blockHash,
          from: transaction.from,
          to: transaction.to,
          value: transaction.value,
          gasUsed: receipt.gasUsed,
          status: 'confirmed',
          confirmedAt: new Date(),
        };

        // TODO: Update transaction record in database
        console.log('Transaction confirmed:', transactionData);

        return NextResponse.json({
          success: true,
          message: 'Transaction confirmed successfully',
          data: transactionData,
        });
      } else {
        return NextResponse.json({
          success: false,
          message: 'Transaction failed',
          hash: transactionHash,
        });
      }

    } catch (web3Error) {
      console.error('Web3 error:', web3Error);
      return NextResponse.json({
        success: false,
        message: 'Error verifying transaction',
        error: web3Error instanceof Error ? web3Error.message : 'Unknown error',
      });
    }

  } catch (error) {
    console.error('Transaction verification error:', error);
    return NextResponse.json(
      {
        error: 'Transaction verification failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
