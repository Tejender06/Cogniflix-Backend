const express = require("express");
const router = express.Router();
const { fetchAndStoreMovies } = require("../services/movie.service");

router.get("/load-movies", async (req, res) => {
  try {
    await fetchAndStoreMovies();
    res.json({ message: "Movies loaded successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load movies" });
  }
});

module.exports = router;
