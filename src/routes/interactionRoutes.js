/*
FILE: interactionRoutes.js

PURPOSE:
Defines API endpoints for recording user interactions.

FLOW:
Client -> Routes -> Controller

USED BY:
app.js

NEXT FLOW:
interactionController.js

*/
const express = require("express");
const router = express.Router();

const interactionController = require("../controllers/interactionController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, interactionController.addInteraction);
router.get("/history", authMiddleware, interactionController.getHistory);
router.get("/saved", authMiddleware, interactionController.getSaved);
router.delete("/saved/:itemId", authMiddleware, interactionController.removeSaved);

module.exports = router;