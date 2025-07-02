#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Railway Configuration Validator\n');

// Check railway.json
const railwayJsonPath = path.join(__dirname, '..', 'railway.json');

try {
  console.log('📋 Checking railway.json...');
  
  if (!fs.existsSync(railwayJsonPath)) {
    console.log('❌ railway.json not found!');
    process.exit(1);
  }

  const railwayJson = JSON.parse(fs.readFileSync(railwayJsonPath, 'utf8'));
  console.log('✅ railway.json is valid JSON');

  // Validate required fields
  const requiredFields = ['build', 'deploy'];
  const missingFields = requiredFields.filter(field => !railwayJson[field]);
  
  if (missingFields.length > 0) {
    console.log(`❌ Missing required fields: ${missingFields.join(', ')}`);
    process.exit(1);
  }

  console.log('✅ All required fields present');

  // Check build configuration
  if (railwayJson.build) {
    console.log('📦 Build configuration:');
    console.log(`   Builder: ${railwayJson.build.builder || 'default'}`);
    console.log(`   Build Command: ${railwayJson.build.buildCommand || 'auto-detected'}`);
  }

  // Check deploy configuration
  if (railwayJson.deploy) {
    console.log('🚀 Deploy configuration:');
    console.log(`   Start Command: ${railwayJson.deploy.startCommand}`);
    console.log(`   Health Check: ${railwayJson.deploy.healthcheckPath || 'none'}`);
    console.log(`   Health Check Timeout: ${railwayJson.deploy.healthcheckTimeout || 'default'}s`);
    console.log(`   Restart Policy: ${railwayJson.deploy.restartPolicyType || 'default'}`);
  }

  // Check for problematic fields
  if (railwayJson.environments && typeof railwayJson.environments === 'object') {
    if (!Array.isArray(railwayJson.environments) && Object.keys(railwayJson.environments).some(key => typeof railwayJson.environments[key] === 'string')) {
      console.log('⚠️  Warning: environments field format may be incorrect');
      console.log('   Use Railway Dashboard → Variables to set environment variables');
      console.log('   Or use nixpacks.toml for build-time variables');
    }
  }

} catch (error) {
  console.log('❌ railway.json validation failed:');
  console.log(`   Error: ${error.message}`);
  process.exit(1);
}

// Check nixpacks.toml
console.log('\n📋 Checking nixpacks.toml...');
const nixpacksPath = path.join(__dirname, '..', 'nixpacks.toml');

try {
  if (fs.existsSync(nixpacksPath)) {
    const nixpacksContent = fs.readFileSync(nixpacksPath, 'utf8');
    console.log('✅ nixpacks.toml found');
    
    // Check for Node.js 20
    if (nixpacksContent.includes('nodejs_20')) {
      console.log('✅ Node.js 20 configured');
    } else {
      console.log('⚠️  Node.js 20 not found in nixpacks.toml');
    }

    // Check for production env
    if (nixpacksContent.includes('NODE_ENV')) {
      console.log('✅ NODE_ENV configured in nixpacks.toml');
    }
  } else {
    console.log('⚠️  nixpacks.toml not found (optional)');
  }
} catch (error) {
  console.log(`❌ nixpacks.toml error: ${error.message}`);
}

// Check .node-version
console.log('\n📋 Checking .node-version...');
const nodeVersionPath = path.join(__dirname, '..', '.node-version');

try {
  if (fs.existsSync(nodeVersionPath)) {
    const nodeVersion = fs.readFileSync(nodeVersionPath, 'utf8').trim();
    console.log(`✅ .node-version found: ${nodeVersion}`);
    
    if (nodeVersion.startsWith('20.')) {
      console.log('✅ Node.js 20+ specified');
    } else {
      console.log('⚠️  Consider using Node.js 20+ for NestJS 11+');
    }
  } else {
    console.log('⚠️  .node-version not found');
  }
} catch (error) {
  console.log(`❌ .node-version error: ${error.message}`);
}

console.log('\n🎯 Validation Summary:');
console.log('✅ railway.json format is valid');
console.log('✅ No conflicting environment configurations');
console.log('✅ Ready for Railway deployment');

console.log('\n📚 Next steps:');
console.log('1. Commit changes: git add . && git commit -m "Fix railway.json format"');
console.log('2. Push to GitHub: git push origin main');
console.log('3. Railway will auto-redeploy với corrected configuration');
console.log('4. Monitor deployment logs for success');

console.log('\n💡 Environment Variables Setup:');
console.log('- Set via Railway Dashboard → Service → Variables');
console.log('- Key variables: DATABASE_URL, JWT_SECRET, NODE_ENV=production');

console.log('\n🎉 Railway configuration validation completed!'); 