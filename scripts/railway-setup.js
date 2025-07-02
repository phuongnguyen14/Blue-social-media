#!/usr/bin/env node

const crypto = require('crypto');
const { execSync } = require('child_process');

console.log('🚀 Railway Deployment Setup Helper\n');

// Generate JWT Secret
console.log('🔐 JWT Secret:');
const jwtSecret = crypto.randomBytes(64).toString('hex');
console.log(`JWT_SECRET=${jwtSecret}\n`);

// Environment Variables Template
console.log('📋 Environment Variables để copy vào Railway:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('NODE_ENV=production');
console.log('DATABASE_URL=postgresql://user:pass@host:port/db  # Copy từ Railway PostgreSQL');
console.log(`JWT_SECRET=${jwtSecret}`);
console.log('JWT_EXPIRES_IN=24h');
console.log('PORT=3000');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Test Production Build
console.log('🧪 Testing production build locally...');
try {
  console.log('📦 Building...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('✅ Build successful!');
  console.log('💡 To test production locally:');
  console.log('   NODE_ENV=production npm run start:prod');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  console.log('💡 Fix build errors before deploying to Railway');
}

console.log('\n📚 Next steps:');
console.log('1. Commit và push code lên GitHub');
console.log('2. Tạo Railway project từ GitHub repo');
console.log('3. Add PostgreSQL database');
console.log('4. Copy environment variables ở trên vào Railway');
console.log('5. Deploy và test!');

console.log('\n📖 Chi tiết: đọc file RAILWAY_DEPLOY.md'); 