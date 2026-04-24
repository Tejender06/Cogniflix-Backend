const express = require("express");
const router = express.Router();
const { fetchAndStoreMovies } = require("../services/movie.service");

router.get("/load-movies", async (req, res) => {
    await fetchAndStoreMovies();
    res.send("Movies loaded successfully");
});

module.exports = router;
