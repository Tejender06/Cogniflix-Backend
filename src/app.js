const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const interactionRoutes = require("./routes/interactionRoutes");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "https://main.d2ccpg74a1qwou.amplifyapp.com",
    credentials: true,
  })
);

app.use("/auth", authRoutes);
app.use("/interactions", interactionRoutes);

app.get("/test", (req, res) => {
  res.send("Server working");
});

module.exports = app;