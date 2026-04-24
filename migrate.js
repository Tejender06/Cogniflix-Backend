const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function migrate() {
  try {
    console.log("Starting migration...");
    
    // 1. Add content_type column to items
    await pool.query(`
      ALTER TABLE items 
      ADD COLUMN IF NOT EXISTS content_type VARCHAR(50) DEFAULT 'movie';
    `);
    console.log("Added content_type column to items.");

    // 2. Add unique constraint for 'save' interactions
    // Wait, since we may have duplicates already, we might need to delete them first before creating the unique index
    await pool.query(`
      DELETE FROM interactions i1
      USING interactions i2
      WHERE i1.id > i2.id
        AND i1.user_id = i2.user_id
        AND i1.item_id = i2.item_id
        AND i1.interaction_type = 'save'
        AND i2.interaction_type = 'save';
    `);
    console.log("Removed existing duplicate saves.");

    await pool.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS unique_user_item_save 
      ON interactions (user_id, item_id) 
      WHERE interaction_type = 'save';
    `);
    console.log("Added unique index unique_user_item_save.");

    console.log("Migration successful.");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

migrate();
