/*
FILE: db.js

PURPOSE:
Creates PostgreSQL connection pool.

FLOW:
Backend -> DB Connection -> Query Execution

USED BY:
Repositories

NEXT FLOW:
Database queries

*/
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

module.exports = pool;
