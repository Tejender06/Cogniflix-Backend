const express = require("express");
const router = express.Router();

const { addInteraction } = require("../controllers/interactionController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, addInteraction);

module.exports = router;