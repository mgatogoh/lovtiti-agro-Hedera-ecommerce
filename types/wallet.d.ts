// Wallet type declarations for MetaMask and HashPack

declare global {
    interface Window {
        ethereum?: {
            request: (args: { method: string; params?: any[] }) => Promise<any>;
            on: (event: string, callback: (data: any) => void) => void;
            removeAllListeners: (event: string) => void;
            isMetaMask?: boolean;
        };

        hashconnect?: {
            init: (saveData: any) => Promise<void>;
            connect: () => Promise<{
                pairedAccounts: string[];
                pairedWalletData: any;
            }>;
            disconnect: () => Promise<void>;
            sendTransaction: (transaction: any) => Promise<any>;
        };
    }
}

export interface WalletConnection {
    address: string;
    type: 'metamask' | 'hashpack';
    isConnected: boolean;
}

export interface PaymentTransaction {
    from: string;
    to: string;
    amount: string;
    currency: 'HBAR' | 'ETH';
    transactionId?: string;
}

export interface WalletError {
    code: number;
    message: string;
    data?: any;
}