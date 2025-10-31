'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
    Search,
    Filter,
    Edit,
    Eye,
    Trash2,
    Package,
    DollarSign,
    Calendar,
    MapPin,
    MoreHorizontal
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Listing {
    id: string;
    title: string;
    description: string;
    priceCents: number;
    quantity: number;
    unit: string;
    category: string;
    location: string;
    harvestDate: string | null;
    expiryDate: string | null;
    images: string[];
    isActive: boolean;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
}

interface FarmerListingsProps {
    refreshTrigger?: number;
}

export default function FarmerListings({ refreshTrigger }: FarmerListingsProps) {
    const { toast } = useToast();
    const [listings, setListings] = useState<Listing[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

    const fetchListings = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/listings/farmer');

            if (!response.ok) {
                throw new Error('Failed to fetch listings');
            }

            const data = await response.json();
            setListings(data.listings || []);
        } catch (error: any) {
            console.error('Error fetching listings:', error);
            toast({
                title: "Failed to Load Listings",
                description: error.message || "Please try again later",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchListings();
    }, [refreshTrigger]);

    const handleToggleStatus = async (listingId: string, currentStatus: boolean) => {
        try {
            const response = await fetch(`/api/listings/${listingId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    isActive: !currentStatus
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update listing status');
            }

            // Update local state
            setListings(prev => prev.map(listing =>
                listing.id === listingId
                    ? { ...listing, isActive: !currentStatus }
                    : listing
            ));

            toast({
                title: "Status Updated",
                description: `Listing ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
            });
        } catch (error: any) {
            console.error('Error updating listing status:', error);
            toast({
                title: "Failed to Update Status",
                description: error.message || "Please try again later",
                variant: "destructive"
            });
        }
    };

    const handleDeleteListing = async (listingId: string) => {
        if (!confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
            return;
        }

        try {
            const response = await fetch(`/api/listings/${listingId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete listing');
            }

            // Remove from local state
            setListings(prev => prev.filter(listing => listing.id !== listingId));

            toast({
                title: "Listing Deleted",
                description: "The listing has been permanently removed",
            });
        } catch (error: any) {
            console.error('Error deleting listing:', error);
            toast({
                title: "Failed to Delete Listing",
                description: error.message || "Please try again later",
                variant: "destructive"
            });
        }
    };

    const filteredListings = listings.filter(listing => {
        const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            listing.category.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = filterStatus === 'all' ||
            (filterStatus === 'active' && listing.isActive) ||
            (filterStatus === 'inactive' && !listing.isActive);

        return matchesSearch && matchesFilter;
    });

    const formatPrice = (priceCents: number) => {
        return `ℏ${(priceCents / 100).toFixed(2)}`;
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Not set';
        return new Date(dateString).toLocaleDateString();
    };

    if (isLoading) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>My Listings</CardTitle>
                        <CardDescription>Manage your product listings</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="relative">
                            <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                            <Input
                                placeholder="Search listings..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 w-64"
                            />
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <Filter className="h-4 w-4 mr-2" />
                                    Filter
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => setFilterStatus('all')}>
                                    All Listings
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setFilterStatus('active')}>
                                    Active Only
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setFilterStatus('inactive')}>
                                    Inactive Only
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {filteredListings.length === 0 ? (
                    <div className="text-center py-8">
                        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No listings found</h3>
                        <p className="text-gray-600">
                            {listings.length === 0
                                ? "You haven't created any listings yet. Create your first listing to get started!"
                                : "No listings match your current search or filter criteria."
                            }
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredListings.map((listing) => (
                            <div key={listing.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <h4 className="font-medium text-lg">{listing.title}</h4>
                                            <Badge variant={listing.isActive ? "default" : "secondary"}>
                                                {listing.isActive ? 'Active' : 'Inactive'}
                                            </Badge>
                                            {listing.isVerified && (
                                                <Badge variant="outline" className="text-green-600 border-green-600">
                                                    Verified
                                                </Badge>
                                            )}
                                        </div>

                                        <p className="text-gray-600 mb-3 line-clamp-2">{listing.description}</p>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                            <div className="flex items-center space-x-1">
                                                <DollarSign className="h-4 w-4 text-green-600" />
                                                <span className="font-medium">{formatPrice(listing.priceCents)}</span>
                                                <span className="text-gray-500">per {listing.unit}</span>
                                            </div>

                                            <div className="flex items-center space-x-1">
                                                <Package className="h-4 w-4 text-blue-600" />
                                                <span>{listing.quantity} {listing.unit} available</span>
                                            </div>

                                            <div className="flex items-center space-x-1">
                                                <MapPin className="h-4 w-4 text-gray-600" />
                                                <span className="text-gray-600">{listing.location}</span>
                                            </div>

                                            <div className="flex items-center space-x-1">
                                                <Calendar className="h-4 w-4 text-gray-600" />
                                                <span className="text-gray-600">Created {formatDate(listing.createdAt)}</span>
                                            </div>
                                        </div>

                                        {(listing.harvestDate || listing.expiryDate) && (
                                            <div className="mt-2 flex space-x-4 text-sm text-gray-600">
                                                {listing.harvestDate && (
                                                    <span>Harvested: {formatDate(listing.harvestDate)}</span>
                                                )}
                                                {listing.expiryDate && (
                                                    <span>Expires: {formatDate(listing.expiryDate)}</span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="ml-4">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Edit Listing
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleToggleStatus(listing.id, listing.isActive)}
                                                >
                                                    {listing.isActive ? 'Deactivate' : 'Activate'}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleDeleteListing(listing.id)}
                                                    className="text-red-600"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>

                                {listing.images && listing.images.length > 0 && (
                                    <div className="mt-3 flex space-x-2">
                                        {listing.images.slice(0, 3).map((image, index) => (
                                            <img
                                                key={index}
                                                src={image}
                                                alt={`${listing.title} ${index + 1}`}
                                                className="w-16 h-16 object-cover rounded-lg"
                                            />
                                        ))}
                                        {listing.images.length > 3 && (
                                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-sm text-gray-600">
                                                +{listing.images.length - 3}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}