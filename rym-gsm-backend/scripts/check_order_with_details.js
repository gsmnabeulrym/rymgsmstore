const axios = require('axios');

const API_URL = 'https://www.rymgsm.com/api';

async function checkOrderWithDetails() {
  try {
    console.log('🔐 Logging in as admin...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@rymgsm.com',
      password: 'password'
    });

    const token = loginRes.data.token;
    console.log('✅ Login successful!\n');

    // Try order 8 with full error details
    console.log('🔍 Fetching order #8 with full error details...');
    try {
      const detailRes = await axios.get(`${API_URL}/orders/8`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        validateStatus: () => true // Don't throw on any status
      });
      
      console.log(`Status: ${detailRes.status}`);
      console.log(`Response:`, JSON.stringify(detailRes.data, null, 2));
      console.log(`Headers:`, detailRes.headers);
      
    } catch (err) {
      console.error('Request error:', err.message);
    }

    // Also check if the route is even being hit
    console.log('\n🔍 Testing a working order (10) for comparison...');
    try {
      const detailRes = await axios.get(`${API_URL}/orders/10`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        validateStatus: () => true
      });
      
      console.log(`Status: ${detailRes.status}`);
      console.log(`Has order: ${!!detailRes.data.order}`);
      
    } catch (err) {
      console.error('Request error:', err.message);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkOrderWithDetails();
