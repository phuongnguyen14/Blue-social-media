#!/usr/bin/env node

const crypto = require('crypto');

console.log('🗄️ Railway PostgreSQL Setup Helper\n');

// Generate JWT Secret if needed
const jwtSecret = crypto.randomBytes(64).toString('hex');

console.log('📋 Environment Variables cho Railway Backend Service:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('NODE_ENV=production');
console.log('DATABASE_URL=postgresql://postgres:password@hostname:5432/railway  # Copy từ Railway PostgreSQL Connect tab');
console.log(`JWT_SECRET=${jwtSecret}`);
console.log('JWT_EXPIRES_IN=24h');
console.log('PORT=3000');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('🔧 Các bước setup PostgreSQL trên Railway:');
console.log('1. Vào Railway dashboard → project của bạn');
console.log('2. Click "New" → "Database" → "Add PostgreSQL"');
console.log('3. Đợi PostgreSQL service deploy xong (1-2 phút)');
console.log('4. Click vào PostgreSQL service → tab "Connect"');
console.log('5. Copy "Postgres Connection URL"');
console.log('6. Vào Backend service → tab "Variables"');
console.log('7. Add environment variables ở trên');
console.log('8. Backend sẽ auto redeploy với database connection\n');

console.log('🧪 Test Database Connection:');
console.log('- Check Backend logs: Railway Dashboard → Backend service → Logs');
console.log('- Look for: "💾 Database: Connected"');
console.log('- Test API: curl https://your-app.railway.app/api/v1/auth/profile');
console.log('- Expected: {"message":"Unauthorized","statusCode":401}\n');

console.log('🎯 Database Features Railway cung cấp:');
console.log('✅ Auto SSL/TLS encryption');
console.log('✅ Daily automatic backups');
console.log('✅ Web-based admin panel');
console.log('✅ Monitoring & metrics');
console.log('✅ 1GB storage (free tier)');
console.log('✅ 20 concurrent connections');
console.log('✅ Point-in-time recovery\n');

console.log('📊 Monitoring Database:');
console.log('- Railway Dashboard → PostgreSQL service → "Metrics" tab');
console.log('- Railway Dashboard → "Usage" tab cho overall usage');
console.log('- Database admin panel: PostgreSQL service → "Data" tab\n');

console.log('🔍 SQL Commands để test:');
console.log('-- List all tables');
console.log('\\dt');
console.log('');
console.log('-- Check users table (after first register)');
console.log('SELECT * FROM "user" LIMIT 5;');
console.log('');
console.log('-- Database size');
console.log('SELECT pg_size_pretty(pg_database_size(current_database()));');
console.log('');
console.log('-- Active connections');
console.log('SELECT count(*) FROM pg_stat_activity;\n');

console.log('📖 Chi tiết: đọc file RAILWAY_POSTGRESQL_SETUP.md');
console.log('🚀 Ready để setup PostgreSQL database trên Railway!'); 