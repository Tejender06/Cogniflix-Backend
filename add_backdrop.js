/*
FILE: add_backdrop.js

PURPOSE:
Utility script to fetch and update missing backdrop images for movies.

FLOW:
Script Execution -> Database -> TMDB API -> Database Update

USED BY:
Manual execution

NEXT FLOW:
TMDB API

*/
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
