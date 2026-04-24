const { Pool } = require('pg'); 
require('dotenv').config(); 
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL, 
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false 
}); 
pool.query('ALTER TABLE items ADD COLUMN IF NOT EXISTS backdrop_url TEXT;')
  .then(() => { 
    console.log('Column added'); 
    process.exit(0); 
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
