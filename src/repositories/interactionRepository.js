const pool = require("../config/db");

async function addInteraction({ user_id, item_id, interaction_type, score }) {
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

module.exports = { addInteraction, getHistory };