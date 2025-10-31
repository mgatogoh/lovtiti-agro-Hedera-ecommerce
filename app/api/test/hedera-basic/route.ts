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

    console.log("Testing Hedera connection with account:", accountId);

    // Create client for testnet
    // Handle different private key formats
    let privateKeyObj;
    if (privateKey.startsWith('0x')) {
      // Remove 0x prefix and create from hex string
      privateKeyObj = PrivateKey.fromString(privateKey.slice(2));
    } else {
      // Assume it's already in the correct format
      privateKeyObj = PrivateKey.fromString(privateKey);
    }
    
    const client = Client.forTestnet().setOperator(
      AccountId.fromString(accountId), 
      privateKeyObj
    );

    console.log("Client created successfully");

    // Test: Get account balance (this verifies connection and authentication)
    const balanceQuery = new AccountBalanceQuery().setAccountId(accountId);
    const balance = await balanceQuery.execute(client);
    
    console.log("Balance query successful:", balance.hbars.toString());

    return NextResponse.json({
      success: true,
      message: "Hedera testnet connection successful!",
      tests: {
        connection: "✅ Successfully connected to Hedera testnet",
        authentication: "✅ Successfully authenticated with testnet",
        balance: `✅ Account balance: ${balance.hbars.toString()} HBAR`
      },
      accountInfo: {
        accountId: accountId,
        balance: balance.hbars.toString(),
        network: "testnet"
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Hedera test failed:", error);
    
    return NextResponse.json({
      success: false,
      error: "Hedera test failed",
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
