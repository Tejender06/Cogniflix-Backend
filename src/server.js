require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, (err) => {
  if (err) {
    console.error(`💥 Failed to start server:`, err.message);
    process.exit(1);
  }
  console.log(`Server running on port ${PORT}`);

  // Keep-alive ping to prevent Render sleep
  const pingUrl = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
  const axios = require("axios");
  setInterval(() => {
    axios.get(pingUrl)
      .then(res => console.log(`[Keep-Alive] Pinged ${pingUrl} - Status: ${res.status}`))
      .catch(e => console.error(`[Keep-Alive] Error: ${e.message}`));
  }, 10 * 60 * 1000); // Every 10 minutes
});