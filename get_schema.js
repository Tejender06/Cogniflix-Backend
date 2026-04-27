/*
FILE: get_schema.js

PURPOSE:
Fetches and displays the current database schema.

FLOW:
Script Execution -> DB Connection -> Schema Query -> Console Output

USED BY:
Manual execution / Debugging

NEXT FLOW:
PostgreSQL Database

*/
const { Pool } = require('pg');
require('dotenv').config();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function run() {
    const res = await pool.query(`SELECT table_name, column_name, data_type FROM information_schema.columns WHERE table_name IN ('items', 'interactions');`);
    console.log(res.rows);
    process.exit(0);
}
run();
