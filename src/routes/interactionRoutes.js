const express = require("express");
const { addInteraction } = require("../controllers/interactionController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, addInteraction);

module.exports = router;