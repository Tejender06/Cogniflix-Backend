const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.get("/", async (req, res) => {
  try {
    const moviesResult = await pool.query(
      `
      SELECT *
      FROM items
      ORDER BY popularity_score DESC
      `
    );

    res.json({
      movies: moviesResult.rows,
      total: moviesResult.rows.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch movies" });
  }
});

module.exports = router;