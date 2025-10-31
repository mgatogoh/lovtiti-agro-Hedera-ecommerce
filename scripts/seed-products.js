const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Sample farmer data with different farming types
const farmers = [
  // Crop-Based Farmers
  {
    email: 'arable.farmer@lovtiti.com',
    role: 'FARMER',
    profile: {
      fullName: 'Kwame Mensah',
      type: 'FARMER',
      country: 'Ghana',
      address: 'Kumasi, Ashanti Region',
      phone: '+233244123456',
      idNumber: 'GHA-ARB-001',
      hederaWallet: '0.0.1001',
      kycStatus: 'APPROVED',
    },
    farmingType: 'Arable Farming',
  },
  {
    email: 'horticulture.farmer@lovtiti.com',
    role: 'FARMER',
    profile: {
      fullName: 'Amina Okafor',
      type: 'FARMER',
      country: 'Nigeria',
      address: 'Ibadan, Oyo State',
      phone: '+234803456789',
      idNumber: 'NGA-HRT-002',
      hederaWallet: '0.0.1002',
      kycStatus: 'APPROVED',
    },
    farmingType: 'Horticulture',
  },
  {
    email: 'vegetable.farmer@lovtiti.com',
    role: 'FARMER',
    profile: {
      fullName: 'John Kamau',
      type: 'FARMER',
      country: 'Kenya',
      address: 'Nairobi, Central Region',
      phone: '+254722345678',
      idNumber: 'KEN-VEG-003',
      hederaWallet: '0.0.1003',
      kycStatus: 'APPROVED',
    },
    farmingType: 'Vegetable Farming',
  },
  {
    email: 'herbal.farmer@lovtiti.com',
    role: 'FARMER',
    profile: {
      fullName: 'Fatima Diallo',
      type: 'FARMER',
      country: 'Senegal',
      address: 'Dakar, Dakar Region',
      phone: '+221771234567',
      idNumber: 'SEN-HRB-004',
      hederaWallet: '0.0.1004',
      kycStatus: 'APPROVED',
    },
    farmingType: 'Herbal Farming',
  },
  {
    email: 'viticulture.farmer@lovtiti.com',
    role: 'FARMER',
    profile: {
      fullName: 'Pierre Dubois',
      type: 'FARMER',
      country: 'South Africa',
      address: 'Stellenbosch, Western Cape',
      phone: '+27821234567',
      idNumber: 'ZAF-VIT-005',
      hederaWallet: '0.0.1005',
      kycStatus: 'APPROVED',
    },
    farmingType: 'Viticulture',
  },
  // Animal-Based Farmers
  {
    email: 'livestock.farmer@lovtiti.com',
    role: 'FARMER',
    profile: {
      fullName: 'Ibrahim Musa',
      type: 'FARMER',
      country: 'Nigeria',
      address: 'Kano, Kano State',
      phone: '+234806789012',
      idNumber: 'NGA-LVS-006',
      hederaWallet: '0.0.1006',
      kycStatus: 'APPROVED',
    },
    farmingType: 'Livestock Farming',
  },
  {
    email: 'poultry.farmer@lovtiti.com',
    role: 'FARMER',
    profile: {
      fullName: 'Grace Mutua',
      type: 'FARMER',
      country: 'Kenya',
      address: 'Nakuru, Rift Valley',
      phone: '+254733456789',
      idNumber: 'KEN-PLT-007',
      hederaWallet: '0.0.1007',
      kycStatus: 'APPROVED',
    },
    farmingType: 'Poultry Farming',
  },
  {
    email: 'dairy.farmer@lovtiti.com',
    role: 'FARMER',
    profile: {
      fullName: 'Samuel Boateng',
      type: 'FARMER',
      country: 'Ghana',
      address: 'Accra, Greater Accra',
      phone: '+233244567890',
      idNumber: 'GHA-DRY-008',
      hederaWallet: '0.0.1008',
      kycStatus: 'APPROVED',
    },
    farmingType: 'Dairy Farming',
  },
  {
    email: 'beekeeper.farmer@lovtiti.com',
    role: 'FARMER',
    profile: {
      fullName: 'Zainab Hassan',
      type: 'FARMER',
      country: 'Tanzania',
      address: 'Arusha, Arusha Region',
      phone: '+255754123456',
      idNumber: 'TZA-BEE-009',
      hederaWallet: '0.0.1009',
      kycStatus: 'APPROVED',
    },
    farmingType: 'Beekeeping (Apiculture)',
  },
  {
    email: 'aquaculture.farmer@lovtiti.com',
    role: 'FARMER',
    profile: {
      fullName: 'Chidi Okonkwo',
      type: 'FARMER',
      country: 'Nigeria',
      address: 'Lagos, Lagos State',
      phone: '+234809876543',
      idNumber: 'NGA-AQC-010',
      hederaWallet: '0.0.1010',
      kycStatus: 'APPROVED',
    },
    farmingType: 'Aquaculture Farming',
  },
  {
    email: 'fishery.farmer@lovtiti.com',
    role: 'FARMER',
    profile: {
      fullName: 'Mohamed Ali',
      type: 'FARMER',
      country: 'Egypt',
      address: 'Alexandria, Alexandria Governorate',
      phone: '+201012345678',
      idNumber: 'EGY-FSH-011',
      hederaWallet: '0.0.1011',
      kycStatus: 'APPROVED',
    },
    farmingType: 'Fishery',
  },
];

// Products organized by farming type
const productsByFarmingType = {
  'Arable Farming': [
    {
      title: 'Premium White Rice',
      description: 'High-quality long-grain white rice',
      productDescription: 'Organically grown white rice with excellent cooking properties. Perfect for daily meals and special occasions.',
      priceCents: 250000, // 2500 HBAR
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
      productDescription: 'Beautiful long-stem red roses perfect for bouquets and special occasions. Grown with care in optimal conditions.',
      priceCents: 50000,
      quantity: 500,
      unit: 'dozen',
      category: 'Flowers',
      images: ['https://images.unsplash.com/photo-1518709268805-4e9042af9f23'],
      certifications: ['Fresh Cut', 'Quality Grade A'],
    },
    {
      title: 'Mixed Fruit Basket Selection',
      description: 'Assorted fresh tropical fruits',
      productDescription: 'A delightful mix of mangoes, pineapples, papayas, and passion fruits. Handpicked at peak ripeness.',
      priceCents: 350000,
      quantity: 200,
      unit: 'kg',
      category: 'Fruits',
      images: ['https://images.unsplash.com/photo-1619566636858-adf3ef46400b'],
      certifications: ['Fresh', 'Pesticide-Free'],
    },
    {
      title: 'Ornamental Plant Collection',
      description: 'Beautiful decorative plants',
      productDescription: 'Variety of ornamental plants including ferns, succulents, and flowering plants for indoor and outdoor decoration.',
      priceCents: 25000,
      quantity: 300,
      unit: 'piece',
      category: 'Plants',
      images: ['https://images.unsplash.com/photo-1459411621453-7b03977f4bfc'],
      certifications: ['Healthy', 'Pest-Free'],
    },
  ],
  'Vegetable Farming': [
    {
      title: 'Organic Cherry Tomatoes',
      description: 'Sweet and juicy cherry tomatoes',
      productDescription: 'Vine-ripened organic cherry tomatoes bursting with flavor. Perfect for salads and snacking.',
      priceCents: 450000,
      quantity: 500,
      unit: 'kg',
      category: 'Vegetables',
      images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea'],
      certifications: ['Organic', 'Fair Trade', 'Non-GMO'],
    },
    {
      title: 'Fresh Bell Peppers Mix',
      description: 'Colorful bell peppers - red, yellow, green',
      productDescription: 'Crisp and sweet bell peppers in multiple colors. Rich in vitamins and perfect for cooking.',
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
      productDescription: 'Nutrient-rich spinach leaves, freshly harvested. Excellent source of iron and vitamins.',
      priceCents: 280000,
      quantity: 400,
      unit: 'kg',
      category: 'Vegetables',
      images: ['https://images.unsplash.com/photo-1576045057995-568f588f82fb'],
      certifications: ['Organic', 'Fresh'],
    },
    {
      title: 'Crispy Lettuce Heads',
      description: 'Fresh crispy lettuce',
      productDescription: 'Crunchy lettuce heads perfect for salads and sandwiches. Grown hydroponically for maximum freshness.',
      priceCents: 220000,
      quantity: 350,
      unit: 'kg',
      category: 'Vegetables',
      images: ['https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1'],
      certifications: ['Hydroponic', 'Pesticide-Free'],
    },
  ],
  'Herbal Farming': [
    {
      title: 'Fresh Basil Leaves',
      description: 'Aromatic sweet basil',
      productDescription: 'Fragrant sweet basil leaves perfect for cooking, teas, and medicinal purposes.',
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
      productDescription: 'Dried and powdered moringa leaves, known as the "miracle tree". Rich in vitamins and minerals.',
      priceCents: 580000,
      quantity: 150,
      unit: 'kg',
      category: 'Herbs',
      images: ['https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1'],
      certifications: ['Organic', 'Medicinal Grade', 'Fair Trade'],
    },
    {
      title: 'Fresh Mint Leaves',
      description: 'Aromatic peppermint',
      productDescription: 'Fresh peppermint leaves for culinary and medicinal use. Excellent for teas and cooking.',
      priceCents: 290000,
      quantity: 80,
      unit: 'kg',
      category: 'Herbs',
      images: ['https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1'],
      certifications: ['Organic', 'Fresh'],
    },
  ],
  'Viticulture': [
    {
      title: 'Premium Red Wine Grapes',
      description: 'Cabernet Sauvignon grapes',
      productDescription: 'Premium quality Cabernet Sauvignon grapes for wine production. Perfectly ripened with optimal sugar content.',
      priceCents: 680000,
      quantity: 500,
      unit: 'kg',
      category: 'Fruits',
      images: ['https://images.unsplash.com/photo-1596363505729-4190a9506133'],
      certifications: ['Wine Grade', 'Quality Assured'],
    },
    {
      title: 'White Wine Grapes',
      description: 'Chardonnay grapes for wine',
      productDescription: 'High-quality Chardonnay grapes with excellent flavor profile for white wine production.',
      priceCents: 650000,
      quantity: 400,
      unit: 'kg',
      category: 'Fruits',
      images: ['https://images.unsplash.com/photo-1599819177331-6d0b3a8c3d10'],
      certifications: ['Wine Grade', 'Quality Assured'],
    },
  ],
  'Livestock Farming': [
    {
      title: 'Premium Beef Cattle',
      description: 'Healthy grass-fed cattle',
      productDescription: 'Well-raised cattle for beef production. Grass-fed and hormone-free. Average weight 400-500kg.',
      priceCents: 45000000, // 450,000 HBAR
      quantity: 20,
      unit: 'piece',
      category: 'Livestock',
      images: ['https://images.unsplash.com/photo-1560493676-04071c5f467b'],
      certifications: ['Veterinary Checked', 'Grass-Fed', 'Hormone-Free'],
    },
    {
      title: 'Healthy Goats',
      description: 'Mixed breed goats',
      productDescription: 'Healthy goats suitable for meat and milk production. Well-vaccinated and disease-free.',
      priceCents: 8500000, // 85,000 HBAR
      quantity: 50,
      unit: 'piece',
      category: 'Livestock',
      images: ['https://images.unsplash.com/photo-1583337130417-3346a1be7dee'],
      certifications: ['Veterinary Checked', 'Vaccinated'],
    },
    {
      title: 'Quality Sheep',
      description: 'Wool and meat sheep',
      productDescription: 'Dual-purpose sheep for wool and meat production. Healthy and well-maintained.',
      priceCents: 7500000,
      quantity: 30,
      unit: 'piece',
      category: 'Livestock',
      images: ['https://images.unsplash.com/photo-1583083527882-4bee9aba2eea'],
      certifications: ['Veterinary Checked', 'Quality Breed'],
    },
  ],
  'Poultry Farming': [
    {
      title: 'Fresh Farm Eggs (Brown)',
      description: 'Free-range chicken eggs',
      productDescription: 'Fresh brown eggs from free-range chickens. Rich in nutrients and flavor.',
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
      productDescription: 'Healthy broiler chickens ready for market. Average weight 2-2.5kg. Well-fed and vaccinated.',
      priceCents: 350000,
      quantity: 200,
      unit: 'piece',
      category: 'Poultry',
      images: ['https://images.unsplash.com/photo-1548550023-2bdb3c5beed7'],
      certifications: ['Veterinary Checked', 'Vaccinated', 'Antibiotic-Free'],
    },
    {
      title: 'Turkey Birds',
      description: 'Premium quality turkeys',
      productDescription: 'Large healthy turkeys perfect for festive occasions. Well-raised and disease-free.',
      priceCents: 1200000,
      quantity: 50,
      unit: 'piece',
      category: 'Poultry',
      images: ['https://images.unsplash.com/photo-1574418442485-a528c1e0bae8'],
      certifications: ['Veterinary Checked', 'Premium Quality'],
    },
  ],
  'Dairy Farming': [
    {
      title: 'Fresh Cow Milk',
      description: 'Pure pasteurized cow milk',
      productDescription: 'Fresh pasteurized milk from grass-fed cows. Rich in calcium and vitamins. Daily delivery available.',
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
      productDescription: 'Artisanal cheese made from fresh cow milk. Aged to perfection with rich flavor.',
      priceCents: 850000,
      quantity: 100,
      unit: 'kg',
      category: 'Dairy',
      images: ['https://images.unsplash.com/photo-1452195100486-9cc805987862'],
      certifications: ['Artisan', 'Quality Grade A'],
    },
    {
      title: 'Fresh Goat Milk',
      description: 'Pure goat milk',
      productDescription: 'Fresh goat milk with unique flavor and health benefits. Easier to digest than cow milk.',
      priceCents: 180000,
      quantity: 200,
      unit: 'kg',
      category: 'Dairy',
      images: ['https://images.unsplash.com/photo-1628088062854-d1870b4553da'],
      certifications: ['Fresh', 'Quality Tested'],
    },
  ],
  'Beekeeping (Apiculture)': [
    {
      title: 'Pure Raw Honey',
      description: 'Unprocessed natural honey',
      productDescription: 'Raw, unfiltered honey harvested from wildflower fields. Rich in enzymes and antioxidants.',
      priceCents: 450000,
      quantity: 200,
      unit: 'kg',
      category: 'Honey',
      images: ['https://images.unsplash.com/photo-1587049352846-4a222e784210'],
      certifications: ['Raw', 'Organic', 'Pure'],
    },
    {
      title: 'Beeswax Blocks',
      description: 'Natural beeswax for crafts',
      productDescription: 'Pure beeswax blocks perfect for candle making, cosmetics, and wood finishing.',
      priceCents: 380000,
      quantity: 100,
      unit: 'kg',
      category: 'Other',
      images: ['https://images.unsplash.com/photo-1608797178974-15b35a64ede9'],
      certifications: ['Pure', 'Natural'],
    },
    {
      title: 'Bee Pollen Granules',
      description: 'Nutrient-rich bee pollen',
      productDescription: 'Fresh bee pollen packed with vitamins, minerals, and proteins. Superfood for health enthusiasts.',
      priceCents: 680000,
      quantity: 50,
      unit: 'kg',
      category: 'Other',
      images: ['https://images.unsplash.com/photo-1558642084-fd07fae5282e'],
      certifications: ['Organic', 'Raw', 'Quality Tested'],
    },
  ],
  'Aquaculture Farming': [
    {
      title: 'Fresh Tilapia Fish',
      description: 'Farm-raised tilapia',
      productDescription: 'Fresh tilapia raised in clean controlled ponds. Excellent protein source with mild flavor.',
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
      productDescription: 'Large healthy catfish raised in optimal conditions. Average weight 1-2kg per fish.',
      priceCents: 380000,
      quantity: 400,
      unit: 'kg',
      category: 'Seafood',
      images: ['https://images.unsplash.com/photo-1534043464124-3be32fe000c9'],
      certifications: ['Farm-Raised', 'Fresh', 'Quality Grade A'],
    },
    {
      title: 'Fresh Water Prawns',
      description: 'Large freshwater prawns',
      productDescription: 'Jumbo-sized freshwater prawns. Sweet and succulent, perfect for grilling or stir-frying.',
      priceCents: 950000,
      quantity: 150,
      unit: 'kg',
      category: 'Seafood',
      images: ['https://images.unsplash.com/photo-1565680018434-b513d5e5fd47'],
      certifications: ['Farm-Raised', 'Premium Quality'],
    },
  ],
  'Fishery': [
    {
      title: 'Fresh Ocean Tuna',
      description: 'Wild-caught tuna',
      productDescription: 'Fresh tuna caught from sustainable fisheries. Rich in omega-3 fatty acids.',
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
      productDescription: 'Fresh Atlantic mackerel rich in healthy fats. Perfect for grilling or smoking.',
      priceCents: 680000,
      quantity: 300,
      unit: 'kg',
      category: 'Seafood',
      images: ['https://images.unsplash.com/photo-1565680018434-b513d5e5fd47'],
      certifications: ['Wild-Caught', 'Fresh', 'Quality Tested'],
    },
    {
      title: 'Mixed Shellfish',
      description: 'Fresh crabs and lobsters',
      productDescription: 'Assorted fresh shellfish including crabs and lobsters. Caught daily from clean waters.',
      priceCents: 1500000,
      quantity: 100,
      unit: 'kg',
      category: 'Seafood',
      images: ['https://images.unsplash.com/photo-1559827260-dc66d52bef19'],
      certifications: ['Wild-Caught', 'Fresh', 'Premium'],
    },
  ],
};

async function main() {
  console.log('🌱 Starting seed process...\n');

  try {
    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🧹 Clearing existing listings...');
    await prisma.listing.deleteMany({});
    console.log('✅ Listings cleared\n');

    let totalCreated = 0;

    // Create farmers and their products
    for (const farmerData of farmers) {
      console.log(`\n👨‍🌾 Creating farmer: ${farmerData.profile.fullName} (${farmerData.farmingType})`);

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

      console.log(`   ✅ User created: ${user.email}`);

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

      console.log(`   ✅ Profile created: ${profile.fullName}`);

      // Get products for this farming type
      const products = productsByFarmingType[farmerData.farmingType] || [];

      // Create listings for this farmer
      for (const product of products) {
        const listing = await prisma.listing.create({
          data: {
            ...product,
            sellerId: user.id,
            location: farmerData.profile.address,
            harvestDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
            expiryDate: new Date(Date.now() + (30 + Math.random() * 60) * 24 * 60 * 60 * 1000), // Random date 30-90 days in future
          },
        });

        console.log(`   📦 Created listing: ${listing.title}`);
        totalCreated++;
      }
    }

    console.log(`\n\n🎉 Seed completed successfully!`);
    console.log(`📊 Summary:`);
    console.log(`   - Farmers created: ${farmers.length}`);
    console.log(`   - Listings created: ${totalCreated}`);
    console.log(`   - Farming types: ${Object.keys(productsByFarmingType).length}`);
    console.log(`\n✅ Database seeded with realistic agricultural products!\n`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });





