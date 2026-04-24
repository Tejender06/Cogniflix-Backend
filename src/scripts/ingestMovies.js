require("dotenv").config({
  path: require("path").resolve(__dirname, "../../.env"),
});

const { fetchAndStoreMovies, fetchAndStoreTvShows } = require("../services/movie.service");

(async () => {
  try {
    console.log("🚀 Starting data ingestion...");

    await fetchAndStoreMovies();
    await fetchAndStoreTvShows();

    console.log("✅ Ingestion completed successfully");
    process.exit(0);
  } catch (err) {
    console.error("❌ Ingestion failed");
    console.error(err.message);
    process.exit(1);
  }
})();