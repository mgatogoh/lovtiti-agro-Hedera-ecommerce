'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  Search,
  Filter,
  MapPin,
  Star,
  Leaf,
  Package,
  Calendar,
  DollarSign,
  SlidersHorizontal
} from 'lucide-react';
import ProductActions from '@/components/ProductActions';
import SafeImage from '@/components/ui/safe-image';

// Default fallback image for products without images
const DEFAULT_PRODUCT_IMAGE = 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&crop=center';

interface Listing {
  id: string;
  title: string;
  description: string;
  productDescription?: string;
  priceCents: number;
  currency: string;
  quantity: number;
  unit: string;
  category: string;
  location?: string;
  images: string[];
  video?: string;
  harvestDate?: string;
  expiryDate?: string;
  isActive: boolean;
  isVerified: boolean;
  seller: {
    id: string;
    email: string;
    profiles?: Array<{
      fullName: string;
      country: string;
    }>;
  };
  createdAt: string;
  updatedAt: string;
}

export default function BrowseListingsPage() {
  const { toast } = useToast();
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });

  const categories = [
    'All', 'Vegetables', 'Fruits', 'Grains', 'Legumes', 'Tubers', 'Spices',
    'Herbs', 'Livestock', 'Dairy', 'Poultry', 'Fish', 'Other'
  ];

  // Fetch listings from API
  const fetchListings = async () => {
    try {
      setIsLoading(true);

      // Build query parameters
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        sortBy: sortBy
      });

      if (searchQuery) params.append('search', searchQuery);
      if (selectedCategory && selectedCategory !== 'All') params.append('category', selectedCategory);
      if (priceRange.min) params.append('minPrice', priceRange.min);
      if (priceRange.max) params.append('maxPrice', priceRange.max);

      const response = await fetch(`/api/listings?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch listings');
      }

      const data = await response.json();

      setListings(data.listings || []);
      setPagination(data.pagination || pagination);

      console.log(`✅ Fetched ${data.listings?.length || 0} listings`);

    } catch (error: any) {
      console.error('Error fetching listings:', error);
      toast({
        title: "Failed to Load Products",
        description: error.message || "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch listings on component mount and when filters change
  useEffect(() => {
    fetchListings();
  }, [pagination.page, sortBy]);

  // Debounced search and filter effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (pagination.page === 1) {
        fetchListings();
      } else {
        setPagination(prev => ({ ...prev, page: 1 }));
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedCategory, priceRange.min, priceRange.max]);

  // Set filtered listings to the fetched listings (filtering is done server-side)
  useEffect(() => {
    setFilteredListings(listings);
  }, [listings]);

  const formatPrice = (priceCents: number) => {
    return `ℏ${(priceCents / 100).toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold text-gray-900">Marketplace</span>
            </div>
            <div className="text-sm text-gray-600">
              {pagination.total} products found
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder="Search products, farmers, or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters</span>
            </Button>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <Card className="mt-4">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Category Filter */}
                  <div>
                    <Label className="text-sm font-medium">Category</Label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <Label className="text-sm font-medium">Price Range (ℏ)</Label>
                    <div className="mt-1 flex space-x-2">
                      <Input
                        placeholder="Min"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                        type="number"
                      />
                      <Input
                        placeholder="Max"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                        type="number"
                      />
                    </div>
                  </div>

                  {/* Clear Filters */}
                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedCategory('');
                        setPriceRange({ min: '', max: '' });
                        setSearchQuery('');
                      }}
                      className="w-full"
                    >
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-t-lg"></div>
                <CardContent className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredListings.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing) => (
                <Card key={listing.id} className="hover:shadow-lg transition-shadow">
                  <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden relative">
                    <SafeImage
                      src={listing.images?.[0] || DEFAULT_PRODUCT_IMAGE}
                      alt={listing.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {listing.isVerified && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Verified
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Title and Category */}
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
                          {listing.title}
                        </h3>
                        <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                          {listing.category}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {listing.description}
                      </p>

                      {/* Price and Quantity */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xl font-bold text-green-600">
                            {formatPrice(listing.priceCents)}
                          </p>
                          <p className="text-sm text-gray-500">
                            per {listing.unit}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {listing.quantity} {listing.unit}
                          </p>
                          <p className="text-xs text-gray-500">available</p>
                        </div>
                      </div>

                      {/* Seller and Location */}
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <span>By: {listing.seller.profiles?.[0]?.fullName || listing.seller.email}</span>
                        </div>
                        {listing.location && (
                          <div className="flex items-center space-x-1 text-sm text-gray-600">
                            <MapPin className="h-3 w-3" />
                            <span>{listing.location}</span>
                          </div>
                        )}
                        {listing.harvestDate && (
                          <div className="flex items-center space-x-1 text-sm text-gray-600">
                            <Calendar className="h-3 w-3" />
                            <span>Harvested: {formatDate(listing.harvestDate)}</span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <ProductActions
                        productId={listing.id}
                        listingId={listing.id}
                        sellerId={listing.seller.id}
                        sellerType="FARMER"
                        name={listing.title}
                        description={listing.description}
                        price={listing.priceCents / 100}
                        currency={listing.currency || "HBAR"}
                        unit={listing.unit}
                        images={listing.images}
                        category={listing.category}
                        location={listing.location || ''}
                        harvestDate={listing.harvestDate ? new Date(listing.harvestDate) : undefined}
                        certifications={listing.isVerified ? ['Verified', 'Fresh'] : ['Fresh']}
                        className="pt-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                  disabled={pagination.page <= 1 || isLoading}
                >
                  Previous
                </Button>

                <div className="flex items-center space-x-1">
                  {[...Array(Math.min(5, pagination.pages))].map((_, i) => {
                    const pageNum = Math.max(1, pagination.page - 2) + i;
                    if (pageNum > pagination.pages) return null;

                    return (
                      <Button
                        key={pageNum}
                        variant={pageNum === pagination.page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                        disabled={isLoading}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.pages, prev.page + 1) }))}
                  disabled={pagination.page >= pagination.pages || isLoading}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}