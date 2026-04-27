/*
FILE: check_schema_nossl.js

PURPOSE:
Verifies the database schema without using SSL connection.

FLOW:
Script Execution -> DB Connection -> Schema Query -> Console Output

USED BY:
Manual execution / Deployment checks

NEXT FLOW:
PostgreSQL Database

*/
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
});

async function check() {
  try {
    const res = await pool.query("SELECT * FROM items LIMIT 1");
    if (res.rows.length > 0) {
      console.log("Columns:", Object.keys(res.rows[0]));
      console.log("Sample row:", JSON.stringify(res.rows[0], null, 2));
    } else {
      console.log("No rows found in items table.");
      // Check column names from information_schema
      const cols = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'items'");
      console.log("Column names from schema:", cols.rows.map(r => r.column_name));
    }
    process.exit(0);
  } catch (err) {
    console.error("Error connecting to DB:", err.message);
    process.exit(1);
  }
}

check();
