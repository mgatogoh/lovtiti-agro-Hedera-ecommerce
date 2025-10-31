'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Wallet,
    ArrowRight,
    CheckCircle,
    AlertCircle,
    Loader2,
    Copy,
    ExternalLink
} from 'lucide-react';

interface CartItem {
    id: string;
    productId: string;
    listingId: string;
    sellerId: string;
    name: string;
    price: number;
    currency: string;
    quantity: number;
    unit: string;
}

interface HederaPaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    items: CartItem[];
    totalAmount: number;
    onPaymentSuccess: (transactionId: string) => void;
}

export default function HederaPaymentModal({
    isOpen,
    onClose,
    items,
    totalAmount,
    onPaymentSuccess
}: HederaPaymentModalProps) {
    const { toast } = useToast();
    const [step, setStep] = useState<'connect' | 'confirm' | 'processing' | 'success'>('connect');
    const [walletAddress, setWalletAddress] = useState('');
    const [isConnecting, setIsConnecting] = useState(false);
    const [transactionId, setTransactionId] = useState('');
    const [farmerWallets, setFarmerWallets] = useState<{ [sellerId: string]: string }>({});

    // Fetch farmer wallet addresses
    useEffect(() => {
        if (isOpen && items.length > 0) {
            fetchFarmerWallets();
        }
    }, [isOpen, items]);

    const fetchFarmerWallets = async () => {
        try {
            const sellerIds = [...new Set(items.map(item => item.sellerId))];
            const walletPromises = sellerIds.map(async (sellerId) => {
                const response = await fetch(`/api/users/${sellerId}/wallet`);
                if (response.ok) {
                    const data = await response.json();
                    return { sellerId, wallet: data.hederaWallet };
                }
                return { sellerId, wallet: null };
            });

            const walletResults = await Promise.all(walletPromises);
            const walletMap: { [sellerId: string]: string } = {};

            walletResults.forEach(({ sellerId, wallet }) => {
                if (wallet && wallet !== 'Not provided') {
                    walletMap[sellerId] = wallet;
                }
            });

            setFarmerWallets(walletMap);
        } catch (error) {
            console.error('Error fetching farmer wallets:', error);
            toast({
                title: "Error",
                description: "Failed to fetch farmer wallet information",
                variant: "destructive"
            });
        }
    };

    const connectWallet = async () => {
        setIsConnecting(true);
        try {
            let walletAddress = '';

            // Try HashPack first (Hedera native wallet)
            if (window.hashconnect) {
                try {
                    const hashconnect = window.hashconnect;
                    const saveData = {
                        topic: '',
                        pairingString: '',
                        privateKey: '',
                        pairedWalletData: null,
                        pairedAccounts: []
                    };

                    await hashconnect.init(saveData);
                    const state = await hashconnect.connect();

                    if (state.pairedAccounts && state.pairedAccounts.length > 0) {
                        walletAddress = state.pairedAccounts[0];
                        toast({
                            title: "HashPack Connected",
                            description: `Connected: ${walletAddress}`,
                        });
                    }
                } catch (hashpackError) {
                    console.log('HashPack not available, trying MetaMask...');
                }
            }

            // Fallback to MetaMask if HashPack not available
            if (!walletAddress && window.ethereum) {
                const accounts = await window.ethereum.request({
                    method: 'eth_requestAccounts'
                });

                if (accounts && accounts.length > 0) {
                    walletAddress = accounts[0];
                    toast({
                        title: "MetaMask Connected",
                        description: `Connected: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
                    });
                }
            }

            // If no wallet available
            if (!walletAddress) {
                throw new Error('No compatible wallet found. Please install HashPack or MetaMask.');
            }

            setWalletAddress(walletAddress);
            setStep('confirm');

        } catch (error: any) {
            console.error('Wallet connection error:', error);
            toast({
                title: "Connection Failed",
                description: error.message || "Failed to connect wallet",
                variant: "destructive"
            });
        } finally {
            setIsConnecting(false);
        }
    };

    const processPayment = async () => {
        setStep('processing');

        try {
            // Group items by seller
            const itemsBySeller = items.reduce((acc, item) => {
                if (!acc[item.sellerId]) {
                    acc[item.sellerId] = [];
                }
                acc[item.sellerId].push(item);
                return acc;
            }, {} as { [sellerId: string]: CartItem[] });

            const paymentPromises = Object.entries(itemsBySeller).map(async ([sellerId, sellerItems]) => {
                const farmerWallet = farmerWallets[sellerId];
                if (!farmerWallet) {
                    throw new Error(`Farmer wallet not found for seller ${sellerId}`);
                }

                const sellerTotal = sellerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

                // Create payment transaction
                const response = await fetch('/api/payments/hedera', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        fromWallet: walletAddress,
                        toWallet: farmerWallet,
                        amount: sellerTotal / 100, // Convert cents to HBAR
                        items: sellerItems,
                        sellerId
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Payment failed');
                }

                return await response.json();
            });

            const results = await Promise.all(paymentPromises);
            const mainTransactionId = results[0]?.transactionId || 'payment_success';

            setTransactionId(mainTransactionId);
            setStep('success');

            toast({
                title: "Payment Successful!",
                description: "Your order has been processed successfully",
            });

            // Call success callback after a short delay
            setTimeout(() => {
                onPaymentSuccess(mainTransactionId);
            }, 2000);

        } catch (error: any) {
            console.error('Payment error:', error);
            toast({
                title: "Payment Failed",
                description: error.message || "Payment processing failed. Please try again.",
                variant: "destructive"
            });
            setStep('confirm');
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({
            title: "Copied!",
            description: "Transaction ID copied to clipboard",
        });
    };

    const handleClose = () => {
        if (step !== 'processing') {
            setStep('connect');
            setWalletAddress('');
            setTransactionId('');
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Wallet className="h-5 w-5" />
                        Hedera Payment
                    </DialogTitle>
                    <DialogDescription>
                        Pay with HBAR directly to farmers' wallets
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Connect Wallet Step */}
                    {step === 'connect' && (
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-center space-y-4">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                        <Wallet className="h-8 w-8 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold">Connect Your Wallet</h3>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Connect HashPack or MetaMask to pay with HBAR
                                        </p>
                                    </div>
                                    <Button
                                        onClick={connectWallet}
                                        disabled={isConnecting}
                                        className="w-full bg-orange-500 hover:bg-orange-600"
                                    >
                                        {isConnecting ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Connecting...
                                            </>
                                        ) : (
                                            <>
                                                <Wallet className="w-4 h-4 mr-2" />
                                                Connect Wallet
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Confirm Payment Step */}
                    {step === 'confirm' && (
                        <div className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Payment Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="text-sm text-gray-600">Your Wallet</span>
                                        <span className="text-sm font-mono">
                                            {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                                        </span>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Payment Breakdown</Label>
                                        {Object.entries(
                                            items.reduce((acc, item) => {
                                                if (!acc[item.sellerId]) {
                                                    acc[item.sellerId] = { items: [], total: 0 };
                                                }
                                                acc[item.sellerId].items.push(item);
                                                acc[item.sellerId].total += item.price * item.quantity;
                                                return acc;
                                            }, {} as { [sellerId: string]: { items: CartItem[], total: number } })
                                        ).map(([sellerId, data]) => (
                                            <div key={sellerId} className="p-3 border rounded-lg">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-sm font-medium">Farmer Payment</span>
                                                    <span className="text-sm font-bold text-green-600">
                                                        ℏ{(data.total / 100).toFixed(2)}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-gray-600">
                                                    To: {farmerWallets[sellerId] ?
                                                        `${farmerWallets[sellerId].slice(0, 8)}...${farmerWallets[sellerId].slice(-6)}` :
                                                        'Wallet not found'
                                                    }
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {data.items.map(item => `${item.name} (${item.quantity}x)`).join(', ')}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t pt-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-semibold">Total Amount</span>
                                            <span className="text-xl font-bold text-green-600">
                                                ℏ{(totalAmount / 100).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Button
                                onClick={processPayment}
                                className="w-full bg-green-600 hover:bg-green-700"
                            >
                                Confirm Payment
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    )}

                    {/* Processing Step */}
                    {step === 'processing' && (
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-center space-y-4">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                                        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold">Processing Payment</h3>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Please wait while we process your HBAR payment...
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Success Step */}
                    {step === 'success' && (
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-center space-y-4">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                        <CheckCircle className="h-8 w-8 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-green-600">Payment Successful!</h3>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Your payment has been sent to the farmers
                                        </p>
                                    </div>

                                    {transactionId && (
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <Label className="text-xs text-gray-600">Transaction ID</Label>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs font-mono text-gray-800 flex-1">
                                                    {transactionId}
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => copyToClipboard(transactionId)}
                                                >
                                                    <Copy className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}