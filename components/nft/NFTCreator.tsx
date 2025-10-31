// NFT Creator Component for minting agricultural NFTs
import React, { useState } from 'react';
import { useNFTMinting } from '../../hooks/useNFT';
import { ProductAttributes, ServiceAttributes, EquipmentAttributes } from '../../types/nft';

interface NFTCreatorProps {
  onMintSuccess?: (tokenId: string) => void;
  onClose?: () => void;
}

export function NFTCreator({ onMintSuccess, onClose }: NFTCreatorProps) {
  const [activeTab, setActiveTab] = useState<'product' | 'service' | 'equipment'>('product');
  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { mintProductNFT, mintServiceNFT, mintEquipmentNFT, isLoading } = useNFTMinting();

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      let result;

      if (activeTab === 'product') {
        const attributes: ProductAttributes = {
          type: 'PRODUCT',
          productType: formData.productType || 'CROP',
          variety: formData.variety || '',
          quantity: parseInt(formData.quantity) || 0,
          unit: formData.unit || 'kg',
          harvestDate: formData.harvestDate || '',
          expiryDate: formData.expiryDate || '',
          qualityGrade: formData.qualityGrade || 'A',
          certifications: formData.certifications?.split(',').map((c: string) => c.trim()) || [],
          location: {
            latitude: parseFloat(formData.latitude) || 0,
            longitude: parseFloat(formData.longitude) || 0,
            address: formData.address || '',
            farmId: formData.farmId || '',
            region: formData.region || '',
            country: formData.country || '',
          },
          supplyChain: [],
          sustainability: {
            waterUsage: formData.waterUsage || 'LOW',
            carbonFootprint: formData.carbonFootprint || 'MINIMAL',
            pesticideFree: formData.pesticideFree || false,
            organicCertified: formData.organicCertified || false,
            fairTrade: formData.fairTrade || false,
            energySource: formData.energySource || 'RENEWABLE',
            wasteReduction: parseInt(formData.wasteReduction) || 0,
          },
          pricing: {
            basePrice: parseFloat(formData.basePrice) || 0,
            currency: formData.currency || 'HBAR',
            unit: formData.pricingUnit || 'per_kg',
          },
        };

        result = await mintProductNFT(
          formData.name || '',
          formData.description || '',
          attributes,
          {
            percentage: parseFloat(formData.royaltyPercentage) || 2.5,
            recipient: formData.royaltyRecipient || '',
            perpetual: true
          },
          formData.imageUrl
        );
      } else if (activeTab === 'service') {
        const attributes: ServiceAttributes = {
          type: 'SERVICE',
          serviceType: formData.serviceType || 'TRANSPORT',
          provider: {
            name: formData.providerName || '',
            license: formData.providerLicense || '',
            rating: parseFloat(formData.providerRating) || 5,
            experience: parseInt(formData.providerExperience) || 0,
            specializations: formData.specializations?.split(',').map((s: string) => s.trim()) || [],
            certifications: formData.providerCertifications?.split(',').map((c: string) => c.trim()) || [],
          },
          capacity: formData.capacity ? {
            maxVolume: parseFloat(formData.maxVolume) || undefined,
            maxWeight: parseFloat(formData.maxWeight) || undefined,
            maxDistance: parseFloat(formData.maxDistance) || undefined,
            unit: formData.capacityUnit || 'kg',
          } : undefined,
          pricing: {
            basePrice: parseFloat(formData.basePrice) || 0,
            currency: formData.currency || 'HBAR',
            unit: formData.pricingUnit || 'per_hour',
          },
          availability: {
            schedule: [],
            location: formData.location || '',
            advanceBookingDays: parseInt(formData.advanceBookingDays) || 7,
            minimumBookingHours: parseInt(formData.minimumBookingHours) || 1,
          },
          terms: {
            cancellationPolicy: formData.cancellationPolicy || '',
            paymentTerms: formData.paymentTerms || '',
            liabilityCoverage: formData.liabilityCoverage || '',
            insuranceRequired: formData.insuranceRequired || false,
            specialRequirements: formData.specialRequirements?.split(',').map((r: string) => r.trim()) || [],
          },
          coverage: formData.coverage ? [{
            region: formData.coverageRegion || '',
            cities: formData.coverageCities?.split(',').map((c: string) => c.trim()) || [],
          }] : [],
          specializations: formData.specializations?.split(',').map((s: string) => s.trim()) || [],
        };

        result = await mintServiceNFT(
          formData.name || '',
          formData.description || '',
          attributes,
          {
            percentage: parseFloat(formData.royaltyPercentage) || 2.5,
            recipient: formData.royaltyRecipient || '',
            perpetual: true
          },
          formData.imageUrl
        );
      } else if (activeTab === 'equipment') {
        const attributes: EquipmentAttributes = {
          type: 'EQUIPMENT',
          equipmentType: formData.equipmentType || 'TRACTOR',
          specifications: {
            model: formData.model || '',
            year: parseInt(formData.year) || new Date().getFullYear(),
            brand: formData.brand || '',
            capacity: formData.capacity || '',
            features: formData.features?.split(',').map((f: string) => f.trim()) || [],
            fuelType: formData.fuelType || '',
            powerSource: formData.powerSource || '',
            dimensions: formData.dimensions ? {
              length: parseFloat(formData.dimensionsLength) || 0,
              width: parseFloat(formData.dimensionsWidth) || 0,
              height: parseFloat(formData.dimensionsHeight) || 0,
              unit: formData.dimensionsUnit || 'm',
            } : undefined,
          },
          ownership: {
            owner: formData.owner || '',
            title: formData.title || '',
            purchaseDate: formData.purchaseDate || '',
            purchasePrice: parseFloat(formData.purchasePrice) || 0,
            depreciationRate: parseFloat(formData.depreciationRate) || 0,
          },
          leaseTerms: {
            dailyRate: parseFloat(formData.dailyRate) || 0,
            weeklyRate: parseFloat(formData.weeklyRate) || 0,
            monthlyRate: parseFloat(formData.monthlyRate) || 0,
            minimumPeriod: parseInt(formData.minimumPeriod) || 1,
            deposit: parseFloat(formData.deposit) || 0,
            insurance: formData.insurance || false,
            maintenance: formData.maintenance || false,
            delivery: formData.delivery || false,
            training: formData.training || false,
          },
          maintenance: [],
          insurance: {
            provider: formData.insuranceProvider || '',
            policyNumber: formData.policyNumber || '',
            coverage: formData.insuranceCoverage?.split(',').map((c: string) => c.trim()) || [],
            expiryDate: formData.insuranceExpiryDate || '',
            premium: parseFloat(formData.insurancePremium) || 0,
          },
          condition: formData.condition || 'GOOD',
        };

        result = await mintEquipmentNFT(
          formData.name || '',
          formData.description || '',
          attributes,
          {
            percentage: parseFloat(formData.royaltyPercentage) || 2.5,
            recipient: formData.royaltyRecipient || '',
            perpetual: true
          },
          formData.imageUrl
        );
      }

      if (result && onMintSuccess) {
        onMintSuccess(result.nft.tokenId);
      }

      // Reset form
      setFormData({});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mint NFT');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Create NFT</h2>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('product')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'product'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Product NFT
          </button>
          <button
            onClick={() => setActiveTab('service')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'service'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Service NFT
          </button>
          <button
            onClick={() => setActiveTab('equipment')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'equipment'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Equipment NFT
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Common Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="url"
                value={formData.imageUrl || ''}
                onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              required
            />
          </div>

          {/* Product-specific fields */}
          {activeTab === 'product' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Product Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Type
                  </label>
                  <select
                    value={formData.productType || 'CROP'}
                    onChange={(e) => handleInputChange('productType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="CROP">Crop</option>
                    <option value="LIVESTOCK">Livestock</option>
                    <option value="FISHERY">Fishery</option>
                    <option value="HONEY">Honey</option>
                    <option value="PROCESSED">Processed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Variety
                  </label>
                  <input
                    type="text"
                    value={formData.variety || ''}
                    onChange={(e) => handleInputChange('variety', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={formData.quantity || ''}
                    onChange={(e) => handleInputChange('quantity', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit
                  </label>
                  <input
                    type="text"
                    value={formData.unit || 'kg'}
                    onChange={(e) => handleInputChange('unit', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quality Grade
                  </label>
                  <select
                    value={formData.qualityGrade || 'A'}
                    onChange={(e) => handleInputChange('qualityGrade', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="A">Grade A</option>
                    <option value="B">Grade B</option>
                    <option value="C">Grade C</option>
                    <option value="PREMIUM">Premium</option>
                    <option value="ORGANIC">Organic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Harvest Date
                  </label>
                  <input
                    type="date"
                    value={formData.harvestDate || ''}
                    onChange={(e) => handleInputChange('harvestDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Service-specific fields */}
          {activeTab === 'service' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Service Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service Type
                  </label>
                  <select
                    value={formData.serviceType || 'TRANSPORT'}
                    onChange={(e) => handleInputChange('serviceType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="TRANSPORT">Transport</option>
                    <option value="CONSULTATION">Consultation</option>
                    <option value="VETERINARY">Veterinary</option>
                    <option value="STORAGE">Storage</option>
                    <option value="PROCESSING">Processing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Provider Name
                  </label>
                  <input
                    type="text"
                    value={formData.providerName || ''}
                    onChange={(e) => handleInputChange('providerName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Equipment-specific fields */}
          {activeTab === 'equipment' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Equipment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Equipment Type
                  </label>
                  <select
                    value={formData.equipmentType || 'TRACTOR'}
                    onChange={(e) => handleInputChange('equipmentType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="TRACTOR">Tractor</option>
                    <option value="HARVESTER">Harvester</option>
                    <option value="IRRIGATION">Irrigation</option>
                    <option value="ANALYTICAL">Analytical</option>
                    <option value="STOCKPILING">Stockpiling</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Model
                  </label>
                  <input
                    type="text"
                    value={formData.model || ''}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Royalty Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Royalty Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Royalty Percentage
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={formData.royaltyPercentage || '2.5'}
                  onChange={(e) => handleInputChange('royaltyPercentage', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Royalty Recipient (Hedera Account ID)
                </label>
                <input
                  type="text"
                  value={formData.royaltyRecipient || ''}
                  onChange={(e) => handleInputChange('royaltyRecipient', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.0.123456"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading || isSubmitting}
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {isLoading || isSubmitting ? 'Minting...' : 'Mint NFT'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
