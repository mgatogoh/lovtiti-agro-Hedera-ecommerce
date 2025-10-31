'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle, Sprout, Users, Package } from 'lucide-react';

export default function SeedDataPage() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSeed = async (clearExisting: boolean) => {
    setIsSeeding(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch('/api/seed/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clearExisting }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || 'Failed to seed database');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <Sprout className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Seed Database with Products
          </h1>
          <p className="text-gray-600">
            Populate the database with realistic agricultural products from various farming types
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Seed Options</CardTitle>
            <CardDescription>
              Choose how you want to seed the database
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Button
                onClick={() => handleSeed(false)}
                disabled={isSeeding}
                className="h-auto py-6 flex-col items-start"
                variant="outline"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <Package className="h-5 w-5" />
                  <span className="font-semibold">Add Products</span>
                </div>
                <p className="text-xs text-left text-gray-600">
                  Add new products without deleting existing ones
                </p>
              </Button>

              <Button
                onClick={() => handleSeed(true)}
                disabled={isSeeding}
                className="h-auto py-6 flex-col items-start bg-red-600 hover:bg-red-700"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <Sprout className="h-5 w-5" />
                  <span className="font-semibold">Fresh Start</span>
                </div>
                <p className="text-xs text-left">
                  Clear all listings and add fresh seed data
                </p>
              </Button>
            </div>

            {isSeeding && (
              <div className="flex items-center justify-center space-x-3 py-8">
                <Loader2 className="h-6 w-6 animate-spin text-green-600" />
                <span className="text-gray-600">Seeding database...</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Success Result */}
        {result && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <CardTitle className="text-green-800">Seeding Successful!</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 text-center">
                  <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {result.summary.farmersCreated}
                  </div>
                  <div className="text-sm text-gray-600">Farmers</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <Package className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {result.summary.listingsCreated}
                  </div>
                  <div className="text-sm text-gray-600">Products</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <Sprout className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {result.summary.farmingTypes}
                  </div>
                  <div className="text-sm text-gray-600">Farming Types</div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 max-h-96 overflow-y-auto">
                <h3 className="font-semibold mb-3 text-gray-900">Created Products:</h3>
                <div className="space-y-2">
                  {result.results.map((item: any, index: number) => (
                    <div key={index} className="text-sm border-b border-gray-100 pb-2">
                      <div className="font-medium text-gray-900">{item.product}</div>
                      <div className="text-gray-600">
                        by {item.farmer} • {item.farmingType}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                onClick={() => window.location.href = '/listings/browse'}
                className="w-full"
              >
                View All Products
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Error Result */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <XCircle className="h-6 w-6 text-red-600" />
                <CardTitle className="text-red-800">Seeding Failed</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-red-700">{error}</p>
              <Button
                onClick={() => setError(null)}
                variant="outline"
                className="mt-4"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Information */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>📋 What Gets Created</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Crop-Based Farming:</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li><strong>Arable Farming</strong> – Rice, Wheat, Corn</li>
                  <li><strong>Horticulture</strong> – Roses, Tropical Fruits</li>
                  <li><strong>Vegetable Farming</strong> – Tomatoes, Peppers, Spinach, Lettuce</li>
                  <li><strong>Herbal Farming</strong> – Basil, Moringa</li>
                  <li><strong>Viticulture</strong> – Wine Grapes</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Animal-Based Farming:</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li><strong>Livestock Farming</strong> – Cattle, Goats</li>
                  <li><strong>Poultry Farming</strong> – Eggs, Chickens, Turkeys</li>
                  <li><strong>Dairy Farming</strong> – Milk, Cheese</li>
                  <li><strong>Beekeeping</strong> – Honey, Beeswax, Pollen</li>
                  <li><strong>Aquaculture</strong> – Tilapia, Catfish, Prawns</li>
                  <li><strong>Fishery</strong> – Tuna, Mackerel, Shellfish</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}





