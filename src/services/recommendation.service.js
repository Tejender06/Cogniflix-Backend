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

    // Fetch basic candidate items (fallback strategy)
    const itemsRes = await db.query(`
      SELECT 
        id,
        title,
        genre,
        language,
        region,
        popularity_score
      FROM items
      ORDER BY popularity_score DESC NULLS LAST
      LIMIT 20
    `);

    const items = itemsRes.rows || [];

    if (items.length === 0) {
      return [];
    }

    // Minimal safe transformation (no undefined)
    const results = items.map((item) => ({
      id: item.id,
      title: item.title || '',
      genre: item.genre || '',
      language: item.language || '',
      region: item.region || '',
      popularity_score: item.popularity_score || 0
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