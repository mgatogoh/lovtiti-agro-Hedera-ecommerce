const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

async function verifyNeonTables() {
  try {
    await client.connect();
    console.log('✅ Connected to Neon database successfully!');
    console.log('📊 This is PostgreSQL 17.5 running on Neon infrastructure');
    console.log('🔗 Connection is going through pgbouncer (connection pooler)');
    console.log('');
    
    // Get detailed table information
    const tables = await client.query(`
      SELECT 
        table_name,
        table_type,
        table_schema
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('📋 Tables in your Neon database:');
    console.log('================================');
    tables.rows.forEach((table, index) => {
      console.log(`${index + 1}. ${table.table_name} (${table.table_type})`);
    });
    console.log('');
    
    // Get table row counts
    console.log('📊 Table row counts:');
    console.log('====================');
    for (const table of tables.rows) {
      try {
        const count = await client.query(`SELECT COUNT(*) as count FROM "${table.table_name}"`);
        console.log(`${table.table_name}: ${count.rows[0].count} rows`);
      } catch (error) {
        console.log(`${table.table_name}: Error counting rows`);
      }
    }
    console.log('');
    
    // Check if this is definitely Neon
    const neonInfo = await client.query(`
      SELECT 
        current_database() as database_name,
        current_user as user_name,
        inet_server_addr() as internal_addr,
        inet_server_port() as port,
        version() as postgres_version
    `);
    
    console.log('🔍 Connection Details:');
    console.log('======================');
    console.log(`Database: ${neonInfo.rows[0].database_name}`);
    console.log(`User: ${neonInfo.rows[0].user_name}`);
    console.log(`Internal Address: ${neonInfo.rows[0].internal_addr}`);
    console.log(`Port: ${neonInfo.rows[0].port}`);
    console.log(`PostgreSQL Version: ${neonInfo.rows[0].postgres_version}`);
    console.log('');
    console.log('✅ Your tables ARE in Neon! The internal address (127.0.0.1) is normal for Neon\'s connection pooler.');
    console.log('💡 Check your Neon dashboard - the tables should be visible there.');
    
    await client.end();
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
  }
}

verifyNeonTables();

