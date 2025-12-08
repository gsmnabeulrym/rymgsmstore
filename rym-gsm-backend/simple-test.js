const http = require('http');

function makeRequest(path, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: 'GET',
      headers: headers
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.end();
  });
}

async function testEndpoints() {
  console.log('🧪 Testing API endpoints...\n');

  try {
    // Test 1: Health check
    console.log('1️⃣ Testing health endpoint...');
    const health = await makeRequest('/api/health');
    console.log(`Status: ${health.statusCode}`);
    console.log(`Response: ${health.data}\n`);

    // Test 2: Test route
    console.log('2️⃣ Testing notification test route...');
    const test = await makeRequest('/api/notifications/test');
    console.log(`Status: ${test.statusCode}`);
    console.log(`Response: ${test.data}\n`);

    // Test 3: Main notification route (should fail with 401)
    console.log('3️⃣ Testing main notification route (no auth)...');
    const noAuth = await makeRequest('/api/notifications');
    console.log(`Status: ${noAuth.statusCode}`);
    console.log(`Response: ${noAuth.data}\n`);

    // Test 4: Login to get token
    console.log('4️⃣ Getting auth token...');
    const loginData = JSON.stringify({
      email: 'john@example.com',
      password: 'password'
    });

    const loginOptions = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(loginData)
      }
    };

    const loginResponse = await new Promise((resolve, reject) => {
      const req = http.request(loginOptions, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => resolve({ statusCode: res.statusCode, data }));
      });
      req.on('error', reject);
      req.write(loginData);
      req.end();
    });

    console.log(`Login Status: ${loginResponse.statusCode}`);
    
    if (loginResponse.statusCode === 200) {
      const loginResult = JSON.parse(loginResponse.data);
      const token = loginResult.token;
      console.log('✅ Got token');

      // Test 5: Notification route with auth
      console.log('\n5️⃣ Testing notification route with auth...');
      const withAuth = await makeRequest('/api/notifications', {
        'Authorization': `Bearer ${token}`
      });
      console.log(`Status: ${withAuth.statusCode}`);
      console.log(`Response: ${withAuth.data}`);
    } else {
      console.log('❌ Login failed:', loginResponse.data);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testEndpoints();
