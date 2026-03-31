const db = require("../config/db");

async function addInteraction({ user_id, content_id, interaction_type, score }) {
  const query = `
    INSERT INTO interactions (user_id, content_id, interaction_type, score)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  const values = [user_id, content_id, interaction_type, score];

  const result = await db.query(query, values);

  return result.rows[0];
}

module.exports = { addInteraction };