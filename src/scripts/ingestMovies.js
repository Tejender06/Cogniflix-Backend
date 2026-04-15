require("dotenv").config({
  path: require("path").resolve(__dirname, "../../.env"),
});

const { fetchAndStoreMovies } = require("../services/movie.service");

(async () => {
  try {
    console.log("🚀 Starting movie ingestion...");

    await fetchAndStoreMovies();

    console.log("✅ Ingestion completed successfully");
    process.exit(0);
  } catch (err) {
    console.error("❌ Ingestion failed");
    console.error(err.message);
    process.exit(1);
  }
})();