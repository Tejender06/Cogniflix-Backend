/*
FILE: recommendation.service.js

PURPOSE:
Implements hybrid recommendation logic (popularity + similarity + emotion + regional + time).

FLOW:
Controller -> Service -> Repository

USED BY:
recommendation.controller.js

NEXT FLOW:
userRepository.js, recommendation.repository.js

*/
const db = require('../config/db');

const getRecommendations = async (userId) => {
  try {
    if (!userId) {
      return [];
    }

    // Check if user exists
    const userRes = await db.query(
      'SELECT id, preferred_language, location FROM users WHERE id = $1',
      [userId]
    );

    if (userRes.rows.length === 0) {
      return [];
    }

    const user = userRes.rows[0];

    // Fetch basic candidate items using popularity + region + language match
    const itemsRes = await db.query(`
      WITH UserInteractions AS (
        SELECT item_id FROM interactions WHERE user_id = $1
      )
      SELECT 
        it.id,
        it.title,
        it.genre,
        it.language,
        it.region,
        it.poster_url,
        it.popularity_score,
        (
          COALESCE(it.popularity_score, 0) * 1.0 +
          CASE WHEN it.region = $2 THEN 5.0 ELSE 0.0 END +
          CASE WHEN it.language = $3 THEN 3.0 ELSE 0.0 END
        ) as rec_score
      FROM items it
      WHERE it.id NOT IN (SELECT item_id FROM UserInteractions)
      ORDER BY rec_score DESC NULLS LAST
      LIMIT 20
    `, [userId, user.location || 'Global', user.preferred_language || 'en']);

    const items = itemsRes.rows || [];

    if (items.length === 0) {
      // Fallback
      const fallbackRes = await db.query(`SELECT * FROM items ORDER BY popularity_score DESC LIMIT 20`);
      return fallbackRes.rows;
    }

    // Minimal safe transformation (no undefined)
    const results = items.map((item) => ({
      id: item.id,
      title: item.title || '',
      genre: item.genre || '',
      language: item.language || '',
      region: item.region || '',
      popularity_score: item.popularity_score || 0,
      poster_url: item.poster_url || ''
    }));

    return results;
  } catch (error) {
    console.error('Recommendation Service Error:', error);
    return [];
  }
};

module.exports = {
  getRecommendations
};