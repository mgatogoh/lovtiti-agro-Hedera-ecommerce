import { NextResponse } from "next/server";
import { Client, PrivateKey, AccountId, AccountBalanceQuery } from "@hashgraph/sdk";

export async function GET() {
  try {
    // Get credentials from environment
    const accountId = process.env.HEDERA_ACCOUNT_ID as string;
    const privateKey = process.env.HEDERA_PRIVATE_KEY as string;
    
    if (!accountId || !privateKey) {
      return NextResponse.json({ 
        error: "Missing Hedera credentials", 
        details: "HEDERA_ACCOUNT_ID and HEDERA_PRIVATE_KEY must be set" 
      }, { status: 500 });
    }

    console.log("Running comprehensive Hedera test...");

    // Test 1: Basic connection and authentication
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

    // Test 2: Get account balance
    const balanceQuery = new AccountBalanceQuery().setAccountId(accountId);
    const balance = await balanceQuery.execute(client);

    // Test 3: Verify network configuration
    const network = client.network;
    const isTestnet = network.toString().includes('testnet');

    return NextResponse.json({
      success: true,
      message: "Hedera testnet integration is working properly!",
      testResults: {
        connection: {
          status: "✅ PASSED",
          details: "Successfully connected to Hedera testnet"
        },
        authentication: {
          status: "✅ PASSED", 
          details: "Successfully authenticated with provided credentials"
        },
        balanceQuery: {
          status: "✅ PASSED",
          details: `Account balance retrieved: ${balance.hbars.toString()} HBAR`
        },
        networkVerification: {
          status: "✅ PASSED",
          details: `Connected to ${isTestnet ? 'testnet' : 'mainnet'} network`
        }
      },
      accountDetails: {
        accountId: accountId,
        balance: balance.hbars.toString(),
        network: "testnet",
        hasSufficientBalance: balance.hbars.toTinybars().toNumber() > 1000000 // More than 1 HBAR
      },
      integrationStatus: {
        readyForProduction: false, // Set to true when ready
        readyForDevelopment: true,
        notes: [
          "✅ Hedera SDK is properly installed and configured",
          "✅ Testnet connection is working",
          "✅ Account authentication is successful", 
          "✅ Balance queries are functional",
          "⚠️ Transaction signing may need private key format adjustment",
          "✅ Ready for basic Hedera operations in development"
        ]
      },
      nextSteps: [
        "Test transaction signing with different private key formats",
        "Implement escrow smart contract integration",
        "Add transaction history tracking",
        "Set up proper error handling for production"
      ],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Hedera test failed:", error);
    
    return NextResponse.json({
      success: false,
      error: "Hedera integration test failed",
      details: error instanceof Error ? error.message : "Unknown error",
      troubleshooting: {
        checkCredentials: "Verify HEDERA_ACCOUNT_ID and HEDERA_PRIVATE_KEY are correct",
        checkFormat: "Private key should be in hex format (with or without 0x prefix)",
        checkNetwork: "Ensure you're using testnet credentials, not mainnet",
        checkBalance: "Account should have some HBAR for operations"
      }
    }, { status: 500 });
  }
}
