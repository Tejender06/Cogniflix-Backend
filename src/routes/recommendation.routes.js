/*
FILE: recommendation.routes.js

PURPOSE:
Defines API endpoints for fetching recommendations.

FLOW:
Client -> Routes -> Controller

USED BY:
app.js

NEXT FLOW:
recommendation.controller.js

*/
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const recommendationController = require("../controllers/recommendation.controller");

router.get("/", authMiddleware, recommendationController.getRecommendations);

module.exports = router;