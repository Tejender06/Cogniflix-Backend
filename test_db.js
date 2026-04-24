require('dotenv').config();
const pool = require('./src/config/db');
async function run() {
  try {
    const res = await pool.query(`SELECT table_name, column_name, data_type FROM information_schema.columns WHERE table_schema = 'public'`);
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}
run();
