/*
FILE: protectedRoutes.js

PURPOSE:
Defines a generic set of protected endpoints.

FLOW:
Client -> Middleware -> Routes

USED BY:
app.js

NEXT FLOW:
Various Controllers

*/
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const interactionRoutes = require("./interactionRoutes");

router.use(authMiddleware);
router.use("/interactions", interactionRoutes);

module.exports = router;