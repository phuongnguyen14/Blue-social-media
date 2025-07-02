#!/usr/bin/env node

// 🧪 Test Current Backend API Endpoints
// Usage: node test-current-api.js

const https = require('https');

const API_BASE_URL = 'https://blue-social-media-production.up.railway.app/api/v1';

console.log('🔍 CHECKING BACKEND API ENDPOINTS...\n');
console.log(`📡 Base URL: ${API_BASE_URL}\n`);

async function testEndpoint(endpoint, method = 'GET', data = null, expectStatus = [200, 401, 404]) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint, API_BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'BlueSocialMedia-Backend-Test/1.0'
      }
    };

    if (data && method !== 'GET') {
      const jsonData = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(jsonData);
    }

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const jsonBody = body ? JSON.parse(body) : {};
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: jsonBody
          });
        } catch {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: body
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (data && method !== 'GET') {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function runTests() {
  const tests = [
    {
      name: '🏠 Root Endpoint',
      endpoint: '/',
      description: 'Should return "Hello World!"',
      expectedStatus: [200]
    },
    {
      name: '🔐 Auth Profile (No Token)',
      endpoint: '/auth/profile',
      description: 'Should return 401 Unauthorized',
      expectedStatus: [401]
    },
    {
      name: '👥 Users Search',
      endpoint: '/users/search',
      description: 'Should return users list or empty',
      expectedStatus: [200]
    },
    {
      name: '🎬 Videos List',
      endpoint: '/videos',
      description: 'Should return videos list or empty',
      expectedStatus: [200]
    },
    {
      name: '🎬 Videos Trending',
      endpoint: '/videos/trending',
      description: 'Should return trending videos',
      expectedStatus: [200]
    },
    {
      name: '📚 Swagger Docs',
      endpoint: '../docs',
      description: 'Should return Swagger documentation',
      expectedStatus: [200, 301, 302]
    }
  ];

  let successCount = 0;
  let failCount = 0;

  for (const test of tests) {
    process.stdout.write(`${test.name}... `);
    
    try {
      const result = await testEndpoint(test.endpoint, 'GET', null, test.expectedStatus);
      
      if (test.expectedStatus.includes(result.status)) {
        console.log(`✅ PASS (${result.status})`);
        
        // Show response preview
        if (result.body && typeof result.body === 'object') {
          const preview = JSON.stringify(result.body).substring(0, 80);
          console.log(`   Response: ${preview}...`);
        } else if (typeof result.body === 'string' && result.body.length < 50) {
          console.log(`   Response: "${result.body}"`);
        }
        
        successCount++;
      } else {
        console.log(`⚠️  UNEXPECTED (${result.status})`);
        console.log(`   Expected: ${test.expectedStatus.join(' or ')}`);
        console.log(`   Got: ${result.status}`);
        
        if (result.body) {
          const preview = JSON.stringify(result.body).substring(0, 100);
          console.log(`   Response: ${preview}...`);
        }
        
        failCount++;
      }
      
    } catch (error) {
      console.log(`❌ FAIL`);
      failCount++;
      
      if (error.code === 'ENOTFOUND') {
        console.log(`   Error: Domain not found`);
        console.log(`   💡 Check if Railway backend is deployed`);
      } else if (error.code === 'ECONNREFUSED') {
        console.log(`   Error: Connection refused`);
        console.log(`   💡 Backend service might be down`);
      } else if (error.message === 'Request timeout') {
        console.log(`   Error: Request timeout`);
        console.log(`   💡 Backend might be slow or down`);
      } else {
        console.log(`   Error: ${error.message}`);
      }
    }
    
    console.log(''); // Empty line for readability
  }

  console.log(`📊 Test Results: ${successCount} passed, ${failCount} failed\n`);

  if (successCount > 0) {
    console.log('🎉 BACKEND IS RESPONDING!');
    console.log('✅ Some endpoints are working');
    
    if (failCount === 0) {
      console.log('✅ All API endpoints working perfectly!');
      console.log('\n🚀 Ready for Frontend connection:');
      console.log('1. Create .env file in Frontend with API URL');
      console.log('2. Start Frontend: npm start');
      console.log('3. Test register/login in app');
    } else {
      console.log('\n⚠️  Some endpoints have issues - might be normal:');
      console.log('💡 401 errors for auth endpoints = normal');
      console.log('💡 Database connection issues need to be fixed');
    }
    
  } else {
    console.log('❌ BACKEND NOT RESPONDING');
    console.log('💡 Possible issues:');
    console.log('   - Railway deployment failed');
    console.log('   - Database connection error');
    console.log('   - Environment variables not set');
    console.log('\n🔧 Next steps:');
    console.log('1. Check Railway deployment logs');
    console.log('2. Setup PostgreSQL database');
    console.log('3. Configure environment variables');
  }
}

runTests().catch(console.error); 