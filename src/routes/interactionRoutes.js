const express = require("express");
const router = express.Router();

const { addInteraction, getHistory } = require("../controllers/interactionController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, addInteraction);
router.get("/history", authMiddleware, getHistory);

module.exports = router;