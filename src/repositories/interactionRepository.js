const db = require("../config/db");

async function createInteraction(
  userId,
  itemId,
  type,
  rating = null,
  watchTime = null,
) {
  const query = `
    INSERT INTO interactions (user_id, item_id, interaction_type, rating, watch_time)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;

  const values = [userId, itemId, type, rating, watchTime];

  const result = await db.query(query, values);
  return result.rows[0];
}

async function updatePopularityScore(itemId, score) {
  const query = `
    UPDATE items
    SET popularity_score = COALESCE(popularity_score, 0) + $1
    WHERE id = $2
    RETURNING *;
  `;

  const result = await db.query(query, [score, itemId]);
  return result.rows[0];
}

module.exports = {
  createInteraction,
  updatePopularityScore,
};
