const express = require("express");
const router = express.Router();
const interactionController = require("../controllers/interactionController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", interactionController.addInteraction);

module.exports = router;