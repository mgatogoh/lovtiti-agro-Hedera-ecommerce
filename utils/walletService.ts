// Wallet Integration Service for MetaMask and Hedera
import { Client, PrivateKey, AccountId, AccountCreateTransaction, Hbar, AccountBalanceQuery } from "@hashgraph/sdk";

export interface WalletAccount {
  ethereumAddress: string;
  hederaAccountId: string;
  hederaAccountKey: string;
  isConnected: boolean;
  balance: {
    ethereum: string;
    hbar: string;
  };
}

export interface HederaConnection {
  client: Client;
  accountId: AccountId;
  privateKey: PrivateKey;
  network: "testnet" | "mainnet";
}

export interface BridgeTransaction {
  ethereumTxHash: string;
  hederaTxHash: string;
  status: "PENDING" | "COMPLETED" | "FAILED";
  amount: string;
  from: string;
  to: string;
  timestamp: Date;
}

// MetaMask Integration
export class MetaMaskService {
  private static instance: MetaMaskService;
  private ethereum: any;

  private constructor() {
    this.ethereum = (window as any).ethereum;
  }

  public static getInstance(): MetaMaskService {
    if (!MetaMaskService.instance) {
      MetaMaskService.instance = new MetaMaskService();
    }
    return MetaMaskService.instance;
  }

  public async isMetaMaskInstalled(): Promise<boolean> {
    return typeof this.ethereum !== "undefined";
  }

  public async connectWallet(): Promise<WalletAccount> {
    if (!await this.isMetaMaskInstalled()) {
      throw new Error("MetaMask is not installed");
    }

    try {
      // Request account access
      const accounts = await this.ethereum.request({
        method: "eth_requestAccounts",
      });

      const ethereumAddress = accounts[0];
      
      // Get balance
      const balance = await this.ethereum.request({
        method: "eth_getBalance",
        params: [ethereumAddress, "latest"],
      });

      // Create or get Hedera account
      const hederaAccount = await this.createOrGetHederaAccount(ethereumAddress);

      return {
        ethereumAddress,
        hederaAccountId: hederaAccount.accountId,
        hederaAccountKey: hederaAccount.privateKey.toString(),
        isConnected: true,
        balance: {
          ethereum: this.formatEtherBalance(balance),
          hbar: await this.getHederaBalance(hederaAccount.accountId),
        },
      };
    } catch (error) {
      throw new Error(`Failed to connect wallet: ${error instanceof Error ? error instanceof Error ? error.message : 'Unknown error' : 'Unknown error'}`);
    }
  }

  public async signMessage(message: string): Promise<string> {
    if (!this.ethereum) {
      throw new Error("MetaMask not available");
    }

    try {
      const accounts = await this.ethereum.request({
        method: "eth_requestAccounts",
      });

      const signature = await this.ethereum.request({
        method: "personal_sign",
        params: [message, accounts[0]],
      });

      return signature;
    } catch (error) {
      throw new Error(`Failed to sign message: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public async switchNetwork(chainId: string): Promise<void> {
    try {
      await this.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId }],
      });
    } catch (error) {
      // If network doesn't exist, add it
      if ((error as any).code === 4902) {
        await this.addNetwork();
      } else {
        throw error;
      }
    }
  }

  private async addNetwork(): Promise<void> {
    await this.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [{
        chainId: "0x89", // Polygon mainnet
        chainName: "Polygon Mainnet",
        nativeCurrency: {
          name: "MATIC",
          symbol: "MATIC",
          decimals: 18,
        },
        rpcUrls: ["https://polygon-rpc.com/"],
        blockExplorerUrls: ["https://polygonscan.com/"],
      }],
    });
  }

  private formatEtherBalance(balance: string): string {
    const wei = parseInt(balance, 16);
    const ether = wei / Math.pow(10, 18);
    return ether.toFixed(4);
  }

  private async createOrGetHederaAccount(ethereumAddress: string): Promise<{
    accountId: string;
    privateKey: PrivateKey;
  }> {
    // Check if Hedera account already exists in localStorage
    const cachedAccount = localStorage.getItem(`hedera_account_${ethereumAddress}`);
    
    if (cachedAccount) {
      const { accountId, privateKeyString } = JSON.parse(cachedAccount);
      return {
        accountId,
        privateKey: PrivateKey.fromString(privateKeyString),
      };
    }

    // Create new Hedera account
    const privateKey = PrivateKey.generate();
    const client = Client.forTestnet(); // Use testnet for development
    
    try {
      const accountCreateTransaction = new AccountCreateTransaction()
        .setKey(privateKey.publicKey)
        .setInitialBalance(Hbar.fromTinybars(1000)); // Initial balance

      const response = await accountCreateTransaction.execute(client);
      const receipt = await response.getReceipt(client);
      const accountId = receipt.accountId;

      // Cache the account info
      localStorage.setItem(
        `hedera_account_${ethereumAddress}`,
        JSON.stringify({
          accountId: accountId?.toString() || '',
          privateKeyString: privateKey.toString(),
        })
      );

      return {
        accountId: accountId?.toString() || '',
        privateKey,
      };
    } catch (error) {
      throw new Error(`Failed to create Hedera account: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async getHederaBalance(accountId: string): Promise<string> {
    try {
      const client = Client.forTestnet();
      const balance = await new AccountBalanceQuery()
        .setAccountId(AccountId.fromString(accountId))
        .execute(client);
      return balance.hbars.toString();
    } catch (error) {
      console.error("Failed to get Hedera balance:", error);
      return "0";
    }
  }
}

// Hedera Integration
export class HederaService {
  private static instance: HederaService;
  private client: Client;

  private constructor() {
    this.client = Client.forTestnet(); // Use testnet for development
  }

  public static getInstance(): HederaService {
    if (!HederaService.instance) {
      HederaService.instance = new HederaService();
    }
    return HederaService.instance;
  }

  public async connectHedera(
    accountId: string,
    privateKey: string,
    network: "testnet" | "mainnet" = "testnet"
  ): Promise<HederaConnection> {
    try {
      const client = network === "testnet" 
        ? Client.forTestnet() 
        : Client.forMainnet();

      const hederaAccountId = AccountId.fromString(accountId);
      const hederaPrivateKey = PrivateKey.fromString(privateKey);

      client.setOperator(hederaAccountId, hederaPrivateKey);

      return {
        client,
        accountId: hederaAccountId,
        privateKey: hederaPrivateKey,
        network,
      };
    } catch (error) {
      throw new Error(`Failed to connect to Hedera: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public async getAccountBalance(accountId: string): Promise<string> {
    try {
      const balance = await new AccountBalanceQuery()
        .setAccountId(AccountId.fromString(accountId))
        .execute(this.client);
      return balance.hbars.toString();
    } catch (error) {
      throw new Error(`Failed to get account balance: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public async transferHBAR(
    connection: HederaConnection,
    to: string,
    amount: string
  ): Promise<string> {
    try {
      const { TransferTransaction, Hbar } = await import("@hashgraph/sdk");
      
      const transaction = new TransferTransaction()
        .addHbarTransfer(connection.accountId, Hbar.fromTinybars(-parseInt(amount)))
        .addHbarTransfer(AccountId.fromString(to), Hbar.fromTinybars(parseInt(amount)));

      const response = await transaction.execute(connection.client);
      const receipt = await response.getReceipt(connection.client);
      
      return response.transactionId.toString();
    } catch (error) {
      throw new Error(`Failed to transfer HBAR: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Cross-Chain Bridge Service
export class BridgeService {
  private static instance: BridgeService;

  private constructor() {}

  public static getInstance(): BridgeService {
    if (!BridgeService.instance) {
      BridgeService.instance = new BridgeService();
    }
    return BridgeService.instance;
  }

  public async bridgeNFTToHedera(
    ethereumTokenId: string,
    ethereumContract: string,
    hederaAccountId: string
  ): Promise<BridgeTransaction> {
    try {
      // This would integrate with a real bridge service
      // For now, we'll simulate the bridge process
      
      const ethereumTxHash = await this.lockNFTOnEthereum(ethereumTokenId, ethereumContract);
      const hederaTxHash = await this.mintNFTOnHedera(ethereumTokenId, hederaAccountId);

      const bridgeTransaction: BridgeTransaction = {
        ethereumTxHash,
        hederaTxHash,
        status: "COMPLETED",
        amount: "1", // 1 NFT
        from: ethereumContract,
        to: hederaAccountId,
        timestamp: new Date(),
      };

      // Store bridge transaction
      this.storeBridgeTransaction(bridgeTransaction);

      return bridgeTransaction;
    } catch (error) {
      throw new Error(`Bridge failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public async bridgeNFTToEthereum(
    hederaTokenId: string,
    hederaContract: string,
    ethereumAddress: string
  ): Promise<BridgeTransaction> {
    try {
      // This would integrate with a real bridge service
      // For now, we'll simulate the bridge process
      
      const hederaTxHash = await this.burnNFTOnHedera(hederaTokenId, hederaContract);
      const ethereumTxHash = await this.unlockNFTOnEthereum(hederaTokenId, ethereumAddress);

      const bridgeTransaction: BridgeTransaction = {
        ethereumTxHash,
        hederaTxHash,
        status: "COMPLETED",
        amount: "1", // 1 NFT
        from: hederaContract,
        to: ethereumAddress,
        timestamp: new Date(),
      };

      // Store bridge transaction
      this.storeBridgeTransaction(bridgeTransaction);

      return bridgeTransaction;
    } catch (error) {
      throw new Error(`Bridge failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public async getBridgeStatus(transactionHash: string): Promise<BridgeTransaction> {
    const transactions = this.getStoredBridgeTransactions();
    const transaction = transactions.find(tx => 
      tx.ethereumTxHash === transactionHash || tx.hederaTxHash === transactionHash
    );

    if (!transaction) {
      throw new Error("Bridge transaction not found");
    }

    return transaction;
  }

  private async lockNFTOnEthereum(tokenId: string, contract: string): Promise<string> {
    // Simulate Ethereum transaction
    return `0x${Math.random().toString(16).substr(2, 64)}`;
  }

  private async mintNFTOnHedera(tokenId: string, accountId: string): Promise<string> {
    // Simulate Hedera transaction
    return `0.0.${Math.floor(Math.random() * 1000000)}`;
  }

  private async burnNFTOnHedera(tokenId: string, contract: string): Promise<string> {
    // Simulate Hedera transaction
    return `0.0.${Math.floor(Math.random() * 1000000)}`;
  }

  private async unlockNFTOnEthereum(tokenId: string, address: string): Promise<string> {
    // Simulate Ethereum transaction
    return `0x${Math.random().toString(16).substr(2, 64)}`;
  }

  private storeBridgeTransaction(transaction: BridgeTransaction): void {
    const transactions = this.getStoredBridgeTransactions();
    transactions.push(transaction);
    localStorage.setItem("bridge_transactions", JSON.stringify(transactions));
  }

  private getStoredBridgeTransactions(): BridgeTransaction[] {
    const stored = localStorage.getItem("bridge_transactions");
    return stored ? JSON.parse(stored) : [];
  }
}

// Wallet Manager - Main service that orchestrates all wallet operations
export class WalletManager {
  private static instance: WalletManager;
  private metaMaskService: MetaMaskService;
  private hederaService: HederaService;
  private bridgeService: BridgeService;
  private currentAccount: WalletAccount | null = null;

  private constructor() {
    this.metaMaskService = MetaMaskService.getInstance();
    this.hederaService = HederaService.getInstance();
    this.bridgeService = BridgeService.getInstance();
  }

  public static getInstance(): WalletManager {
    if (!WalletManager.instance) {
      WalletManager.instance = new WalletManager();
    }
    return WalletManager.instance;
  }

  public async connectWallet(): Promise<WalletAccount> {
    try {
      const account = await this.metaMaskService.connectWallet();
      this.currentAccount = account;
      return account;
    } catch (error) {
      throw new Error(`Failed to connect wallet: ${error instanceof Error ? error instanceof Error ? error.message : 'Unknown error' : 'Unknown error'}`);
    }
  }

  public async disconnectWallet(): Promise<void> {
    this.currentAccount = null;
  }

  public getCurrentAccount(): WalletAccount | null {
    return this.currentAccount;
  }

  public async signMessage(message: string): Promise<string> {
    if (!this.currentAccount) {
      throw new Error("Wallet not connected");
    }

    return await this.metaMaskService.signMessage(message);
  }

  public async transferHBAR(to: string, amount: string): Promise<string> {
    if (!this.currentAccount) {
      throw new Error("Wallet not connected");
    }

    const connection = await this.hederaService.connectHedera(
      this.currentAccount.hederaAccountId,
      this.currentAccount.hederaAccountKey
    );

    return await this.hederaService.transferHBAR(connection, to, amount);
  }

  public async getBalance(): Promise<{ ethereum: string; hbar: string }> {
    if (!this.currentAccount) {
      throw new Error("Wallet not connected");
    }

    const hbarBalance = await this.hederaService.getAccountBalance(
      this.currentAccount.hederaAccountId
    );

    return {
      ethereum: this.currentAccount.balance.ethereum,
      hbar: hbarBalance,
    };
  }

  public async bridgeNFTToHedera(
    ethereumTokenId: string,
    ethereumContract: string
  ): Promise<BridgeTransaction> {
    if (!this.currentAccount) {
      throw new Error("Wallet not connected");
    }

    return await this.bridgeService.bridgeNFTToHedera(
      ethereumTokenId,
      ethereumContract,
      this.currentAccount.hederaAccountId
    );
  }

  public async bridgeNFTToEthereum(
    hederaTokenId: string,
    hederaContract: string
  ): Promise<BridgeTransaction> {
    if (!this.currentAccount) {
      throw new Error("Wallet not connected");
    }

    return await this.bridgeService.bridgeNFTToEthereum(
      hederaTokenId,
      hederaContract,
      this.currentAccount.ethereumAddress
    );
  }

  public async getBridgeStatus(transactionHash: string): Promise<BridgeTransaction> {
    return await this.bridgeService.getBridgeStatus(transactionHash);
  }

  // Event listeners for wallet changes
  public onAccountsChanged(callback: (accounts: string[]) => void): void {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      (window as any).ethereum.on("accountsChanged", callback);
    }
  }

  public onChainChanged(callback: (chainId: string) => void): void {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      (window as any).ethereum.on("chainChanged", callback);
    }
  }

  public removeAllListeners(): void {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      (window as any).ethereum.removeAllListeners();
    }
  }
}

// Export singleton instances
export const walletManager = WalletManager.getInstance();
export const metaMaskService = MetaMaskService.getInstance();
export const hederaService = HederaService.getInstance();
export const bridgeService = BridgeService.getInstance();
