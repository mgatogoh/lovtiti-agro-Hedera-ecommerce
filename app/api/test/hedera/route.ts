import { NextResponse } from "next/server";
import { Client, PrivateKey, AccountId, TransferTransaction, Hbar, AccountBalanceQuery } from "@hashgraph/sdk";

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

    // Test 1: Get account balance
    console.log("Testing Hedera connection...");
    const balanceQuery = new AccountBalanceQuery().setAccountId(accountId);
    const balance = await balanceQuery.execute(client);
    
    console.log("Account balance retrieved successfully");
    
    // Test 2: Create a small test transfer (1 tinybar = 0.00000001 HBAR)
    const testAmount = 1; // 1 tinybar
    const testRecipient = "0.0.3"; // Hedera testnet account
    
    console.log(`Creating test transfer of ${testAmount} tinybar to ${testRecipient}...`);
    
    const transferTx = new TransferTransaction()
      .addHbarTransfer(accountId, Hbar.fromTinybars(-testAmount))
      .addHbarTransfer(testRecipient, Hbar.fromTinybars(testAmount));
    
    // Execute the transaction
    const txResponse = await transferTx.execute(client);
    const receipt = await txResponse.getReceipt(client);
    
    console.log("Test transfer completed successfully");
    
    // Test 3: Verify the transaction
    const txId = txResponse.transactionId.toString();
    const status = receipt.status.toString();
    
    return NextResponse.json({
      success: true,
      message: "Hedera testnet integration working properly",
      tests: {
        connection: "✅ Successfully connected to Hedera testnet",
        balance: `✅ Account balance: ${balance.hbars.toString()} HBAR`,
        transfer: `✅ Test transfer completed`,
        transactionId: txId,
        status: status,
        amount: `${testAmount} tinybar (0.00000001 HBAR)`,
        recipient: testRecipient
      },
      accountInfo: {
        accountId: accountId,
        balance: balance.hbars.toString(),
        network: "testnet"
      }
    });

  } catch (error) {
    console.error("Hedera test failed:", error);
    
    return NextResponse.json({
      success: false,
      error: "Hedera test failed",
      details: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
