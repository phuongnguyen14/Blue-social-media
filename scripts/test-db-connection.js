#!/usr/bin/env node

// 🧪 Test Database Connection Script
// Usage: node scripts/test-db-connection.js

require('dotenv').config();
const { Client } = require('pg');

async function testConnection() {
  console.log('🧪 Testing Database Connection...\n');
  
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.log('❌ DATABASE_URL not found in environment variables');
    console.log('💡 Set DATABASE_URL in .env file or Railway Variables');
    return;
  }

  console.log('📋 Database URL Info:');
  try {
    const url = new URL(databaseUrl);
    console.log(`   Host: ${url.hostname}`);
    console.log(`   Port: ${url.port || 5432}`);
    console.log(`   Database: ${url.pathname.slice(1)}`);
    console.log(`   Username: ${url.username}`);
    console.log(`   SSL: ${url.searchParams.get('sslmode') || 'default'}\n`);
  } catch (error) {
    console.log(`   Raw URL: ${databaseUrl.replace(/password[^@]+/, 'password:***')}\n`);
  }

  const client = new Client({
    connectionString: databaseUrl,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected successfully!');

    console.log('\n📊 Database Info:');
    const versionResult = await client.query('SELECT version()');
    console.log(`   PostgreSQL: ${versionResult.rows[0].version.split(' ')[1]}`);

    const dbSizeResult = await client.query(`
      SELECT pg_size_pretty(pg_database_size(current_database())) as size
    `);
    console.log(`   Size: ${dbSizeResult.rows[0].size}`);

    const tablesResult = await client.query(`
      SELECT tablename FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename
    `);
    console.log(`   Tables: ${tablesResult.rows.length} found`);
    
    if (tablesResult.rows.length > 0) {
      console.log('   📋 Table List:');
      tablesResult.rows.forEach(row => {
        console.log(`      - ${row.tablename}`);
      });
    }

    console.log('\n🎉 Database connection test successful!');
    
  } catch (error) {
    console.log('❌ Connection failed:');
    console.log(`   Error: ${error.message}`);
    
    if (error.code === 'ENOTFOUND') {
      console.log('💡 Check if hostname is correct');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('💡 Check if port is correct and database is running');
    } else if (error.message.includes('database') && error.message.includes('does not exist')) {
      console.log('💡 Database does not exist - check database name');
    } else if (error.message.includes('password authentication failed')) {
      console.log('💡 Check username/password');
    }
    
  } finally {
    await client.end();
  }
}

testConnection().catch(console.error); 