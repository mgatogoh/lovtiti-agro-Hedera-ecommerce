# 🌱 Database Seeding - Agricultural Products

## Overview
Created a comprehensive seed system to populate the database with realistic agricultural products from 11 different farming types, each with their own farmers and specialized products.

---

## 🚀 How to Seed the Database

### Option 1: Using the Web Interface (Recommended)
```
1. Start your dev server: npm run dev
2. Visit: http://localhost:3000/seed-data
3. Click "Fresh Start" to clear and seed
   OR
   Click "Add Products" to add without clearing
4. ✅ Database will be populated!
```

### Option 2: Using API Directly
```bash
curl -X POST http://localhost:3000/api/seed/products \
  -H "Content-Type: application/json" \
  -d '{"clearExisting": true}'
```

---

## 👨‍🌾 Farmers Created (11 Total)

### Crop-Based Farming (5 Farmers)

1. **Kwame Mensah** - Arable Farming
   - Location: Kumasi, Ghana
   - Products: Rice, Wheat, Corn
   - Specialization: Grains and cereals

2. **Amina Okafor** - Horticulture
   - Location: Ibadan, Nigeria
   - Products: Roses, Tropical Fruits
   - Specialization: Flowers and fruits

3. **John Kamau** - Vegetable Farming
   - Location: Nairobi, Kenya
   - Products: Tomatoes, Peppers, Spinach, Lettuce
   - Specialization: Fresh vegetables

4. **Fatima Diallo** - Herbal Farming
   - Location: Dakar, Senegal
   - Products: Basil, Moringa, Mint
   - Specialization: Medicinal herbs

5. **Pierre Dubois** - Viticulture
   - Location: Stellenbosch, South Africa
   - Products: Wine Grapes (Red & White)
   - Specialization: Grape cultivation

### Animal-Based Farming (6 Farmers)

6. **Ibrahim Musa** - Livestock Farming
   - Location: Kano, Nigeria
   - Products: Cattle, Goats, Sheep
   - Specialization: Meat production

7. **Grace Mutua** - Poultry Farming
   - Location: Nakuru, Kenya
   - Products: Eggs, Broiler Chickens, Turkeys
   - Specialization: Poultry products

8. **Samuel Boateng** - Dairy Farming
   - Location: Accra, Ghana
   - Products: Cow Milk, Goat Milk, Cheese
   - Specialization: Dairy products

9. **Zainab Hassan** - Beekeeping (Apiculture)
   - Location: Arusha, Tanzania
   - Products: Raw Honey, Beeswax, Bee Pollen
   - Specialization: Bee products

10. **Chidi Okonkwo** - Aquaculture Farming
    - Location: Lagos, Nigeria
    - Products: Tilapia, Catfish, Prawns
    - Specialization: Fish farming

11. **Mohamed Ali** - Fishery
    - Location: Alexandria, Egypt
    - Products: Tuna, Mackerel, Shellfish
    - Specialization: Ocean fishing

---

## 📦 Products Created (30+ Total)

### Crop-Based Products

#### Arable Farming (Grains & Cereals)
- ✅ Premium White Rice (1000 kg) - ℏ2,500/kg
- ✅ Golden Wheat Grain (2000 kg) - ℏ1,800/kg
- ✅ Yellow Corn/Maize (1500 kg) - ℏ1,500/kg

#### Horticulture (Flowers & Fruits)
- ✅ Fresh Red Roses (500 dozen) - ℏ500/dozen
- ✅ Mixed Tropical Fruits (200 kg) - ℏ3,500/kg
- ✅ Ornamental Plants (300 pieces) - ℏ250/piece

#### Vegetable Farming
- ✅ Organic Cherry Tomatoes (500 kg) - ℏ4,500/kg
- ✅ Fresh Bell Peppers Mix (300 kg) - ℏ3,800/kg
- ✅ Leafy Green Spinach (400 kg) - ℏ2,800/kg
- ✅ Crispy Lettuce Heads (350 kg) - ℏ2,200/kg

#### Herbal Farming (Medicinal Herbs)
- ✅ Fresh Basil Leaves (100 kg) - ℏ3,200/kg
- ✅ Dried Moringa Leaves (150 kg) - ℏ5,800/kg
- ✅ Fresh Mint Leaves (80 kg) - ℏ2,900/kg

#### Viticulture (Wine Production)
- ✅ Premium Red Wine Grapes (500 kg) - ℏ6,800/kg
- ✅ White Wine Grapes (400 kg) - ℏ6,500/kg

### Animal-Based Products

#### Livestock Farming
- ✅ Premium Beef Cattle (20 pieces) - ℏ450,000/piece
- ✅ Healthy Goats (50 pieces) - ℏ85,000/piece
- ✅ Quality Sheep (30 pieces) - ℏ75,000/piece

#### Poultry Farming
- ✅ Fresh Farm Eggs (1000 dozen) - ℏ1,800/dozen
- ✅ Live Broiler Chickens (200 pieces) - ℏ3,500/piece
- ✅ Turkey Birds (50 pieces) - ℏ12,000/piece

#### Dairy Farming
- ✅ Fresh Cow Milk (500 kg) - ℏ1,200/kg
- ✅ Artisan Cheese Selection (100 kg) - ℏ8,500/kg
- ✅ Fresh Goat Milk (200 kg) - ℏ1,800/kg

#### Beekeeping (Apiculture)
- ✅ Pure Raw Honey (200 kg) - ℏ4,500/kg
- ✅ Beeswax Blocks (100 kg) - ℏ3,800/kg
- ✅ Bee Pollen Granules (50 kg) - ℏ6,800/kg

#### Aquaculture Farming
- ✅ Fresh Tilapia Fish (300 kg) - ℏ4,200/kg
- ✅ Premium Catfish (400 kg) - ℏ3,800/kg
- ✅ Fresh Water Prawns (150 kg) - ℏ9,500/kg

#### Fishery (Ocean Fishing)
- ✅ Fresh Ocean Tuna (200 kg) - ℏ12,000/kg
- ✅ Fresh Mackerel (300 kg) - ℏ6,800/kg
- ✅ Mixed Shellfish (100 kg) - ℏ15,000/kg

---

## 📊 Database Structure

### Each Farmer Has:
- ✅ User account with email
- ✅ FARMER role
- ✅ Complete profile with KYC approved
- ✅ Hedera wallet address
- ✅ Contact information
- ✅ Location details

### Each Product Has:
- ✅ Title and descriptions
- ✅ Price in cents (HBAR)
- ✅ Available quantity
- ✅ Unit of measurement
- ✅ Category
- ✅ Product images (Unsplash)
- ✅ Certifications (Organic, Fair Trade, etc.)
- ✅ Harvest date (random within last 30 days)
- ✅ Expiry date (random 30-90 days ahead)
- ✅ Farmer location
- ✅ Active status

---

## 🎯 Farming Types Covered

### Crop-Based Farming (5 types)
1. ✅ **Arable Farming** – Grains, cereals, field crops
2. ✅ **Horticulture** – Fruits, vegetables, flowers, ornamental plants
3. ✅ **Viticulture** – Grapes for wine production
4. ✅ **Vegetable Farming** – Edible plants (tomatoes, peppers, leafy greens)
5. ✅ **Herbal Farming** – Medicinal and aromatic herbs

### Animal-Based Farming (6 types)
6. ✅ **Livestock Farming** – Cattle, goats, sheep, pigs
7. ✅ **Poultry Farming** – Chickens, turkeys, ducks (meat and eggs)
8. ✅ **Dairy Farming** – Milk production from cows/goats
9. ✅ **Beekeeping (Apiculture)** – Honey, wax, pollination
10. ✅ **Aquaculture Farming** – Fish, shrimp in controlled environments
11. ✅ **Fishery** – Fish and seafood from natural water bodies

---

## 📁 Files Created

1. **`app/api/seed/products/route.ts`** - API endpoint for seeding
2. **`app/seed-data/page.tsx`** - Web interface for seeding
3. **`scripts/seed-products.js`** - Node.js seed script (backup)
4. **`SEED_DATA_SUMMARY.md`** - This documentation

---

## 🔍 Product Categories

Products are organized into these categories:
- **Grains** - Rice, Wheat, Corn
- **Vegetables** - Tomatoes, Peppers, Spinach, Lettuce
- **Fruits** - Tropical fruits, Grapes
- **Herbs** - Basil, Moringa, Mint
- **Meat** - Cattle, Goats, Sheep
- **Poultry** - Eggs, Chickens, Turkeys
- **Dairy** - Milk, Cheese
- **Seafood** - Fish, Prawns, Shellfish
- **Other** - Honey, Beeswax, Flowers, Plants

---

## ✅ Quality Certifications

Products include various certifications:
- 🌿 **Organic** - Grown without synthetic pesticides
- 🤝 **Fair Trade** - Ethical trading practices
- 🧬 **Non-GMO** - No genetic modification
- 🐄 **Grass-Fed** - Naturally fed livestock
- 💉 **Veterinary Checked** - Health certified
- 🏆 **Quality Grade A** - Premium quality
- 🌊 **Sustainable** - Environmentally responsible
- 🆓 **Free-Range** - Humanely raised
- 🥛 **Pasteurized** - Heat-treated for safety
- 🎨 **Artisan** - Handcrafted products

---

## 🎨 Product Images

All products include high-quality images from Unsplash:
- Professional food photography
- Realistic product representations
- Consistent visual quality
- Optimized for web display

---

## 💰 Price Range

- **Low:** ℏ500 - ℏ5,000 (Flowers, small items)
- **Medium:** ℏ10,000 - ℏ50,000 (Vegetables, grains)
- **High:** ℏ100,000 - ℏ500,000 (Dairy, seafood)
- **Premium:** ℏ1,000,000+ (Livestock, specialty items)

---

## 🧪 Testing After Seeding

### 1. View All Products
```
Visit: http://localhost:3000/listings/browse
✅ Should see 30+ products
✅ Products from different farmers
✅ Various categories and prices
```

### 2. Filter by Category
```
Try filters: Vegetables, Grains, Seafood, Dairy
✅ Should show relevant products
```

### 3. Add to Cart
```
Add products from different farmers
✅ Cart should work
✅ Products should persist
```

### 4. View Farmer Profiles
```
Click on farmer names
✅ Should show their products
✅ Should show farming type
```

---

## 🔄 Re-seeding

To reseed the database:
1. Visit: http://localhost:3000/seed-data
2. Click "Fresh Start" (clears old data)
3. Wait for completion
4. ✅ Fresh data loaded!

---

## 📝 Customization

To add more products or farmers:
1. Edit: `app/api/seed/products/route.ts`
2. Add to `farmers` array or `productsByFarmingType` object
3. Save and reseed

---

## ✅ Status: READY TO USE!

The seed system is complete and ready to populate your database with realistic agricultural products from diverse farming types across Africa!

**🌍 Countries Represented:**
- Ghana
- Nigeria  
- Kenya
- Senegal
- South Africa
- Tanzania
- Egypt

**🎉 Total Data Points:**
- 11 Farmers
- 30+ Products
- 11 Farming Types
- 9 Product Categories
- 15+ Certifications

---

**Visit http://localhost:3000/seed-data to get started!**





