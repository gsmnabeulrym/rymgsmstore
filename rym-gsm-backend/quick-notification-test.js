const mysql = require('mysql2/promise');
const notificationService = require('./services/notificationService');

async function quickTest() {
  console.log('🚀 Quick Notification Test');
  
  try {
    // Create a test notification
    await notificationService.notifyNewProduct(
      12345, 
      'Quick Test Product', 
      'Test Brand', 
      199.99, 
      'phone'
    );
    
    console.log('✅ Notification created successfully!');
    console.log('📱 Check your frontend - you should see a new notification within 2 seconds');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

quickTest();
