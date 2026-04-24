const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const interactionRoutes = require("./routes/interactionRoutes");
const movieRoutes = require("./routes/movieRoutes");
const tvShowsRoutes = require("./routes/tvShowsRoutes");
const adminRoutes = require("./routes/adminRoutes");
const recommendationRoutes = require("./routes/recommendation.routes");

const app = express();

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "https://main.d2ccpg74a1qwou.amplifyapp.com",
  "http://localhost:3000",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin) || origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")) {
        return callback(null, true);
      }

      return callback(new Error("CORS not allowed"), false);
    },
    credentials: true,
  })
);

// ✅ unified API structure
app.use("/api/auth", authRoutes);
app.use("/api/interactions", interactionRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/tv-shows", tvShowsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/recommendations", recommendationRoutes);

app.get("/api/test", (req, res) => {
  res.send("Server working");
});

app.get("/", (req, res) => {
  res.status(200).json({
    status: "online",
    message: "Cogniflix API is running",
    endpoints: [
      "/api/auth",
      "/api/interactions",
      "/api/movies",
      "/api/tv-shows",
      "/api/recommendations"
    ]
  });
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ error: "Internal Server Error" });
});

module.exports = app;