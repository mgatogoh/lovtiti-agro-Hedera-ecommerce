// Advanced NFT Trading Interface
import React, { useState } from 'react';
import { useNFTMarketplace } from '@/hooks/useNFT';
import { useWallet } from '@/hooks/useWallet';
import { NFTListing, BuyNFTRequest } from '@/types/nft';

interface NFTTradingProps {
  listing: NFTListing;
  onSuccess?: () => void;
  onClose?: () => void;
}

export function NFTTrading({ listing, onSuccess, onClose }: NFTTradingProps) {
  const { wallet, isConnected, connectWallet } = useWallet();
  const { buyNFT, isLoading, error } = useNFTMarketplace();
  const [step, setStep] = useState<'review' | 'payment' | 'confirm'>('review');
  const [paymentMethod, setPaymentMethod] = useState<'HBAR' | 'USD'>('HBAR');
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
  });
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [insurance, setInsurance] = useState(true);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleBuy = async () => {
    if (!wallet) {
      connectWallet();
      return;
    }

    try {
      const buyRequest: BuyNFTRequest = {
        listingId: listing.id,
        paymentMethod,
        deliveryAddress: {
          street: deliveryAddress.street,
          city: deliveryAddress.city,
          state: deliveryAddress.state,
          country: deliveryAddress.country,
          postalCode: deliveryAddress.postalCode,
        },
        deliveryInstructions,
        insurance,
      };

      const result = await buyNFT(buyRequest);
      console.log('Purchase successful:', result);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Purchase failed:', err);
    }
  };

  const calculateTotal = () => {
    let total = listing.price;
    if (insurance) {
      total += listing.price * 0.05; // 5% insurance fee
    }
    return total;
  };

  const renderReviewStep = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">NFT:</span>
            <span className="font-medium">{listing.description || 'Untitled NFT'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Price:</span>
            <span className="font-medium">{listing.price} {listing.currency}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Category:</span>
            <span className="font-medium">{listing.category}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Seller:</span>
            <span className="font-medium">{listing.seller}</span>
          </div>
          {insurance && (
            <div className="flex justify-between">
              <span className="text-gray-600">Insurance (5%):</span>
              <span className="font-medium">{(listing.price * 0.05).toFixed(2)} {listing.currency}</span>
            </div>
          )}
          <hr />
          <div className="flex justify-between text-lg font-semibold">
            <span>Total:</span>
            <span>{calculateTotal().toFixed(2)} {listing.currency}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Payment Method</h3>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="radio"
              name="payment"
              value="HBAR"
              checked={paymentMethod === 'HBAR'}
              onChange={(e) => setPaymentMethod(e.target.value as 'HBAR' | 'USD')}
              className="mr-3"
            />
            <span>Pay with HBAR (Recommended)</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="payment"
              value="USD"
              checked={paymentMethod === 'USD'}
              onChange={(e) => setPaymentMethod(e.target.value as 'HBAR' | 'USD')}
              className="mr-3"
            />
            <span>Pay with USD (Credit Card)</span>
          </label>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Delivery Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Street Address"
            value={deliveryAddress.street}
            onChange={(e) => setDeliveryAddress({ ...deliveryAddress, street: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="City"
            value={deliveryAddress.city}
            onChange={(e) => setDeliveryAddress({ ...deliveryAddress, city: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="State/Province"
            value={deliveryAddress.state}
            onChange={(e) => setDeliveryAddress({ ...deliveryAddress, state: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Country"
            value={deliveryAddress.country}
            onChange={(e) => setDeliveryAddress({ ...deliveryAddress, country: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Postal Code"
            value={deliveryAddress.postalCode}
            onChange={(e) => setDeliveryAddress({ ...deliveryAddress, postalCode: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <textarea
          placeholder="Delivery Instructions (Optional)"
          value={deliveryInstructions}
          onChange={(e) => setDeliveryInstructions(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
      </div>

      <div className="space-y-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={insurance}
            onChange={(e) => setInsurance(e.target.checked)}
            className="mr-3"
          />
          <span>Add insurance protection (5% of item value)</span>
        </label>
      </div>
    </div>
  );

  const renderPaymentStep = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">Payment Information</h3>
        <p className="text-blue-700">
          {paymentMethod === 'HBAR' 
            ? 'You will be redirected to your Hedera wallet to complete the payment.'
            : 'You will be redirected to our secure payment processor to enter your credit card details.'
          }
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Payment Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Item Price:</span>
            <span className="font-medium">{listing.price} {listing.currency}</span>
          </div>
          {insurance && (
            <div className="flex justify-between">
              <span className="text-gray-600">Insurance:</span>
              <span className="font-medium">{(listing.price * 0.05).toFixed(2)} {listing.currency}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600">Platform Fee (2.5%):</span>
            <span className="font-medium">{(listing.price * 0.025).toFixed(2)} {listing.currency}</span>
          </div>
          <hr />
          <div className="flex justify-between text-lg font-semibold">
            <span>Total:</span>
            <span>{calculateTotal().toFixed(2)} {listing.currency}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mr-3"
          />
          <span className="text-sm">
            I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and 
            <a href="#" className="text-blue-600 hover:underline ml-1">Privacy Policy</a>
          </span>
        </label>
      </div>
    </div>
  );

  const renderConfirmStep = () => (
    <div className="text-center space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="text-green-600 text-6xl mb-4">✓</div>
        <h3 className="font-semibold text-green-900 mb-2">Purchase Successful!</h3>
        <p className="text-green-700">
          Your NFT purchase has been confirmed. The seller will be notified and your item will be shipped shortly.
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">What's Next?</h3>
        <div className="space-y-3 text-left">
          <div className="flex items-start">
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded-full mr-3 mt-0.5">1</span>
            <span className="text-gray-700">You will receive a confirmation email with your purchase details</span>
          </div>
          <div className="flex items-start">
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded-full mr-3 mt-0.5">2</span>
            <span className="text-gray-700">The seller will prepare and ship your item within 24-48 hours</span>
          </div>
          <div className="flex items-start">
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded-full mr-3 mt-0.5">3</span>
            <span className="text-gray-700">You can track your order in real-time through our platform</span>
          </div>
          <div className="flex items-start">
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded-full mr-3 mt-0.5">4</span>
            <span className="text-gray-700">Once delivered, you can confirm receipt and leave a review</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {listing.isAuction ? 'Place Bid' : 'Buy NFT'}
          </h2>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          )}
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === 'review' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              1
            </div>
            <div className={`w-16 h-1 ${step === 'payment' || step === 'confirm' ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === 'payment' ? 'bg-blue-600 text-white' : step === 'confirm' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              2
            </div>
            <div className={`w-16 h-1 ${step === 'confirm' ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === 'confirm' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              3
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Step Content */}
        {step === 'review' && renderReviewStep()}
        {step === 'payment' && renderPaymentStep()}
        {step === 'confirm' && renderConfirmStep()}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t">
          {step === 'review' && (
            <>
              <button
                onClick={onClose}
                className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setStep('payment')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                disabled={!isConnected}
              >
                {!isConnected ? 'Connect Wallet' : 'Continue to Payment'}
              </button>
            </>
          )}

          {step === 'payment' && (
            <>
              <button
                onClick={() => setStep('review')}
                className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleBuy}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                disabled={!agreedToTerms || isLoading}
              >
                {isLoading ? 'Processing...' : 'Complete Purchase'}
              </button>
            </>
          )}

          {step === 'confirm' && (
            <button
              onClick={onClose}
              className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Auction Bidding Component
interface AuctionBiddingProps {
  listing: NFTListing;
  onBidSuccess?: () => void;
  onClose?: () => void;
}

export function AuctionBidding({ listing, onBidSuccess, onClose }: AuctionBiddingProps) {
  const { wallet, isConnected, connectWallet } = useWallet();
  const [bidAmount, setBidAmount] = useState((listing.currentBid || 0) + 1);
  const [isPlacingBid, setIsPlacingBid] = useState(false);

  const handlePlaceBid = async () => {
    if (!wallet) {
      connectWallet();
      return;
    }

    setIsPlacingBid(true);
    try {
      // Place bid logic would go here
      console.log('Placing bid:', bidAmount);
      // Simulate bid placement
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (onBidSuccess) {
        onBidSuccess();
      }
    } catch (error) {
      console.error('Bid failed:', error);
    } finally {
      setIsPlacingBid(false);
    }
  };

  const getTimeRemaining = () => {
    if (!listing.auctionEndTime) return '0d 0h 0m';
    const now = new Date().getTime();
    const end = new Date(listing.auctionEndTime).getTime();
    const diff = end - now;
    
    if (diff <= 0) return 'Auction Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${days}d ${hours}h ${minutes}m`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Place Bid</h2>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Auction Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Current Bid:</span>
                <span className="font-medium">{listing.currentBid} {listing.currency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Reserve Price:</span>
                <span className="font-medium">{listing.reservePrice} {listing.currency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bids:</span>
                <span className="font-medium">{listing.bidCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time Remaining:</span>
                <span className="font-medium text-red-600">{getTimeRemaining()}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="text-gray-700 font-medium">Your Bid Amount</span>
              <div className="mt-1 relative">
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(parseFloat(e.target.value) || 0)}
                  min={(listing.currentBid || 0) + 1}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 pr-12"
                />
                <span className="absolute right-3 top-2 text-gray-500">{listing.currency}</span>
              </div>
            </label>
            <p className="text-sm text-gray-600">
              Minimum bid: {(listing.currentBid || 0) + 1} {listing.currency}
            </p>
          </div>

          <button
            onClick={handlePlaceBid}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            disabled={!isConnected || isPlacingBid || bidAmount <= (listing.currentBid || 0)}
          >
            {!isConnected ? 'Connect Wallet' : isPlacingBid ? 'Placing Bid...' : 'Place Bid'}
          </button>
        </div>
      </div>
    </div>
  );
}
