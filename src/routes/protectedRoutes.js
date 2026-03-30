const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const interactionRoutes = require("./interactionRoutes");

router.use(authMiddleware);
router.use("/interactions", interactionRoutes);

module.exports = router;