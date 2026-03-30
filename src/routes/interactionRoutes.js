const express = require("express");
const router = express.Router();
const interactionController = require("../controllers/interactionController");

router.post("/", interactionController.addInteraction);

module.exports = router;