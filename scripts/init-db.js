const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function initializeDatabase() {
  try {
    console.log('🚀 Initializing database...');
    
    // Check if we have any users
    const userCount = await prisma.user.count();
    console.log(`📊 Current users in database: ${userCount}`);
    
    // Check if we have any listings
    const listingCount = await prisma.listing.count();
    console.log(`📊 Current listings in database: ${listingCount}`);
    
    // Check if we have any profiles
    const profileCount = await prisma.profile.count();
    console.log(`📊 Current profiles in database: ${profileCount}`);
    
    // Check if we have any orders
    const orderCount = await prisma.order.count();
    console.log(`📊 Current orders in database: ${orderCount}`);
    
    console.log('✅ Database initialization check completed!');
    console.log('🎯 Your database is ready for the Lovtiti Agro Mart application.');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

initializeDatabase();

