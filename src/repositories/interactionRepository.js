const db = require("../config/db");

async function createInteraction(userId, itemId, type, rating = null, watchTime = null) {
  const result = await db.query(
    `INSERT INTO interactions (user_id, item_id, interaction_type, rating, watch_time)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [userId, itemId, type, rating, watchTime]
  );

  return result.rows[0];
}

async function updatePopularityScore(itemId, score) {
  const result = await db.query(
    `UPDATE items
     SET popularity_score = COALESCE(popularity_score, 0) + $1
     WHERE id = $2
     RETURNING *`,
    [score, itemId]
  );

  return result.rows[0];
}

module.exports = {
  createInteraction,
  updatePopularityScore,
};