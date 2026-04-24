const db = require('../config/db');

const getRecommendations = async (userId) => {
  const result = await db.query(
    `
    WITH user_genres AS (
      SELECT value FROM user_preferences
      WHERE user_id = $1 AND preference_type = 'GENRE'
    ),
    user_emotions AS (
      SELECT value FROM user_preferences
      WHERE user_id = $1 AND preference_type = 'EMOTION'
    )
    SELECT 
      i.*,

      CASE 
        WHEN i.genre IN (SELECT value FROM user_genres) THEN 1
        ELSE 0
      END AS genre_score,

      CASE 
        WHEN i.emotion_tag_id::text IN (SELECT value FROM user_emotions) THEN 1
        ELSE 0
      END AS emotion_score,

      (
        (CASE WHEN i.genre IN (SELECT value FROM user_genres) THEN 1 ELSE 0 END * 0.4) +
        (CASE WHEN i.emotion_tag_id::text IN (SELECT value FROM user_emotions) THEN 1 ELSE 0 END * 0.3) +
        (COALESCE(i.popularity_score, 0) * 0.3)
      ) AS final_score

    FROM items i
    ORDER BY final_score DESC
    LIMIT 20;
    `,
    [userId]
  );

  return result.rows;
};

const getFallbackRecommendations = async () => {
  const result = await db.query(
    `
    SELECT *
    FROM items
    ORDER BY popularity_score DESC
    LIMIT 20;
    `
  );

  return result.rows;
};

module.exports = {
  getRecommendations,
  getFallbackRecommendations
};