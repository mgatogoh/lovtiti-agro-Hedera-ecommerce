'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Leaf,
  Upload,
  Image as ImageIcon,
  Video,
  Calendar,
  MapPin,
  Package,
  DollarSign,
  Save,
  ArrowLeft,
  Shield,
  AlertCircle
} from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { getBusinessRulesForUser } from '@/utils/businessLogic';
import { useWallet } from '@/hooks/useWallet';

export default function CreateListingPage() {
  const { user, isLoaded } = useUser();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    productDescription: '',
    priceCents: '',
    quantity: '',
    unit: 'kg',
    category: '',
    location: '',
    harvestDate: '',
    expiryDate: '',
    images: [] as string[],
    video: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  // Wallet integration
  const {
    isConnected,
    wallet,
    addProduct,
    isAddingProduct,
    isFarmer,
    error: walletError
  } = useWallet();

  // Check if user can create listings (Farmers and Agro Experts only)
  const userRole = user?.publicMetadata?.role as string || 'BUYER';
  const canCreateListings = ['FARMER', 'AGROEXPERT', 'ADMIN'].includes(userRole);

  const categories = [
    'Vegetables', 'Fruits', 'Grains', 'Spices', 'Nuts', 'Herbs',
    'Dairy', 'Meat', 'Poultry', 'Seafood', 'Beverages', 'Other'
  ];

  const units = ['kg', 'lb', 'ton', 'piece', 'dozen', 'bunch', 'bag'];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Product title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.priceCents || parseFloat(formData.priceCents) <= 0) {
      newErrors.priceCents = 'Valid price is required';
    }
    if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
      newErrors.quantity = 'Valid quantity is required';
    }
    if (!formData.category) newErrors.category = 'Category is required';
    if (formData.images.length === 0) newErrors.images = 'At least one image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    // For now, we'll simulate image upload with placeholder URLs
    // In production, you'd upload to IPFS or CDN
    const newImages = Array.from(files).map((file, index) =>
      `https://via.placeholder.com/400x300?text=${encodeURIComponent(file.name)}`
    );

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      // Create product in database
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          priceCents: Math.round(parseFloat(formData.priceCents) * 100),
          quantity: parseFloat(formData.quantity),
          harvestDate: formData.harvestDate ? new Date(formData.harvestDate).toISOString() : null,
          expiryDate: formData.expiryDate ? new Date(formData.expiryDate).toISOString() : null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create listing');
      }

      const listingResult = await response.json();
      console.log('✅ Listing created:', listingResult);

      // Optional: Add product to smart contract if wallet is connected
      if (isConnected && isFarmer) {
        try {
          const priceInEth = parseFloat(formData.priceCents) / 100;
          const quantity = parseInt(formData.quantity);

          const contractResult = await addProduct(
            priceInEth.toString(),
            quantity,
            user?.id || 'unknown'
          );

          if (contractResult.success) {
            console.log('✅ Product added to smart contract');

            // Update listing with contract information
            await fetch(`/api/listings/${listingResult.id}/contract`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                contractProductId: contractResult.transactionHash,
                contractTxHash: contractResult.transactionHash,
                contractPrice: priceInEth,
                contractStock: quantity
              }),
            });
          }
        } catch (contractError) {
          console.warn('⚠️ Smart contract integration skipped:', contractError);
          // Continue anyway - listing is created in database
        }
      }

      // Success - redirect to dashboard
      alert('✅ Listing created successfully!');
      router.push('/dashboard/farmer');
    } catch (error) {
      console.error('❌ Error creating listing:', error);
      setErrors({ submit: error instanceof Error ? error.message : 'An error occurred' });
      alert('❌ Error: ' + (error instanceof Error ? error.message : 'An error occurred'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show access denied if user cannot create listings
  if (isLoaded && !canCreateListings) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-xl text-gray-900">Access Denied</CardTitle>
              <CardDescription className="text-gray-600">
                Only Farmers and Agro Experts can create product listings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800">Insufficient Permissions</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Your current role ({userRole}) doesn't have permission to create listings.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-900">Who can create listings:</h4>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">• Farmers - List agricultural products</p>
                  <p className="text-sm text-gray-600">• Agro Experts - List equipment and products</p>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button onClick={() => router.push('/')} className="flex-1">
                  Go to Homepage
                </Button>
                <Button variant="outline" onClick={() => router.push('/auth/signup')} className="flex-1">
                  Sign Up as Farmer/Agro Expert
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
          <div className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold text-green-800">Create Product Listing</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Basic Information</span>
              </CardTitle>
              <CardDescription>
                Tell buyers about your product
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label htmlFor="title">Product Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Fresh Organic Tomatoes"
                    className={errors.title ? 'border-red-500' : ''}
                  />
                  {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="description">Short Description *</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description for search results"
                    className={errors.description ? 'border-red-500' : ''}
                  />
                  {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="productDescription">Detailed Product Description</Label>
                  <textarea
                    id="productDescription"
                    value={formData.productDescription}
                    onChange={(e) => setFormData({ ...formData, productDescription: e.target.value })}
                    placeholder="Detailed information about your product..."
                    className="w-full min-h-[120px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {errors.category && <p className="text-sm text-red-500 mt-1">{errors.category}</p>}
                </div>

                <div>
                  <Label htmlFor="location">Farm Location</Label>
                  <div className="relative">
                    <MapPin className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="City, State, Country"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Quantity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>Pricing & Quantity</span>
              </CardTitle>
              <CardDescription>
                Set your price and available quantity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="priceCents">Price per Unit (ℏ) *</Label>
                  <Input
                    id="priceCents"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.priceCents}
                    onChange={(e) => setFormData({ ...formData, priceCents: e.target.value })}
                    placeholder="0.00"
                    className={errors.priceCents ? 'border-red-500' : ''}
                  />
                  {errors.priceCents && <p className="text-sm text-red-500 mt-1">{errors.priceCents}</p>}
                </div>

                <div>
                  <Label htmlFor="quantity">Available Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    placeholder="0"
                    className={errors.quantity ? 'border-red-500' : ''}
                  />
                  {errors.quantity && <p className="text-sm text-red-500 mt-1">{errors.quantity}</p>}
                </div>

                <div>
                  <Label htmlFor="unit">Unit</Label>
                  <select
                    id="unit"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {units.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Media Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ImageIcon className="h-5 w-5" />
                <span>Product Images & Video</span>
              </CardTitle>
              <CardDescription>
                Upload photos and videos of your product
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Image Upload */}
              <div>
                <Label>Product Images *</Label>
                <div className="mt-2">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <Label
                    htmlFor="image-upload"
                    className="cursor-pointer inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Upload Images</span>
                  </Label>
                  {errors.images && <p className="text-sm text-red-500 mt-1">{errors.images}</p>}
                </div>

                {/* Image Preview */}
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          className="w-full h-24 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Video Upload */}
              <div>
                <Label htmlFor="video">Product Video (Optional)</Label>
                <div className="mt-2">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setFormData({ ...formData, video: URL.createObjectURL(e.target.files[0]) });
                      }
                    }}
                    className="hidden"
                    id="video-upload"
                  />
                  <Label
                    htmlFor="video-upload"
                    className="cursor-pointer inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    <Video className="h-4 w-4" />
                    <span>Upload Video</span>
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Harvest & Expiry Dates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Harvest & Expiry Information</span>
              </CardTitle>
              <CardDescription>
                Provide harvest and expiry dates for transparency
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="harvestDate">Harvest Date</Label>
                  <Input
                    id="harvestDate"
                    type="date"
                    value={formData.harvestDate}
                    onChange={(e) => setFormData({ ...formData, harvestDate: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Error Display */}
          {errors.submit && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-red-800">Error Creating Listing</h4>
                    <p className="text-sm text-red-700 mt-1">{errors.submit}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Wallet Status */}
          {!isConnected && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800">Wallet Not Connected</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Smart contract features will be skipped. Your listing will still be created in the database.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{isSubmitting ? 'Creating Listing...' : 'Create Listing'}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}