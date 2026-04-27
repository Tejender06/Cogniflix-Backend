/*
FILE: adminRoutes.js

PURPOSE:
Defines API endpoints for administrative actions.

FLOW:
Client -> Routes -> Controller

USED BY:
app.js

NEXT FLOW:
adminController.js

*/
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
