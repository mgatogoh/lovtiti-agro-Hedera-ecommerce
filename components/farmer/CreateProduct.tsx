'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Upload, X, Calendar, Package, DollarSign } from 'lucide-react';

const PRODUCT_CATEGORIES = [
    'Vegetables',
    'Fruits',
    'Grains',
    'Legumes',
    'Tubers',
    'Spices',
    'Herbs',
    'Livestock',
    'Dairy',
    'Poultry',
    'Fish',
    'Other'
];

const PRODUCT_UNITS = [
    'kg',
    'g',
    'lbs',
    'tons',
    'pieces',
    'bunches',
    'bags',
    'boxes',
    'crates',
    'liters',
    'gallons',
    'dozens'
];

interface CreateProductProps {
    onProductCreated?: () => void;
}

// Helper function to convert image to base64
const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

export default function CreateProduct({ onProductCreated }: CreateProductProps) {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [images, setImages] = useState<File[]>([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        productDescription: '',
        price: '',
        quantity: '',
        unit: 'kg',
        category: '',
        location: '',
        harvestDate: '',
        expiryDate: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (images.length + files.length > 5) {
            toast({
                title: "Too many images",
                description: "You can upload a maximum of 5 images",
                variant: "destructive"
            });
            return;
        }
        setImages(prev => [...prev, ...files]);
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const validateForm = () => {
        const errors: string[] = [];

        if (!formData.title.trim()) errors.push('Product title is required');
        if (!formData.description.trim()) errors.push('Description is required');
        if (!formData.price || parseFloat(formData.price) <= 0) errors.push('Valid price is required');
        if (!formData.quantity || parseFloat(formData.quantity) <= 0) errors.push('Valid quantity is required');
        if (!formData.category) errors.push('Category is required');
        if (!formData.location.trim()) errors.push('Location is required');

        return errors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const errors = validateForm();
        if (errors.length > 0) {
            toast({
                title: "Validation Error",
                description: errors.join(', '),
                variant: "destructive"
            });
            return;
        }

        setIsLoading(true);

        try {
            // Convert price from HBAR to cents (assuming 1 HBAR = 100 cents for calculation)
            const priceCents = Math.round(parseFloat(formData.price) * 100);

            // Convert images to base64 for upload
            const imageData: string[] = [];
            if (images.length > 0) {
                toast({
                    title: "Processing Images",
                    description: `Converting ${images.length} images for upload...`,
                });

                for (const image of images) {
                    try {
                        const base64 = await convertImageToBase64(image);
                        imageData.push(base64);
                    } catch (error) {
                        console.error('Error converting image:', error);
                    }
                }
            }

            // Prepare form data for submission
            const submitData = {
                title: formData.title,
                description: formData.description,
                productDescription: formData.productDescription,
                priceCents,
                quantity: parseFloat(formData.quantity),
                unit: formData.unit,
                category: formData.category,
                location: formData.location,
                harvestDate: formData.harvestDate || null,
                expiryDate: formData.expiryDate || null,
                images: imageData,
                video: null,
            };

            console.log('🚀 Creating product listing:', submitData);

            const response = await fetch('/api/listings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submitData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to create listing');
            }

            toast({
                title: "Product Listed Successfully!",
                description: `${formData.title} has been added to the marketplace`,
            });

            // Reset form
            setFormData({
                title: '',
                description: '',
                productDescription: '',
                price: '',
                quantity: '',
                unit: 'kg',
                category: '',
                location: '',
                harvestDate: '',
                expiryDate: '',
            });
            setImages([]);

            // Notify parent component
            if (onProductCreated) {
                onProductCreated();
            }

        } catch (error: any) {
            console.error('Error creating product:', error);
            toast({
                title: "Failed to Create Listing",
                description: error.message || "Please try again later",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <Plus className="h-5 w-5" />
                    <span>Create New Product Listing</span>
                </CardTitle>
                <CardDescription>
                    Add your agricultural products to the marketplace
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Product Title *</Label>
                            <Input
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="e.g., Fresh Organic Tomatoes"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Category *</Label>
                            <Select value={formData.category} onValueChange={(value: string) => handleSelectChange('category', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {PRODUCT_CATEGORIES.map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Short Description *</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Brief description of your product"
                            rows={3}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="productDescription">Detailed Description</Label>
                        <Textarea
                            id="productDescription"
                            name="productDescription"
                            value={formData.productDescription}
                            onChange={handleInputChange}
                            placeholder="Detailed information about growing conditions, quality, etc."
                            rows={4}
                        />
                    </div>

                    {/* Price and Quantity */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price" className="flex items-center space-x-1">
                                <DollarSign className="h-4 w-4" />
                                <span>Price per Unit (ℏ) *</span>
                            </Label>
                            <Input
                                id="price"
                                name="price"
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.price}
                                onChange={handleInputChange}
                                placeholder="0.00"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="quantity" className="flex items-center space-x-1">
                                <Package className="h-4 w-4" />
                                <span>Quantity Available *</span>
                            </Label>
                            <Input
                                id="quantity"
                                name="quantity"
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.quantity}
                                onChange={handleInputChange}
                                placeholder="0"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="unit">Unit *</Label>
                            <Select value={formData.unit} onValueChange={(value: string) => handleSelectChange('unit', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select unit" />
                                </SelectTrigger>
                                <SelectContent>
                                    {PRODUCT_UNITS.map((unit) => (
                                        <SelectItem key={unit} value={unit}>
                                            {unit}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                        <Label htmlFor="location">Farm Location *</Label>
                        <Input
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            placeholder="e.g., Lagos State, Nigeria"
                            required
                        />
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="harvestDate" className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>Harvest Date</span>
                            </Label>
                            <Input
                                id="harvestDate"
                                name="harvestDate"
                                type="date"
                                value={formData.harvestDate}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="expiryDate" className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>Expiry Date</span>
                            </Label>
                            <Input
                                id="expiryDate"
                                name="expiryDate"
                                type="date"
                                value={formData.expiryDate}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-2">
                        <Label className="flex items-center space-x-1">
                            <Upload className="h-4 w-4" />
                            <span>Product Images (Max 5)</span>
                        </Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                                className="hidden"
                                id="image-upload"
                            />
                            <label
                                htmlFor="image-upload"
                                className="cursor-pointer flex flex-col items-center space-y-2"
                            >
                                <Upload className="h-8 w-8 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                    Click to upload images or drag and drop
                                </span>
                            </label>
                        </div>

                        {/* Image Preview */}
                        {images.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-4">
                                {images.map((image, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={URL.createObjectURL(image)}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-20 object-cover rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4">
                        <Button type="button" variant="outline" onClick={() => {
                            setFormData({
                                title: '',
                                description: '',
                                productDescription: '',
                                price: '',
                                quantity: '',
                                unit: 'kg',
                                category: '',
                                location: '',
                                harvestDate: '',
                                expiryDate: '',
                            });
                            setImages([]);
                        }}>
                            Reset
                        </Button>
                        <Button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700">
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Creating Listing...
                                </>
                            ) : (
                                <>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create Listing
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}