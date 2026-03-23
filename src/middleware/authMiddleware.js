const { verifyToken } = require("../utils/jwt");

function authMiddleware(req, res, next) {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token required" });
  }

  const token = authHeader.split(" ")[1];

  try {

    const user = verifyToken(token);

    req.user = user;

    next();

  } catch (error) {

    res.status(401).json({ message: "Invalid token" });

  }
}

module.exports = authMiddleware;