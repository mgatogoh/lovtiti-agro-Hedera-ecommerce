'use client';

import React, { useState } from 'react';
import { useWallet } from '@/hooks/useWallet';

export default function AgroContractTestPage() {
  const {
    wallet,
    isConnected,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    isFarmer,
    farmerInfo,
    farmerProducts,
    createFarmerAccount,
    checkFarmerStatus,
    getFarmerInfo,
    getFarmerProducts,
    buyProduct,
    addProduct,
    updateStock,
    increasePrice,
    withdrawBalance,
    isCreatingFarmer,
    isBuyingProduct,
    isAddingProduct,
    isUpdatingStock,
    isIncreasingPrice,
    isWithdrawing
  } = useWallet();

  const [userId] = useState('test-user-123');
  const [productForm, setProductForm] = useState({
    price: '1.0',
    amount: '100'
  });
  const [purchaseForm, setPurchaseForm] = useState({
    productId: '1',
    amount: '10',
    value: '10.0'
  });
  const [updateForm, setUpdateForm] = useState({
    productId: '1',
    stock: '50'
  });
  const [priceForm, setPriceForm] = useState({
    productId: '1',
    price: '1.5'
  });

  const handleCreateFarmer = async () => {
    const result = await createFarmerAccount(userId);
    if (result.success) {
      alert(`Farmer created successfully! Transaction: ${result.transactionHash}`);
    } else {
      alert(`Failed to create farmer: ${result.error}`);
    }
  };

  const handleAddProduct = async () => {
    const result = await addProduct(productForm.price, parseInt(productForm.amount), userId);
    if (result.success) {
      alert(`Product added successfully! Transaction: ${result.transactionHash}`);
      setProductForm({ price: '1.0', amount: '100' });
    } else {
      alert(`Failed to add product: ${result.error}`);
    }
  };

  const handleBuyProduct = async () => {
    const result = await buyProduct(
      purchaseForm.productId,
      parseInt(purchaseForm.amount),
      purchaseForm.value,
      userId
    );
    if (result.success) {
      alert(`Product purchased successfully! Transaction: ${result.transactionId}`);
      setPurchaseForm({ productId: '1', amount: '10', value: '10.0' });
    } else {
      alert(`Failed to buy product: ${result.error}`);
    }
  };

  const handleUpdateStock = async () => {
    const result = await updateStock(updateForm.productId, parseInt(updateForm.stock), userId);
    if (result.success) {
      alert(`Stock updated successfully! Transaction: ${result.transactionHash}`);
      setUpdateForm({ productId: '1', stock: '50' });
    } else {
      alert(`Failed to update stock: ${result.error}`);
    }
  };

  const handleIncreasePrice = async () => {
    const result = await increasePrice(priceForm.productId, priceForm.price, userId);
    if (result.success) {
      alert(`Price increased successfully! Transaction: ${result.transactionHash}`);
      setPriceForm({ productId: '1', price: '1.5' });
    } else {
      alert(`Failed to increase price: ${result.error}`);
    }
  };

  const handleWithdrawBalance = async () => {
    const result = await withdrawBalance(userId);
    if (result.success) {
      alert(`Balance withdrawn successfully! Transaction: ${result.transactionHash}`);
    } else {
      alert(`Failed to withdraw balance: ${result.error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Agro Contract Test Page</h1>

        {/* Wallet Connection Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Wallet Connection</h2>
          
          {!isConnected ? (
            <button
              onClick={connectWallet}
              disabled={isConnecting}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
            </button>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Connected Address:</p>
                  <p className="font-mono text-sm">{wallet?.address}</p>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Disconnect
                </button>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={checkFarmerStatus}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  Check Farmer Status
                </button>
                <button
                  onClick={getFarmerInfo}
                  className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
                >
                  Get Farmer Info
                </button>
                <button
                  onClick={getFarmerProducts}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Get Products
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
        </div>

        {/* Farmer Status */}
        {isConnected && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Farmer Status</h2>
            <div className="space-y-2">
              <p><strong>Is Farmer:</strong> {isFarmer === null ? 'Checking...' : isFarmer ? 'Yes' : 'No'}</p>
              {farmerInfo && (
                <div>
                  <p><strong>Balance:</strong> {farmerInfo.balance?.toString() || '0'} ETH</p>
                  <p><strong>Products Count:</strong> {farmerInfo.products?.length || 0}</p>
                </div>
              )}
              {farmerProducts && (
                <div>
                  <p><strong>Products:</strong></p>
                  <ul className="list-disc list-inside ml-4">
                    {farmerProducts.map((product, index) => (
                      <li key={index}>
                        ID: {product.id.toString()}, Price: {product.price.toString()}, Stock: {product.stock.toString()}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Farmer Actions */}
        {isConnected && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Farmer Actions</h2>
            
            <div className="space-y-4">
              <button
                onClick={handleCreateFarmer}
                disabled={isCreatingFarmer || isFarmer === true}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {isCreatingFarmer ? 'Creating...' : 'Create Farmer Account'}
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Add Product</h3>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Price (ETH)"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <input
                      type="number"
                      placeholder="Amount"
                      value={productForm.amount}
                      onChange={(e) => setProductForm({ ...productForm, amount: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <button
                      onClick={handleAddProduct}
                      disabled={isAddingProduct}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {isAddingProduct ? 'Adding...' : 'Add Product'}
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Update Stock</h3>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Product ID"
                      value={updateForm.productId}
                      onChange={(e) => setUpdateForm({ ...updateForm, productId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <input
                      type="number"
                      placeholder="New Stock"
                      value={updateForm.stock}
                      onChange={(e) => setUpdateForm({ ...updateForm, stock: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <button
                      onClick={handleUpdateStock}
                      disabled={isUpdatingStock}
                      className="w-full bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 disabled:opacity-50"
                    >
                      {isUpdatingStock ? 'Updating...' : 'Update Stock'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Increase Price</h3>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Product ID"
                      value={priceForm.productId}
                      onChange={(e) => setPriceForm({ ...priceForm, productId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <input
                      type="text"
                      placeholder="New Price (ETH)"
                      value={priceForm.price}
                      onChange={(e) => setPriceForm({ ...priceForm, price: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <button
                      onClick={handleIncreasePrice}
                      disabled={isIncreasingPrice}
                      className="w-full bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 disabled:opacity-50"
                    >
                      {isIncreasingPrice ? 'Updating...' : 'Increase Price'}
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Withdraw Balance</h3>
                  <button
                    onClick={handleWithdrawBalance}
                    disabled={isWithdrawing}
                    className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50"
                  >
                    {isWithdrawing ? 'Withdrawing...' : 'Withdraw Balance'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Purchase Actions */}
        {isConnected && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Purchase Actions</h2>
            
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Product ID"
                value={purchaseForm.productId}
                onChange={(e) => setPurchaseForm({ ...purchaseForm, productId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="Amount to buy"
                value={purchaseForm.amount}
                onChange={(e) => setPurchaseForm({ ...purchaseForm, amount: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                placeholder="Value (ETH)"
                value={purchaseForm.value}
                onChange={(e) => setPurchaseForm({ ...purchaseForm, value: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <button
                onClick={handleBuyProduct}
                disabled={isBuyingProduct}
                className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50"
              >
                {isBuyingProduct ? 'Buying...' : 'Buy Product'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
