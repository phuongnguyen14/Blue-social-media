#!/usr/bin/env node

// 🧪 Quick Test After Railway Deploy Fix
// Usage: node test-after-fix.js

const https = require('https');
const API_BASE_URL = 'https://blue-social-media-production.up.railway.app/api/v1';

console.log('🔥 TESTING BACKEND AFTER DEPLOY FIX...\n');

async function quickTest() {
  console.log('1. Testing Healthcheck Endpoint...');
  try {
    const response = await testEndpoint('/');
    if (response.status === 200 && response.body === 'Hello World!') {
      console.log('   ✅ PASS: Root endpoint returns 200 "Hello World!"');
    } else {
      console.log('   ❌ FAIL: Unexpected response', response);
    }
  } catch (error) {
    console.log('   ❌ FAIL:', error.message);
  }

  console.log('\n2. Testing Protected Endpoint...');
  try {
    const response = await testEndpoint('/auth/profile');
    if (response.status === 401) {
      console.log('   ✅ PASS: Auth endpoint returns 401 (correct)');
    } else {
      console.log('   ❌ UNEXPECTED:', response.status);
    }
  } catch (error) {
    console.log('   ❌ FAIL:', error.message);
  }

  console.log('\n3. Testing Video Endpoints...');
  try {
    const response = await testEndpoint('/videos');
    if (response.status === 200) {
      console.log('   ✅ PASS: Videos endpoint returns 200');
    } else {
      console.log('   ❌ UNEXPECTED:', response.status);
    }
  } catch (error) {
    console.log('   ❌ FAIL:', error.message);
  }

  console.log('\n🎯 SUMMARY:');
  console.log('If all tests PASS:');
  console.log('✅ Backend is fully operational');
  console.log('✅ Ready for Frontend connection');
  console.log('✅ Create .env in Frontend and start app!');
}

function testEndpoint(path) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_BASE_URL);
    const req = https.request(url, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const jsonBody = body ? JSON.parse(body) : body;
          resolve({ status: res.statusCode, body: jsonBody });
        } catch {
          resolve({ status: res.statusCode, body: body });
        }
      });
    });
    
    req.on('error', reject);
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
    
    req.end();
  });
}

quickTest().catch(console.error); 