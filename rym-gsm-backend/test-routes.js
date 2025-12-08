const express = require('express');

// Test if we can load the notification routes
try {
  console.log('🧪 Testing route loading...');
  
  const notificationRoutes = require('./routes/notifications');
  console.log('✅ Notification routes loaded successfully');
  console.log('📋 Route type:', typeof notificationRoutes);
  
  // Test if it's a valid Express router
  if (notificationRoutes && typeof notificationRoutes === 'function') {
    console.log('✅ Valid Express router detected');
  } else {
    console.log('❌ Invalid router - not a function');
  }
  
  // Try to create a simple Express app and mount the routes
  const app = express();
  app.use('/api/notifications', notificationRoutes);
  console.log('✅ Routes mounted successfully on test app');
  
  // List all registered routes
  console.log('\n📍 Registered routes:');
  app._router.stack.forEach((middleware, index) => {
    if (middleware.route) {
      console.log(`  ${index + 1}. ${Object.keys(middleware.route.methods).join(', ').toUpperCase()} ${middleware.route.path}`);
    } else if (middleware.name === 'router') {
      console.log(`  ${index + 1}. ROUTER mounted at: ${middleware.regexp}`);
      if (middleware.handle && middleware.handle.stack) {
        middleware.handle.stack.forEach((route, routeIndex) => {
          if (route.route) {
            console.log(`    ${routeIndex + 1}. ${Object.keys(route.route.methods).join(', ').toUpperCase()} ${route.route.path}`);
          }
        });
      }
    }
  });
  
} catch (error) {
  console.error('❌ Error loading notification routes:', error);
  console.error('Stack trace:', error.stack);
}

console.log('\n🔍 Testing complete');
