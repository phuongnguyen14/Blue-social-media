const { Client } = require('pg');

async function testDatabaseConnection() {
  console.log('🔍 Testing Railway Database Connection...');
  
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL environment variable not found!');
    console.log('Available env vars:', Object.keys(process.env).filter(key => key.includes('DB') || key.includes('DATABASE')));
    process.exit(1);
  }
  
  console.log('📊 DATABASE_URL found:', databaseUrl.replace(/:[^:@]*@/, ':***@'));
  
  const client = new Client({
    connectionString: databaseUrl,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });
  
  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Database connection successful!');
    
    console.log('📋 Testing basic query...');
    const result = await client.query('SELECT version(), now()');
    console.log('🎉 Query successful:', result.rows[0]);
    
    console.log('🗂️ Checking if users table exists...');
    const tableCheck = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'users'
    `);
    
    if (tableCheck.rows.length > 0) {
      console.log('✅ Users table exists!');
      
      const userCount = await client.query('SELECT COUNT(*) FROM users');
      console.log(`👥 Current users in database: ${userCount.rows[0].count}`);
    } else {
      console.log('⚠️ Users table does not exist - migrations may not have run');
    }
    
  } catch (error) {
    console.error('💥 Database connection failed:', error.message);
    console.error('Error details:', error);
  } finally {
    await client.end();
    console.log('🔚 Connection closed');
  }
}

testDatabaseConnection(); 