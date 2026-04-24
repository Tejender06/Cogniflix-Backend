import pool from "../config/db.js";

export const getMovies = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, title, poster_url, genre, language
      FROM items
      WHERE poster_url IS NOT NULL
      ORDER BY popularity_score DESC
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movies" });
  }
};