// NFT Marketplace Homepage
'use client';

import React, { useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { useNFTListings } from '@/hooks/useNFT';
import { NFTCreator } from '@/components/nft/NFTCreator';
import { NFTDetail } from '@/components/nft/NFTDetail';
import { NFTTrading, AuctionBidding } from '@/components/nft/NFTTrading';
import { ServiceBooking } from '@/components/nft/ServiceBooking';
import { EquipmentLeasing } from '@/components/nft/EquipmentLeasing';
import { NFTListing } from '@/types/nft';

export default function NFTMarketplacePage() {
  const { wallet, connectWallet, isConnected } = useWallet();
  const [showCreator, setShowCreator] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNFT, setSelectedNFT] = useState<string | null>(null);
  const [showTrading, setShowTrading] = useState(false);
  const [showServiceBooking, setShowServiceBooking] = useState(false);
  const [showEquipmentLeasing, setShowEquipmentLeasing] = useState(false);
  const [currentListing, setCurrentListing] = useState<NFTListing | null>(null);

  const { listings, isLoading, error, refetch } = useNFTListings({
    category: selectedCategory || undefined,
    search: searchQuery || undefined,
    limit: 20,
  });

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'PRODUCT', label: 'Agricultural Products' },
    { value: 'SERVICE', label: 'Services' },
    { value: 'EQUIPMENT', label: 'Equipment' },
  ];

  const handleCreateNFT = () => {
    if (!isConnected) {
      connectWallet();
      return;
    }
    setShowCreator(true);
  };

  const handleNFTClick = (listing: NFTListing) => {
    setCurrentListing(listing);
    setSelectedNFT(listing.tokenId);
  };

  const handleBuyClick = (listing: NFTListing) => {
    setCurrentListing(listing);
    if (listing.isAuction) {
      setShowTrading(true);
    } else {
      setShowTrading(true);
    }
  };

  const handleServiceClick = (listing: NFTListing) => {
    setCurrentListing(listing);
    setShowServiceBooking(true);
  };

  const handleEquipmentClick = (listing: NFTListing) => {
    setCurrentListing(listing);
    setShowEquipmentLeasing(true);
  };

  const handleTradingSuccess = () => {
    setShowTrading(false);
    setCurrentListing(null);
    refetch();
  };

  const handleBookingSuccess = () => {
    setShowServiceBooking(false);
    setCurrentListing(null);
  };

  const handleLeasingSuccess = () => {
    setShowEquipmentLeasing(false);
    setCurrentListing(null);
  };

  const handleMintSuccess = (tokenId: string) => {
    console.log('NFT minted successfully:', tokenId);
    setShowCreator(false);
    refetch(); // Refresh listings
  };

  const formatPrice = (price: number, currency: string) => {
    return `${price} ${currency}`;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'PRODUCT':
        return '🌾';
      case 'SERVICE':
        return '🚛';
      case 'EQUIPMENT':
        return '🚜';
      default:
        return '📦';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'PRODUCT':
        return 'bg-green-100 text-green-800';
      case 'SERVICE':
        return 'bg-blue-100 text-blue-800';
      case 'EQUIPMENT':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🌾 NFT Marketplace
              </h1>
              <p className="text-gray-600 mt-2">
                Trade agricultural products, services, and equipment as NFTs
              </p>
            </div>
            <div className="flex space-x-4">
              {!isConnected ? (
                <button
                  onClick={connectWallet}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Connect Wallet
                </button>
              ) : (
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    Connected: {wallet?.address}
                  </p>
                </div>
              )}
              <button
                onClick={handleCreateNFT}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Create NFT
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search NFTs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="md:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={refetch}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">🌾</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total NFTs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {listings?.length || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Volume</p>
                <p className="text-2xl font-bold text-gray-900">
                  {listings?.reduce((sum, listing) => sum + listing.price, 0).toFixed(2) || 0} HBAR
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Active Sellers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(listings?.map(listing => listing.seller) || []).size}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">⭐</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">4.8</p>
              </div>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading NFTs...</p>
          </div>
        )}

        {/* NFT Grid */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings?.map((listing: NFTListing) => (
              <div
                key={listing.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                {/* NFT Image */}
                <div className="aspect-square bg-gray-200 rounded-t-lg flex items-center justify-center">
                  <span className="text-6xl text-gray-400">
                    {getCategoryIcon(listing.category)}
                  </span>
                </div>

                {/* NFT Info */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(listing.category)}`}>
                      {listing.category}
                    </span>
                    <span className="text-sm text-gray-500">
                      {listing.views} views
                    </span>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                    {listing.description || 'Untitled NFT'}
                  </h3>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {listing.description || 'No description'}
                  </p>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-bold text-gray-900">
                        {formatPrice(listing.price, listing.currency)}
                      </p>
                      {listing.isAuction && (
                        <p className="text-xs text-blue-600">Auction</p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleNFTClick(listing)}
                        className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                      >
                        View
                      </button>
                      {listing.category === 'SERVICE' ? (
                        <button 
                          onClick={() => handleServiceClick(listing)}
                          className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          Book
                        </button>
                      ) : listing.category === 'EQUIPMENT' ? (
                        <button 
                          onClick={() => handleEquipmentClick(listing)}
                          className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          Lease
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleBuyClick(listing)}
                          className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          {listing.isAuction ? 'Bid' : 'Buy'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && (!listings || listings.length === 0) && (
          <div className="text-center py-12">
            <span className="text-6xl text-gray-300 mb-4 block">🌾</span>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No NFTs Found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || selectedCategory
                ? 'Try adjusting your search criteria'
                : 'Be the first to create an NFT in our marketplace!'}
            </p>
            <button
              onClick={handleCreateNFT}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Create Your First NFT
            </button>
          </div>
        )}
      </div>

      {/* NFT Creator Modal */}
      {showCreator && (
        <NFTCreator
          onMintSuccess={handleMintSuccess}
          onClose={() => setShowCreator(false)}
        />
      )}

      {/* NFT Detail Modal */}
      {selectedNFT && (
        <NFTDetail
          tokenId={selectedNFT}
          listing={currentListing || undefined}
          onClose={() => {
            setSelectedNFT(null);
            setCurrentListing(null);
          }}
        />
      )}

      {/* Trading Modal */}
      {showTrading && currentListing && (
        <NFTTrading
          listing={currentListing}
          onSuccess={handleTradingSuccess}
          onClose={() => {
            setShowTrading(false);
            setCurrentListing(null);
          }}
        />
      )}

      {/* Service Booking Modal - Disabled for now */}
      {false && (
        <ServiceBooking
          serviceNFT={{} as any}
          onBookingSuccess={handleBookingSuccess}
          onClose={() => {
            setShowServiceBooking(false);
            setCurrentListing(null);
          }}
        />
      )}

      {/* Equipment Leasing Modal - Disabled for now */}
      {false && (
        <EquipmentLeasing
          equipmentNFT={{} as any}
          onLeaseSuccess={handleLeasingSuccess}
          onClose={() => {
            setShowEquipmentLeasing(false);
            setCurrentListing(null);
          }}
        />
      )}
    </div>
  );
}
