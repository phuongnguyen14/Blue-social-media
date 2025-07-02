#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Database Connection Debugger\n');

// Check environment variables
console.log('📋 Environment Variables Check:');
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
console.log(`DATABASE_URL: ${process.env.DATABASE_URL ? '✅ Set (hidden)' : '❌ NOT SET!'}`);

if (process.env.DATABASE_URL) {
  // Parse DATABASE_URL to check format
  try {
    const url = new URL(process.env.DATABASE_URL);
    console.log('📊 Database URL Analysis:');
    console.log(`   Protocol: ${url.protocol}`);
    console.log(`   Host: ${url.hostname}`);
    console.log(`   Port: ${url.port || 'default'}`);
    console.log(`   Database: ${url.pathname.slice(1)}`);
    console.log(`   Username: ${url.username}`);
    console.log(`   Password: ${url.password ? '***' : 'not set'}`);
  } catch (error) {
    console.log('❌ DATABASE_URL format error:', error.message);
  }
} else {
  console.log('⚠️  DATABASE_URL not found!');
}

// Check database config file
console.log('\n📋 Database Config Check:');
const configPath = path.join(__dirname, '..', 'src', 'config', 'database.config.ts');
if (fs.existsSync(configPath)) {
  console.log('✅ database.config.ts found');
  const configContent = fs.readFileSync(configPath, 'utf8');
  
  if (configContent.includes('DATABASE_URL')) {
    console.log('✅ DATABASE_URL support configured');
  } else {
    console.log('⚠️  DATABASE_URL support not found in config');
  }
  
  if (configContent.includes('ssl')) {
    console.log('✅ SSL configuration present');
  }
} else {
  console.log('❌ database.config.ts not found');
}

// Check Railway environment
console.log('\n📋 Railway Environment Check:');
if (process.env.RAILWAY_ENVIRONMENT) {
  console.log(`✅ Railway Environment: ${process.env.RAILWAY_ENVIRONMENT}`);
} else {
  console.log('⚠️  Not running on Railway (local development)');
}

if (process.env.RAILWAY_SERVICE_ID) {
  console.log(`✅ Railway Service ID: ${process.env.RAILWAY_SERVICE_ID}`);
} else {
  console.log('⚠️  Railway Service ID not found');
}

// Diagnosis và recommendations
console.log('\n🎯 Diagnosis:');

if (!process.env.DATABASE_URL) {
  console.log('❌ MAIN ISSUE: DATABASE_URL not set');
  console.log('\n🔧 SOLUTIONS:');
  console.log('1. Add PostgreSQL database on Railway:');
  console.log('   - Railway Dashboard → Project → "New" → "Database" → "Add PostgreSQL"');
  console.log('\n2. Set DATABASE_URL environment variable:');
  console.log('   - PostgreSQL service → "Connect" tab → Copy connection URL');
  console.log('   - Backend service → "Variables" tab → Add DATABASE_URL');
  console.log('\n3. Required environment variables:');
  console.log('   DATABASE_URL=postgresql://user:pass@host:port/db');
  console.log('   JWT_SECRET=your-secret-key');
  console.log('   NODE_ENV=production');
} else {
  console.log('✅ DATABASE_URL is set');
  console.log('\n🔧 TROUBLESHOOTING:');
  console.log('1. Check PostgreSQL service status on Railway');
  console.log('2. Verify DATABASE_URL format');
  console.log('3. Ensure PostgreSQL service is running');
  console.log('4. Check network connectivity');
}

console.log('\n📚 Quick Setup Commands:');
console.log('# Generate database setup instructions');
console.log('npm run database:setup');
console.log('\n# Validate Railway configuration');
console.log('npm run validate:railway');

console.log('\n🎯 Next Steps:');
if (!process.env.DATABASE_URL) {
  console.log('1. 🗄️  Add PostgreSQL database on Railway');
  console.log('2. 📋 Copy connection URL from PostgreSQL → Connect');
  console.log('3. ⚙️  Add DATABASE_URL to Backend service variables');
  console.log('4. 🔄 Railway will auto-redeploy');
  console.log('5. ✅ Database connection should work');
} else {
  console.log('1. 🔍 Check PostgreSQL service status on Railway');
  console.log('2. 🔄 Try manual redeploy if needed');
  console.log('3. 📊 Monitor deployment logs');
}

console.log('\n💡 Documentation:');
console.log('- Database setup: RAILWAY_POSTGRESQL_SETUP.md');
console.log('- Quick guide: RAILWAY_DB_QUICK_GUIDE.md');

console.log('\n🎉 Database debugging completed!'); 