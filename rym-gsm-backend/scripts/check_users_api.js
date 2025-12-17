const axios = require('axios');

const API_URL = 'https://www.rymgsm.com/api';

async function checkUsers() {
  try {
    console.log('🔐 Logging in as admin...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@rymgsm.com',
      password: 'password'
    });

    const token = loginRes.data.token;
    console.log('✅ Login successful!');
    console.log('👤 Admin user data:', loginRes.data.user);

    // Try to get orders to see the raw response
    console.log('\n🔍 Fetching admin orders...');
    const ordersRes = await axios.get(`${API_URL}/orders/admin/all?limit=3`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    console.log('\n📋 Orders response:');
    ordersRes.data.orders.forEach(order => {
      console.log(`Order #${order.id}:`);
      console.log(`  user_id: ${order.user_id}`);
      console.log(`  user_name: "${order.user_name}"`);
      console.log(`  user_email: "${order.user_email}"`);
      console.log('---');
    });

  } catch (error) {
    console.error('❌ Error:', error.response ? error.response.data : error.message);
  }
}

checkUsers();
