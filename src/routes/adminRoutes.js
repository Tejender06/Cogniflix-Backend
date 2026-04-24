const express = require("express");
const router = express.Router();
const { fetchAndStoreMovies, fetchAndStoreTvShows } = require("../services/movie.service");

router.get("/load-movies", async (req, res) => {
    await fetchAndStoreMovies();
    res.send("Movies loaded successfully");
});

router.get("/load-tv", async (req, res) => {
    await fetchAndStoreTvShows();
    res.send("TV Shows loaded successfully");
});

module.exports = router;
