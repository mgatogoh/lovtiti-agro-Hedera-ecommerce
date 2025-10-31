// NFT Detail Component with comprehensive metadata display
import React, { useState } from 'react';
import { useNFT, useSupplyChain } from '@/hooks/useNFT';
import { useWallet } from '@/hooks/useWallet';
import { BaseNFT, NFTListing } from '@/types/nft';

interface NFTDetailProps {
  tokenId: string;
  listing?: NFTListing;
  onClose?: () => void;
}

export function NFTDetail({ tokenId, listing, onClose }: NFTDetailProps) {
  const { nft, isLoading, error } = useNFT(tokenId);
  const { supplyChain } = useSupplyChain(tokenId);
  const { wallet, isConnected } = useWallet();
  const [activeTab, setActiveTab] = useState<'details' | 'supply-chain' | 'history' | 'analytics'>('details');
  const [showBuyModal, setShowBuyModal] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !nft) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">NFT Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'This NFT does not exist'}</p>
          {onClose && (
            <button
              onClick={onClose}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Go Back
            </button>
          )}
        </div>
      </div>
    );
  }

  const attributes = nft.metadata.attributes;
  const isOwner = wallet?.address === nft.owner;
  const isCreator = wallet?.address === nft.creator;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'PRODUCT': return '🌾';
      case 'SERVICE': return '🚛';
      case 'EQUIPMENT': return '🚜';
      default: return '📦';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'PRODUCT': return 'bg-green-100 text-green-800';
      case 'SERVICE': return 'bg-blue-100 text-blue-800';
      case 'EQUIPMENT': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderProductDetails = () => {
    if (attributes.type !== 'PRODUCT') return null;
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Product Information</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium">{attributes.productType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Variety:</span>
                <span className="font-medium">{attributes.variety}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Quantity:</span>
                <span className="font-medium">{attributes.quantity} {attributes.unit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Quality Grade:</span>
                <span className="font-medium">{attributes.qualityGrade}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Harvest Date:</span>
                <span className="font-medium">{new Date(attributes.harvestDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Expiry Date:</span>
                <span className="font-medium">{new Date(attributes.expiryDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Location & Pricing</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Location:</span>
                <span className="font-medium">{attributes.location.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Country:</span>
                <span className="font-medium">{attributes.location.country}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Farm ID:</span>
                <span className="font-medium">{attributes.location.farmId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Price:</span>
                <span className="font-medium">{attributes.pricing.basePrice} {attributes.pricing.currency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Unit:</span>
                <span className="font-medium">{attributes.pricing.unit}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Certifications</h3>
          <div className="flex flex-wrap gap-2">
            {attributes.certifications.map((cert, index) => (
              <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                {cert}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Sustainability Metrics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{attributes.sustainability.waterUsage}</div>
              <div className="text-sm text-gray-600">Water Usage</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{attributes.sustainability.carbonFootprint}</div>
              <div className="text-sm text-gray-600">Carbon Footprint</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {attributes.sustainability.pesticideFree ? '✓' : '✗'}
              </div>
              <div className="text-sm text-gray-600">Pesticide Free</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {attributes.sustainability.organicCertified ? '✓' : '✗'}
              </div>
              <div className="text-sm text-gray-600">Organic Certified</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderServiceDetails = () => {
    if (attributes.type !== 'SERVICE') return null;
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Service Information</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Service Type:</span>
                <span className="font-medium">{attributes.serviceType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Provider:</span>
                <span className="font-medium">{attributes.provider.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">License:</span>
                <span className="font-medium">{attributes.provider.license}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rating:</span>
                <span className="font-medium">{attributes.provider.rating}/5 ⭐</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Experience:</span>
                <span className="font-medium">{attributes.provider.experience} years</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Pricing & Availability</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Base Price:</span>
                <span className="font-medium">{attributes.pricing.basePrice} {attributes.pricing.currency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Unit:</span>
                <span className="font-medium">{attributes.pricing.unit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Location:</span>
                <span className="font-medium">{attributes.availability.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Advance Booking:</span>
                <span className="font-medium">{attributes.availability.advanceBookingDays} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Min Booking:</span>
                <span className="font-medium">{attributes.availability.minimumBookingHours} hours</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Specializations</h3>
          <div className="flex flex-wrap gap-2">
            {attributes.specializations.map((spec, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {spec}
              </span>
            ))}
          </div>
        </div>

        {attributes.capacity && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Capacity</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {attributes.capacity.maxVolume && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{attributes.capacity.maxVolume}</div>
                  <div className="text-sm text-gray-600">Max Volume ({attributes.capacity.unit})</div>
                </div>
              )}
              {attributes.capacity.maxWeight && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{attributes.capacity.maxWeight}</div>
                  <div className="text-sm text-gray-600">Max Weight ({attributes.capacity.unit})</div>
                </div>
              )}
              {attributes.capacity.maxDistance && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{attributes.capacity.maxDistance}</div>
                  <div className="text-sm text-gray-600">Max Distance (km)</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderEquipmentDetails = () => {
    if (attributes.type !== 'EQUIPMENT') return null;
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Equipment Information</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium">{attributes.equipmentType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Model:</span>
                <span className="font-medium">{attributes.specifications.model}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Brand:</span>
                <span className="font-medium">{attributes.specifications.brand}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Year:</span>
                <span className="font-medium">{attributes.specifications.year}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Condition:</span>
                <span className="font-medium">{attributes.condition}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Lease Terms</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Daily Rate:</span>
                <span className="font-medium">{attributes.leaseTerms.dailyRate} HBAR</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Weekly Rate:</span>
                <span className="font-medium">{attributes.leaseTerms.weeklyRate} HBAR</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Rate:</span>
                <span className="font-medium">{attributes.leaseTerms.monthlyRate} HBAR</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Min Period:</span>
                <span className="font-medium">{attributes.leaseTerms.minimumPeriod} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Deposit:</span>
                <span className="font-medium">{attributes.leaseTerms.deposit} HBAR</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Features</h3>
          <div className="flex flex-wrap gap-2">
            {attributes.specifications.features.map((feature, index) => (
              <span key={index} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                {feature}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Services Included</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {attributes.leaseTerms.insurance ? '✓' : '✗'}
              </div>
              <div className="text-sm text-gray-600">Insurance</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {attributes.leaseTerms.maintenance ? '✓' : '✗'}
              </div>
              <div className="text-sm text-gray-600">Maintenance</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {attributes.leaseTerms.delivery ? '✓' : '✗'}
              </div>
              <div className="text-sm text-gray-600">Delivery</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {attributes.leaseTerms.training ? '✓' : '✗'}
              </div>
              <div className="text-sm text-gray-600">Training</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSupplyChainTab = () => {
    return (
      <div className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-4">Supply Chain History</h3>
          {supplyChain && supplyChain.length > 0 ? (
            <div className="space-y-4">
              {supplyChain.map((step, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-white rounded-lg border">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{step.action}</h4>
                      <span className="text-sm text-gray-500">
                        {new Date(step.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Location: {step.location}</p>
                    <p className="text-sm text-gray-600">Actor: {step.actor}</p>
                    {step.verified && (
                      <div className="flex items-center mt-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          ✓ Verified by {step.verifier}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No supply chain steps recorded yet.</p>
          )}
        </div>
      </div>
    );
  };

  const renderHistoryTab = () => {
    return (
      <div className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-4">Trading History</h3>
          <p className="text-gray-600">Trading history will be displayed here once transactions are recorded.</p>
        </div>
      </div>
    );
  };

  const renderAnalyticsTab = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Views</h3>
            <div className="text-3xl font-bold text-blue-600">{listing?.views || 0}</div>
            <div className="text-sm text-gray-600">Total views</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Favorites</h3>
            <div className="text-3xl font-bold text-red-600">{listing?.favorites || 0}</div>
            <div className="text-sm text-gray-600">Times favorited</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Price</h3>
            <div className="text-3xl font-bold text-green-600">
              {listing ? `${listing.price} ${listing.currency}` : 'N/A'}
            </div>
            <div className="text-sm text-gray-600">Current listing price</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              {onClose && (
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ← Back
                </button>
              )}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <span className="mr-3">{getCategoryIcon(nft.category)}</span>
                  {nft.metadata.name}
                </h1>
                <div className="flex items-center space-x-4 mt-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(nft.category)}`}>
                    {nft.category}
                  </span>
                  <span className="text-gray-600">Token ID: {nft.tokenId}</span>
                  <span className="text-gray-600">Created: {new Date(nft.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {listing && (
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {listing.price} {listing.currency}
                  </div>
                  {listing.isAuction && (
                    <div className="text-sm text-blue-600">Auction - {listing.bidCount} bids</div>
                  )}
                </div>
              )}
              {!isOwner && listing && isConnected && (
                <button
                  onClick={() => setShowBuyModal(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  {listing.isAuction ? 'Place Bid' : 'Buy Now'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* NFT Image */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                {nft.metadata.image ? (
                  <img
                    src={nft.metadata.image}
                    alt={nft.metadata.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <span className="text-8xl text-gray-400">
                    {getCategoryIcon(nft.category)}
                  </span>
                )}
              </div>
              <p className="text-gray-700">{nft.metadata.description}</p>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {['details', 'supply-chain', 'history', 'analytics'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab as any)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'details' && (
                  <>
                    {attributes.type === 'PRODUCT' && renderProductDetails()}
                    {attributes.type === 'SERVICE' && renderServiceDetails()}
                    {attributes.type === 'EQUIPMENT' && renderEquipmentDetails()}
                  </>
                )}
                {activeTab === 'supply-chain' && renderSupplyChainTab()}
                {activeTab === 'history' && renderHistoryTab()}
                {activeTab === 'analytics' && renderAnalyticsTab()}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Owner Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Owner Information</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">Current Owner:</span>
                  <p className="font-medium">{nft.owner}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Creator:</span>
                  <p className="font-medium">{nft.creator}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Royalties:</span>
                  <p className="font-medium">{nft.royalties.percentage}% to {nft.royalties.recipient}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">
                  Add to Favorites
                </button>
                <button className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">
                  Share NFT
                </button>
                {isOwner && (
                  <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                    {listing ? 'Update Listing' : 'List for Sale'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
