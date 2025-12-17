const axios = require('axios');

const API_URL = 'https://www.rymgsm.com/api';

async function checkOrderDetail() {
  try {
    console.log('🔐 Logging in as admin...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@rymgsm.com',
      password: 'password'
    });

    const token = loginRes.data.token;
    console.log('✅ Login successful!');

    // Get orders list first
    console.log('\n🔍 Fetching orders list...');
    const ordersRes = await axios.get(`${API_URL}/orders/admin/all?limit=5`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const orderIds = ordersRes.data.orders.map(o => o.id);
    console.log('📋 Order IDs:', orderIds);

    // Try to fetch each order detail
    for (const orderId of orderIds) {
      console.log(`\n🔍 Fetching order #${orderId}...`);
      try {
        const detailRes = await axios.get(`${API_URL}/orders/${orderId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log(`✅ Order #${orderId}: success=${detailRes.data.success}, has order=${!!detailRes.data.order}`);
      } catch (err) {
        console.log(`❌ Order #${orderId}: ${err.response?.status} - ${err.response?.data?.message || err.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.response ? error.response.data : error.message);
  }
}

checkOrderDetail();
