/*
FILE: scratch.js

PURPOSE:
Temporary scratchpad file for testing isolated logic.

FLOW:
Ad-hoc Execution -> Console Output

USED BY:
Developers

NEXT FLOW:
None

*/
require('dotenv').config();
const pool = require('./src/config/db');
Promise.all(['users', 'items', 'user_preferences', 'interactions'].map(t => 
  pool.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '${t}'`)
))
.then(res => {
  res.forEach((r, i) => console.log(['users', 'items', 'user_preferences', 'interactions'][i], r.rows));
  process.exit(0);
})
.catch(err => console.error(err));
