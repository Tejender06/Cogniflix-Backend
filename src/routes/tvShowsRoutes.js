/*
FILE: tvShowsRoutes.js

PURPOSE:
Defines API endpoints for fetching TV show data.

FLOW:
Client -> Routes -> Controller

USED BY:
app.js

NEXT FLOW:
movie.controller.js

*/
const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.get("/", async (req, res) => {
  try {
    const { genre, emotion } = req.query;
    let query = `
      SELECT it.*, et.name as emotion_name 
      FROM items it 
      LEFT JOIN emotion_tags et ON it.emotion_tag_id = et.id
      WHERE it.content_type = 'tv'
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
      query += " AND " + conditions.join(" AND ");
    }

    query += " ORDER BY it.popularity_score DESC NULLS LAST LIMIT 100";

    const tvResult = await pool.query(query, values);

    res.json({
      movies: tvResult.rows, // Using 'movies' key so frontend component MovieGrid doesn't break
      total: tvResult.rows.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch tv shows" });
  }
});

module.exports = router;
