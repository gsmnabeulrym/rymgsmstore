require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';
const DATABASE_URL = process.env.DATABASE_URL;

let pool;
let dbType;

if (DATABASE_URL) {
  // PostgreSQL (Render production)
  const { Pool } = require('pg');
  dbType = 'postgres';
  
  const pgPool = new Pool({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  pgPool.connect()
    .then(async () => {
      console.log('✅ Connected to PostgreSQL database (Render)');
      
      // Fix orders_status_check constraint to include 'confirmed'
      try {
        await pgPool.query(`
          ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
        `);
        await pgPool.query(`
          ALTER TABLE orders ADD CONSTRAINT orders_status_check 
          CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled'));
        `);
        console.log('✅ Fixed orders_status_check constraint');
      } catch (err) {
        console.log('ℹ️ orders_status_check constraint already correct or table not ready:', err.message);
      }
    })
    .catch(err => console.error('❌ PostgreSQL connection failed:', err.message));

  // Create a wrapper that provides MySQL-compatible interface
  pool = {
    async execute(sql, params = []) {
      // Convert MySQL ? placeholders to PostgreSQL $1, $2, etc.
      let paramIndex = 0;
      let pgSql = sql.replace(/\?/g, () => `$${++paramIndex}`);
      
      // For INSERT statements, add RETURNING id to get the insertId
      const isInsert = pgSql.trim().toUpperCase().startsWith('INSERT');
      if (isInsert && !pgSql.toUpperCase().includes('RETURNING')) {
        pgSql = pgSql.replace(/;?\s*$/, ' RETURNING id');
      }
      
      const result = await pgPool.query(pgSql, params);
      
      // Return in MySQL format [rows, fields]
      // For INSERT, provide insertId like MySQL does
      const fields = { 
        rowCount: result.rowCount, 
        command: result.command,
        affectedRows: result.rowCount
      };
      
      if (isInsert && result.rows.length > 0) {
        fields.insertId = result.rows[0].id;
      }
      
      return [result.rows, fields];
    },
    async query(sql, params = []) {
      let paramIndex = 0;
      let pgSql = sql.replace(/\?/g, () => `$${++paramIndex}`);
      
      const isInsert = pgSql.trim().toUpperCase().startsWith('INSERT');
      if (isInsert && !pgSql.toUpperCase().includes('RETURNING')) {
        pgSql = pgSql.replace(/;?\s*$/, ' RETURNING id');
      }
      
      const result = await pgPool.query(pgSql, params);
      
      const fields = { 
        rowCount: result.rowCount, 
        command: result.command,
        affectedRows: result.rowCount
      };
      
      if (isInsert && result.rows.length > 0) {
        fields.insertId = result.rows[0].id;
      }
      
      return [result.rows, fields];
    },
    // Expose raw pool for advanced operations
    _pgPool: pgPool
  };

} else {
  // MySQL (local development)
  const mysql = require('mysql2/promise');
  dbType = 'mysql';

  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'rym_gsm',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };

  pool = mysql.createPool(dbConfig);
  console.log('✅ Connected to MySQL database (Local)');
}

// Unified query function that works with both databases
// Returns just rows for simpler usage (not [rows, fields])
async function query(sql, params = []) {
  try {
    const [rows, fields] = await pool.execute(sql, params);
    // Attach metadata to the rows array for operations that need it
    if (fields) {
      rows.rowCount = fields.rowCount || 0;
      rows.affectedRows = fields.affectedRows || fields.rowCount || 0;
      rows.insertId = fields.insertId;
    }
    return rows;
  } catch (error) {
    console.error('Database query error:', error.message);
    throw error;
  }
}

// Get the raw pool for advanced operations
function getPool() {
  return pool;
}

// Get database type
function getDbType() {
  return dbType;
}

module.exports = { query, getPool, getDbType, pool };
