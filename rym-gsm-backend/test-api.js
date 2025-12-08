const axios = require('axios');

async function testNotificationAPI() {
  console.log('🧪 Testing Notification API...\n');
  
  try {
    // Test 1: Health check
    console.log('1️⃣ Testing health endpoint...');
    const healthResponse = await axios.get('http://localhost:5000/api/health');
    console.log('✅ Health check passed:', healthResponse.status);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
    return;
  }
  
  try {
    // Test 2: Notification endpoint without auth
    console.log('\n2️⃣ Testing notification endpoint without auth...');
    const noAuthResponse = await axios.get('http://localhost:5000/api/notifications');
    console.log('❌ Should have failed but got:', noAuthResponse.status);
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ Correctly returned 401 (Unauthorized)');
    } else if (error.response?.status === 404) {
      console.log('❌ Got 404 - Route not found!');
    } else {
      console.log('❌ Unexpected error:', error.response?.status, error.message);
    }
  }
  
  try {
    // Test 3: Get a valid token first
    console.log('\n3️⃣ Getting auth token...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'john@example.com',
      password: 'password'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Got auth token');
    
    // Test 4: Notification endpoint with auth
    console.log('\n4️⃣ Testing notification endpoint with auth...');
    const authResponse = await axios.get('http://localhost:5000/api/notifications', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Notification API working! Status:', authResponse.status);
    console.log('📊 Response data:', JSON.stringify(authResponse.data, null, 2));
    
  } catch (error) {
    console.log('❌ Auth test failed:', error.response?.status, error.message);
    if (error.response?.data) {
      console.log('📄 Error details:', error.response.data);
    }
  }
}

testNotificationAPI();
