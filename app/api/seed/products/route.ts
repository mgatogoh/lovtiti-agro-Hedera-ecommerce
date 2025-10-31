import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Sample farmer data with different farming types
const farmers = [
  // Crop-Based Farmers
  {
    email: 'arable.farmer@lovtiti.com',
    role: 'FARMER' as const,
    profile: {
      fullName: 'Kwame Mensah',
      type: 'FARMER' as const,
      country: 'Ghana',
      address: 'Kumasi, Ashanti Region',
      phone: '+233244123456',
      idNumber: 'GHA-ARB-001',
      hederaWallet: '0.0.1001',
      kycStatus: 'APPROVED' as const,
    },
    farmingType: 'Arable Farming',
  },
  {
    email: 'horticulture.farmer@lovtiti.com',
    role: 'FARMER' as const,
    profile: {
      fullName: 'Amina Okafor',
      type: 'FARMER' as const,
      country: 'Nigeria',
      address: 'Ibadan, Oyo State',
      phone: '+234803456789',
      idNumber: 'NGA-HRT-002',
      hederaWallet: '0.0.1002',
      kycStatus: 'APPROVED' as const,
    },
    farmingType: 'Horticulture',
  },
  {
    email: 'vegetable.farmer@lovtiti.com',
    role: 'FARMER' as const,
    profile: {
      fullName: 'John Kamau',
      type: 'FARMER' as const,
      country: 'Kenya',
      address: 'Nairobi, Central Region',
      phone: '+254722345678',
      idNumber: 'KEN-VEG-003',
      hederaWallet: '0.0.1003',
      kycStatus: 'APPROVED' as const,
    },
    farmingType: 'Vegetable Farming',
  },
  {
    email: 'herbal.farmer@lovtiti.com',
    role: 'FARMER' as const,
    profile: {
      fullName: 'Fatima Diallo',
      type: 'FARMER' as const,
      country: 'Senegal',
      address: 'Dakar, Dakar Region',
      phone: '+221771234567',
      idNumber: 'SEN-HRB-004',
      hederaWallet: '0.0.1004',
      kycStatus: 'APPROVED' as const,
    },
    farmingType: 'Herbal Farming',
  },
  {
    email: 'viticulture.farmer@lovtiti.com',
    role: 'FARMER' as const,
    profile: {
      fullName: 'Pierre Dubois',
      type: 'FARMER' as const,
      country: 'South Africa',
      address: 'Stellenbosch, Western Cape',
      phone: '+27821234567',
      idNumber: 'ZAF-VIT-005',
      hederaWallet: '0.0.1005',
      kycStatus: 'APPROVED' as const,
    },
    farmingType: 'Viticulture',
  },
  // Animal-Based Farmers
  {
    email: 'livestock.farmer@lovtiti.com',
    role: 'FARMER' as const,
    profile: {
      fullName: 'Ibrahim Musa',
      type: 'FARMER' as const,
      country: 'Nigeria',
      address: 'Kano, Kano State',
      phone: '+234806789012',
      idNumber: 'NGA-LVS-006',
      hederaWallet: '0.0.1006',
      kycStatus: 'APPROVED' as const,
    },
    farmingType: 'Livestock Farming',
  },
  {
    email: 'poultry.farmer@lovtiti.com',
    role: 'FARMER' as const,
    profile: {
      fullName: 'Grace Mutua',
      type: 'FARMER' as const,
      country: 'Kenya',
      address: 'Nakuru, Rift Valley',
      phone: '+254733456789',
      idNumber: 'KEN-PLT-007',
      hederaWallet: '0.0.1007',
      kycStatus: 'APPROVED' as const,
    },
    farmingType: 'Poultry Farming',
  },
  {
    email: 'dairy.farmer@lovtiti.com',
    role: 'FARMER' as const,
    profile: {
      fullName: 'Samuel Boateng',
      type: 'FARMER' as const,
      country: 'Ghana',
      address: 'Accra, Greater Accra',
      phone: '+233244567890',
      idNumber: 'GHA-DRY-008',
      hederaWallet: '0.0.1008',
      kycStatus: 'APPROVED' as const,
    },
    farmingType: 'Dairy Farming',
  },
  {
    email: 'beekeeper.farmer@lovtiti.com',
    role: 'FARMER' as const,
    profile: {
      fullName: 'Zainab Hassan',
      type: 'FARMER' as const,
      country: 'Tanzania',
      address: 'Arusha, Arusha Region',
      phone: '+255754123456',
      idNumber: 'TZA-BEE-009',
      hederaWallet: '0.0.1009',
      kycStatus: 'APPROVED' as const,
    },
    farmingType: 'Beekeeping (Apiculture)',
  },
  {
    email: 'aquaculture.farmer@lovtiti.com',
    role: 'FARMER' as const,
    profile: {
      fullName: 'Chidi Okonkwo',
      type: 'FARMER' as const,
      country: 'Nigeria',
      address: 'Lagos, Lagos State',
      phone: '+234809876543',
      idNumber: 'NGA-AQC-010',
      hederaWallet: '0.0.1010',
      kycStatus: 'APPROVED' as const,
    },
    farmingType: 'Aquaculture Farming',
  },
  {
    email: 'fishery.farmer@lovtiti.com',
    role: 'FARMER' as const,
    profile: {
      fullName: 'Mohamed Ali',
      type: 'FARMER' as const,
      country: 'Egypt',
      address: 'Alexandria, Alexandria Governorate',
      phone: '+201012345678',
      idNumber: 'EGY-FSH-011',
      hederaWallet: '0.0.1011',
      kycStatus: 'APPROVED' as const,
    },
    farmingType: 'Fishery',
  },
];

// Products organized by farming type
const productsByFarmingType: Record<string, any[]> = {
  'Arable Farming': [
    {
      title: 'Premium White Rice',
      description: 'High-quality long-grain white rice',
      productDescription: 'Organically grown white rice with excellent cooking properties. Perfect for daily meals and special occasions.',
      priceCents: 250000,
      quantity: 1000,
      unit: 'kg',
      category: 'Grains',
      images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c'],
      certifications: ['Organic', 'Non-GMO'],
    },
    {
      title: 'Golden Wheat Grain',
      description: 'Fresh harvest wheat for milling',
      productDescription: 'High-protein wheat grain ideal for bread making and flour production.',
      priceCents: 180000,
      quantity: 2000,
      unit: 'kg',
      category: 'Grains',
      images: ['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b'],
      certifications: ['Quality Assured'],
    },
    {
      title: 'Yellow Corn (Maize)',
      description: 'Fresh yellow corn for various uses',
      productDescription: 'Versatile yellow corn suitable for animal feed, human consumption, and industrial processing.',
      priceCents: 150000,
      quantity: 1500,
      unit: 'kg',
      category: 'Grains',
      images: ['https://images.unsplash.com/photo-1551754655-cd27e38d2076'],
      certifications: ['Quality Assured'],
    },
  ],
  'Horticulture': [
    {
      title: 'Fresh Red Roses',
      description: 'Premium quality red roses',
      productDescription: 'Beautiful long-stem red roses perfect for bouquets and special occasions.',
      priceCents: 50000,
      quantity: 500,
      unit: 'dozen',
      category: 'Other',
      images: ['https://images.unsplash.com/photo-1518709268805-4e9042af9f23'],
      certifications: ['Fresh Cut', 'Quality Grade A'],
    },
    {
      title: 'Mixed Tropical Fruits',
      description: 'Assorted fresh tropical fruits',
      productDescription: 'A delightful mix of mangoes, pineapples, papayas, and passion fruits.',
      priceCents: 350000,
      quantity: 200,
      unit: 'kg',
      category: 'Fruits',
      images: ['https://images.unsplash.com/photo-1619566636858-adf3ef46400b'],
      certifications: ['Fresh', 'Pesticide-Free'],
    },
  ],
  'Vegetable Farming': [
    {
      title: 'Organic Cherry Tomatoes',
      description: 'Sweet and juicy cherry tomatoes',
      productDescription: 'Vine-ripened organic cherry tomatoes bursting with flavor.',
      priceCents: 450000,
      quantity: 500,
      unit: 'kg',
      category: 'Vegetables',
      images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea'],
      certifications: ['Organic', 'Fair Trade', 'Non-GMO'],
    },
    {
      title: 'Fresh Bell Peppers Mix',
      description: 'Colorful bell peppers',
      productDescription: 'Crisp and sweet bell peppers in multiple colors.',
      priceCents: 380000,
      quantity: 300,
      unit: 'kg',
      category: 'Vegetables',
      images: ['https://images.unsplash.com/photo-1563565375-f3fdfdbefa83'],
      certifications: ['Organic', 'Pesticide-Free'],
    },
    {
      title: 'Leafy Green Spinach',
      description: 'Fresh organic spinach leaves',
      productDescription: 'Nutrient-rich spinach leaves, freshly harvested.',
      priceCents: 280000,
      quantity: 400,
      unit: 'kg',
      category: 'Vegetables',
      images: ['https://images.unsplash.com/photo-1576045057995-568f588f82fb'],
      certifications: ['Organic', 'Fresh'],
    },
  ],
  'Herbal Farming': [
    {
      title: 'Fresh Basil Leaves',
      description: 'Aromatic sweet basil',
      productDescription: 'Fragrant sweet basil leaves perfect for cooking and medicinal purposes.',
      priceCents: 320000,
      quantity: 100,
      unit: 'kg',
      category: 'Herbs',
      images: ['https://images.unsplash.com/photo-1618375569909-3c8616cf7733'],
      certifications: ['Organic', 'Medicinal Grade'],
    },
    {
      title: 'Dried Moringa Leaves',
      description: 'Nutrient-rich moringa powder',
      productDescription: 'Dried and powdered moringa leaves, known as the "miracle tree".',
      priceCents: 580000,
      quantity: 150,
      unit: 'kg',
      category: 'Herbs',
      images: ['https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1'],
      certifications: ['Organic', 'Medicinal Grade', 'Fair Trade'],
    },
  ],
  'Viticulture': [
    {
      title: 'Premium Red Wine Grapes',
      description: 'Cabernet Sauvignon grapes',
      productDescription: 'Premium quality grapes for wine production.',
      priceCents: 680000,
      quantity: 500,
      unit: 'kg',
      category: 'Fruits',
      images: ['https://images.unsplash.com/photo-1596363505729-4190a9506133'],
      certifications: ['Wine Grade', 'Quality Assured'],
    },
  ],
  'Livestock Farming': [
    {
      title: 'Premium Beef Cattle',
      description: 'Healthy grass-fed cattle',
      productDescription: 'Well-raised cattle for beef production. Grass-fed and hormone-free.',
      priceCents: 45000000,
      quantity: 20,
      unit: 'piece',
      category: 'Meat',
      images: ['https://images.unsplash.com/photo-1560493676-04071c5f467b'],
      certifications: ['Veterinary Checked', 'Grass-Fed', 'Hormone-Free'],
    },
    {
      title: 'Healthy Goats',
      description: 'Mixed breed goats',
      productDescription: 'Healthy goats suitable for meat and milk production.',
      priceCents: 8500000,
      quantity: 50,
      unit: 'piece',
      category: 'Meat',
      images: ['https://images.unsplash.com/photo-1583337130417-3346a1be7dee'],
      certifications: ['Veterinary Checked', 'Vaccinated'],
    },
  ],
  'Poultry Farming': [
    {
      title: 'Fresh Farm Eggs (Brown)',
      description: 'Free-range chicken eggs',
      productDescription: 'Fresh brown eggs from free-range chickens.',
      priceCents: 180000,
      quantity: 1000,
      unit: 'dozen',
      category: 'Poultry',
      images: ['https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f'],
      certifications: ['Free-Range', 'Fresh', 'Quality Grade A'],
    },
    {
      title: 'Live Broiler Chickens',
      description: 'Ready-to-market broilers',
      productDescription: 'Healthy broiler chickens ready for market.',
      priceCents: 350000,
      quantity: 200,
      unit: 'piece',
      category: 'Poultry',
      images: ['https://images.unsplash.com/photo-1548550023-2bdb3c5beed7'],
      certifications: ['Veterinary Checked', 'Vaccinated'],
    },
  ],
  'Dairy Farming': [
    {
      title: 'Fresh Cow Milk',
      description: 'Pure pasteurized cow milk',
      productDescription: 'Fresh pasteurized milk from grass-fed cows.',
      priceCents: 120000,
      quantity: 500,
      unit: 'kg',
      category: 'Dairy',
      images: ['https://images.unsplash.com/photo-1563636619-e9143da7973b'],
      certifications: ['Pasteurized', 'Quality Tested', 'Fresh'],
    },
    {
      title: 'Artisan Cheese Selection',
      description: 'Handcrafted farm cheese',
      productDescription: 'Artisanal cheese made from fresh cow milk.',
      priceCents: 850000,
      quantity: 100,
      unit: 'kg',
      category: 'Dairy',
      images: ['https://images.unsplash.com/photo-1452195100486-9cc805987862'],
      certifications: ['Artisan', 'Quality Grade A'],
    },
  ],
  'Beekeeping (Apiculture)': [
    {
      title: 'Pure Raw Honey',
      description: 'Unprocessed natural honey',
      productDescription: 'Raw, unfiltered honey harvested from wildflower fields.',
      priceCents: 450000,
      quantity: 200,
      unit: 'kg',
      category: 'Other',
      images: ['https://images.unsplash.com/photo-1587049352846-4a222e784210'],
      certifications: ['Raw', 'Organic', 'Pure'],
    },
    {
      title: 'Beeswax Blocks',
      description: 'Natural beeswax for crafts',
      productDescription: 'Pure beeswax blocks perfect for candle making and cosmetics.',
      priceCents: 380000,
      quantity: 100,
      unit: 'kg',
      category: 'Other',
      images: ['https://images.unsplash.com/photo-1608797178974-15b35a64ede9'],
      certifications: ['Pure', 'Natural'],
    },
  ],
  'Aquaculture Farming': [
    {
      title: 'Fresh Tilapia Fish',
      description: 'Farm-raised tilapia',
      productDescription: 'Fresh tilapia raised in clean controlled ponds.',
      priceCents: 420000,
      quantity: 300,
      unit: 'kg',
      category: 'Seafood',
      images: ['https://images.unsplash.com/photo-1544943910-4c1dc44aab44'],
      certifications: ['Farm-Raised', 'Quality Tested', 'Fresh'],
    },
    {
      title: 'Premium Catfish',
      description: 'Live catfish from pond',
      productDescription: 'Large healthy catfish raised in optimal conditions.',
      priceCents: 380000,
      quantity: 400,
      unit: 'kg',
      category: 'Seafood',
      images: ['https://images.unsplash.com/photo-1534043464124-3be32fe000c9'],
      certifications: ['Farm-Raised', 'Fresh'],
    },
  ],
  'Fishery': [
    {
      title: 'Fresh Ocean Tuna',
      description: 'Wild-caught tuna',
      productDescription: 'Fresh tuna caught from sustainable fisheries.',
      priceCents: 1200000,
      quantity: 200,
      unit: 'kg',
      category: 'Seafood',
      images: ['https://images.unsplash.com/photo-1559827260-dc66d52bef19'],
      certifications: ['Wild-Caught', 'Sustainable', 'Fresh'],
    },
    {
      title: 'Fresh Mackerel',
      description: 'Atlantic mackerel',
      productDescription: 'Fresh Atlantic mackerel rich in healthy fats.',
      priceCents: 680000,
      quantity: 300,
      unit: 'kg',
      category: 'Seafood',
      images: ['https://images.unsplash.com/photo-1565680018434-b513d5e5fd47'],
      certifications: ['Wild-Caught', 'Fresh'],
    },
  ],
};

export async function POST(request: Request) {
  try {
    console.log('🌱 Starting seed process...');

    const { clearExisting } = await request.json().catch(() => ({ clearExisting: false }));

    // Optionally clear existing listings
    if (clearExisting) {
      console.log('🧹 Clearing existing listings...');
      await prisma.listing.deleteMany({});
      console.log('✅ Listings cleared');
    }

    let totalCreated = 0;
    const results = [];

    // Create farmers and their products
    for (const farmerData of farmers) {
      console.log(`\n👨‍🌾 Creating farmer: ${farmerData.profile.fullName}`);

      // Create or update user
      const user = await prisma.user.upsert({
        where: { email: farmerData.email },
        create: {
          email: farmerData.email,
          role: farmerData.role,
        },
        update: {
          role: farmerData.role,
        },
      });

      // Create or update profile
      const profile = await prisma.profile.upsert({
        where: {
          userId_type: {
            userId: user.id,
            type: farmerData.profile.type,
          },
        },
        create: {
          userId: user.id,
          ...farmerData.profile,
        },
        update: {
          ...farmerData.profile,
        },
      });

      // Get products for this farming type
      const products = productsByFarmingType[farmerData.farmingType] || [];

      // Create listings for this farmer
      for (const product of products) {
        const listing = await prisma.listing.create({
          data: {
            ...product,
            sellerId: user.id,
            location: farmerData.profile.address,
            harvestDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
            expiryDate: new Date(Date.now() + (30 + Math.random() * 60) * 24 * 60 * 60 * 1000),
          },
        });

        totalCreated++;
        results.push({
          farmer: farmerData.profile.fullName,
          farmingType: farmerData.farmingType,
          product: listing.title,
        });
      }
    }

    console.log(`\n✅ Seed completed!`);

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      summary: {
        farmersCreated: farmers.length,
        listingsCreated: totalCreated,
        farmingTypes: Object.keys(productsByFarmingType).length,
      },
      results,
    });

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to seed database',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST to seed the database',
    instructions: 'Send POST request with optional body: { "clearExisting": true }',
  });
}





