'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2, ExternalLink, Copy, RefreshCw } from 'lucide-react';

interface TestResult {
  success: boolean;
  message?: string;
  tests?: {
    connection: string;
    balance: string;
    transfer: string;
    transactionId: string;
    status: string;
    amount: string;
    recipient: string;
  };
  accountInfo?: {
    accountId: string;
    balance: string;
    network: string;
  };
  error?: string;
  details?: string;
}

export default function HederaTestPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [copied, setCopied] = useState(false);

  const runTest = async () => {
    setIsLoading(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/test/hedera-final');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: 'Network error',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openExplorer = (txId: string) => {
    const explorerUrl = `https://hashscan.io/testnet/transaction/${txId}`;
    window.open(explorerUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hedera Testnet Integration Test</h1>
          <p className="text-gray-600">Verify that Hedera Hashgraph integration is working properly</p>
        </div>

        {/* Test Controls */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Test Hedera Connection</CardTitle>
            <CardDescription>
              This test will verify your Hedera testnet credentials and perform a small test transaction
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">What this test does:</h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Connects to Hedera testnet using your credentials</li>
                  <li>• Retrieves your account balance</li>
                  <li>• Performs a test transfer of 1 tinybar (0.00000001 HBAR)</li>
                  <li>• Verifies the transaction was successful</li>
                </ul>
              </div>
              
              <Button 
                onClick={runTest} 
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Running Test...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Run Hedera Test
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        {result && (
          <Card className={`${result.success ? 'border-green-200' : 'border-red-200'}`}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {result.success ? (
                  <CheckCircle className="h-6 w-6 text-green-600" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-600" />
                )}
                <span>Test Results</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {result.success ? (
                <div className="space-y-6">
                  {/* Success Message */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-800 mb-2">✅ Test Successful!</h3>
                    <p className="text-green-700">{result.message}</p>
                  </div>

                  {/* Test Details */}
                  {result.tests && (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">Test Details:</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm">{result.tests.connection}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm">{result.tests.balance}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm">{result.tests.transfer}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm">
                            <span className="font-medium">Amount:</span> {result.tests.amount}
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">Recipient:</span> {result.tests.recipient}
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">Status:</span> {result.tests.status}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Transaction ID */}
                  {result.tests?.transactionId && (
                    <div className="space-y-2">
                      <h3 className="font-semibold text-gray-900">Transaction ID:</h3>
                      <div className="flex items-center space-x-2">
                        <code className="bg-gray-100 px-3 py-2 rounded text-sm font-mono flex-1">
                          {result.tests.transactionId}
                        </code>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(result.tests!.transactionId)}
                        >
                          {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openExplorer(result.tests!.transactionId)}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Account Info */}
                  {result.accountInfo && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Account Information:</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Account ID:</span>
                          <br />
                          <code className="text-xs">{result.accountInfo.accountId}</code>
                        </div>
                        <div>
                          <span className="font-medium">Balance:</span>
                          <br />
                          <span className="text-green-600 font-mono">{result.accountInfo.balance} HBAR</span>
                        </div>
                        <div>
                          <span className="font-medium">Network:</span>
                          <br />
                          <span className="text-blue-600">{result.accountInfo.network}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Error Message */}
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="font-semibold text-red-800 mb-2">❌ Test Failed</h3>
                    <p className="text-red-700">{result.error}</p>
                    {result.details && (
                      <p className="text-sm text-red-600 mt-2">{result.details}</p>
                    )}
                  </div>

                  {/* Troubleshooting */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="font-semibold text-yellow-800 mb-2">Troubleshooting:</h3>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Check that HEDERA_ACCOUNT_ID and HEDERA_PRIVATE_KEY are set in .env</li>
                      <li>• Verify your testnet account has sufficient HBAR balance</li>
                      <li>• Ensure your private key is in the correct format (0x...)</li>
                      <li>• Check your internet connection</li>
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Additional Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>About This Test</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-600">
              <p>
                This test verifies that your Hedera Hashgraph integration is working correctly by:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Connecting to the Hedera testnet using your configured credentials</li>
                <li>Retrieving your account balance to verify authentication</li>
                <li>Performing a small test transaction (1 tinybar) to verify transaction capabilities</li>
                <li>Providing a transaction ID that you can verify on the Hedera explorer</li>
              </ul>
              <p>
                The test uses a minimal amount (1 tinybar = 0.00000001 HBAR) to minimize costs while 
                thoroughly testing the integration.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
