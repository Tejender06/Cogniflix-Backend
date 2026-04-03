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

module.exports = { addInteraction };