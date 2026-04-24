const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.get("/trending", async (req, res) => {
  try {
    const trendingResult = await pool.query(
      `
      SELECT it.*, COUNT(i.id) as interaction_count
      FROM items it
      LEFT JOIN interactions i ON it.id = i.item_id
      GROUP BY it.id
      ORDER BY interaction_count DESC, it.popularity_score DESC
      LIMIT 20
      `
    );
    res.json({ movies: trendingResult.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch trending movies" });
  }
});

router.get("/", async (req, res) => {
  try {
    const { genre, emotion } = req.query;
    let query = `
      SELECT it.*, et.name as emotion_name 
      FROM items it 
      LEFT JOIN emotion_tags et ON it.emotion_tag_id = et.id
    `;
    const values = [];
    const conditions = [];

    if (genre) {
      values.push(`%${genre}%`);
      conditions.push(`it.genre ILIKE $${values.length}`);
    }
    if (emotion) {
      values.push(`%${emotion}%`);
      conditions.push(`et.name ILIKE $${values.length}`);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY it.popularity_score DESC LIMIT 50";

    const moviesResult = await pool.query(query, values);

    res.json({
      movies: moviesResult.rows,
      total: moviesResult.rows.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch movies" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const movieResult = await pool.query(
      `
      SELECT it.*, et.name as emotion_name 
      FROM items it 
      LEFT JOIN emotion_tags et ON it.emotion_tag_id = et.id
      WHERE it.id = $1
      `,
      [id]
    );

    if (movieResult.rows.length === 0) {
      return res.status(404).json({ error: "Movie not found" });
    }

    res.json({ movie: movieResult.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch movie details" });
  }
});

module.exports = router;