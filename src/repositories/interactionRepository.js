const pool = require("../config/db");

async function addInteraction({ user_id, item_id, interaction_type, score }) {
  // Prevent duplicate likes or rates per movie for a user
  if (interaction_type === 'like' || interaction_type === 'rate') {
    const existing = await pool.query(
      `SELECT * FROM interactions WHERE user_id = $1 AND item_id = $2 AND interaction_type = $3`,
      [user_id, item_id, interaction_type]
    );
    if (existing.rows.length > 0) {
      return existing.rows[0]; // Return the existing record instead of duplicating
    }
  }

  const result = await pool.query(
    `INSERT INTO interactions (user_id, item_id, interaction_type, score)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [user_id, item_id, interaction_type, score]
  );

  return result.rows[0];
}

async function getHistory(user_id) {
  const result = await pool.query(
    `SELECT i.item_id as id, i.interaction_type, i.created_at, it.title, it.poster_url
     FROM interactions i
     JOIN items it ON i.item_id = it.id
     WHERE i.user_id = $1 AND i.interaction_type = 'watch'
     ORDER BY i.created_at DESC
     LIMIT 20`,
    [user_id]
  );
  return result.rows;
}

async function getSaved(user_id) {
  const result = await pool.query(
    `SELECT it.*
     FROM interactions i
     JOIN items it ON i.item_id = it.id
     WHERE i.user_id = $1 AND i.interaction_type = 'save'
     ORDER BY i.created_at DESC`,
    [user_id]
  );
  return result.rows;
}

async function removeInteraction(user_id, item_id, interaction_type) {
  const result = await pool.query(
    `DELETE FROM interactions
     WHERE user_id = $1 AND item_id = $2 AND interaction_type = $3
     RETURNING *`,
    [user_id, item_id, interaction_type]
  );
  return result.rowCount > 0;
}

module.exports = { addInteraction, getHistory, getSaved, removeInteraction };