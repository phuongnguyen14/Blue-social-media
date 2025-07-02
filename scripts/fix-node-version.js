#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Node.js Version Fix Helper\n');

// Check current Node.js version
const nodeVersion = process.version;
console.log(`📌 Current Node.js version: ${nodeVersion}`);

// Read package.json
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Check if engines field exists
if (!packageJson.engines) {
  packageJson.engines = {};
}

// Set Node.js version requirement
const requiredNodeVersion = '>=20.11.0';
packageJson.engines.node = requiredNodeVersion;
packageJson.engines.npm = '>=9.0.0';

// Write back to package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log('✅ Updated package.json engines:');
console.log(`   node: ${requiredNodeVersion}`);
console.log(`   npm: >=9.0.0\n`);

console.log('📋 Files created/updated for Node.js 20:');
console.log('✅ .node-version - Specifies Node.js 20.11.0');
console.log('✅ nixpacks.toml - Configures Nixpacks to use Node.js 20');
console.log('✅ railway.json - Updated with better timeout');
console.log('✅ package.json - Added engines requirement\n');

console.log('🚀 Next steps:');
console.log('1. Commit và push changes lên GitHub');
console.log('2. Railway sẽ auto-redeploy với Node.js 20');
console.log('3. Check deployment logs để confirm Node.js 20 đang được used');
console.log('4. Verify no more engine warnings\n');

console.log('🧪 Test deployment:');
console.log('- Railway Dashboard → Your service → Deployments');
console.log('- Look for: "setup │ nodejs_20, npm-9_x" trong build logs');
console.log('- Verify: No more EBADENGINE warnings');
console.log('- Test API: curl https://your-app.railway.app/api/v1/auth/profile\n');

console.log('📖 Troubleshooting:');
console.log('- Nếu vẫn lỗi: Clear Railway build cache');
console.log('- Railway Dashboard → Service → Settings → Redeploy');
console.log('- Check nixpacks.toml có được Railway đọc không');

console.log('\n🎯 Node.js version fix completed!'); 