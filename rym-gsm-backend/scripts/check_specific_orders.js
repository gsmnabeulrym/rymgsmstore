const axios = require('axios');

const API_URL = 'https://www.rymgsm.com/api';

async function checkSpecificOrders() {
  try {
    console.log('🔐 Logging in as admin...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@rymgsm.com',
      password: 'password'
    });

    const token = loginRes.data.token;
    console.log('✅ Login successful!\n');

    // Get ALL orders to see the full data
    console.log('🔍 Fetching ALL orders...');
    const ordersRes = await axios.get(`${API_URL}/orders/admin/all?limit=20`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    console.log(`📋 Total orders: ${ordersRes.data.orders.length}\n`);

    // Focus on orders 6 and 8
    const problematicOrders = ordersRes.data.orders.filter(o => o.id === 6 || o.id === 8);
    
    console.log('🔍 Problematic orders from list:');
    problematicOrders.forEach(order => {
      console.log(`\nOrder #${order.id}:`);
      console.log(`  user_id: ${order.user_id}`);
      console.log(`  user_name: ${order.user_name}`);
      console.log(`  status: ${order.status}`);
      console.log(`  total: ${order.total}`);
      console.log(`  created_at: ${order.created_at}`);
      console.log(`  products type: ${typeof order.products}`);
      console.log(`  products: ${JSON.stringify(order.products).substring(0, 100)}...`);
    });

    // Now try to fetch them individually
    console.log('\n\n🔍 Trying to fetch individually...');
    for (const orderId of [6, 8]) {
      try {
        const detailRes = await axios.get(`${API_URL}/orders/${orderId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log(`✅ Order #${orderId}: SUCCESS`);
      } catch (err) {
        console.log(`❌ Order #${orderId}: ${err.response?.status} - ${err.response?.data?.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.response ? error.response.data : error.message);
  }
}

checkSpecificOrders();
