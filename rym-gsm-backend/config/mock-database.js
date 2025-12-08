// Mock database for development without MySQL
// This replaces the real database connection when using mock routes

const mockDatabase = {
  // Mock pool object that mimics mysql2 pool interface
  getConnection: (callback) => {
    // Simulate successful connection
    callback(null, {
      release: () => {},
      query: (sql, params, callback) => {
        // Mock query response
        callback(null, []);
      }
    });
  },
  
  query: (sql, params, callback) => {
    // Mock query response
    callback(null, []);
  },
  
  execute: (sql, params, callback) => {
    // Mock execute response
    callback(null, []);
  }
};

module.exports = mockDatabase;
