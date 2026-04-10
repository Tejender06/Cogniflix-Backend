const axios = require("axios");
const pool = require("../config/db");

// 1. Log to confirm the module is actually being requested/loaded
console.log("✅ movie.service.js: Module loaded into memory");

const fetchAndStoreMovies = async () => {
  try {
    // 2. Log entry to confirm the function is running
    console.log("⏳ fetchAndStoreMovies: Execution started...");

    // 3. Read API key inside the function to prevent dotenv timing issues
    // If it was read at module-level before require("dotenv").config() in server.js, it would be undefined.
    const API_KEY = process.env.TMDB_API_KEY;
    
    if (!API_KEY) {
      throw new Error("TMDB_API_KEY is missing or undefined in environment variables.");
    }

    let allMovies = [];
    console.log("📡 fetchAndStoreMovies: Fetching initial popular movies from TMDB...");
    
    // Fetching a few pages. Adjust the loop as needed. Using 5 to ensure good amount of data.
    for (let page = 1; page <= 5; page++) {
      const res = await axios.get("https://api.themoviedb.org/3/movie/popular", {
        params: {
          api_key: API_KEY,
          page,
        },
      });
      allMovies.push(...res.data.results);
    }

    console.log(`📦 fetchAndStoreMovies: Successfully fetched ${allMovies.length} movies. Storing to database...`);

    for (let movie of allMovies) {
      // 1. Log raw TMDB response for poster_path
      console.log(`🔍 Raw TMDB poster_path for "${movie.title}":`, movie.poster_path);

      // 2. Assign fallback image URL if poster_path is null or undefined
      // Removing any skipping logic like 'if (!movie.poster_path) continue;'
      const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "https://via.placeholder.com/500x750?text=No+Poster";

      // 3. Verify DB insert values using console logs before query
      console.log(`📝 Preparing insert for "${movie.title}" -> poster_url: ${posterUrl}`);

      // 4. Ensure SQL query always includes poster_url and ON CONFLICT updates it
      await pool.query(
        `
        INSERT INTO items 
        (title, description, language, region, genre, emotion_tag_id, popularity_score, poster_url)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
        ON CONFLICT (title) 
        DO UPDATE SET 
          description = EXCLUDED.description,
          language = EXCLUDED.language,
          popularity_score = EXCLUDED.popularity_score,
          poster_url = EXCLUDED.poster_url
        `,
        [
          movie.title,
          movie.overview,
          movie.original_language,
          "Global",
          "Unknown",
          null,
          movie.vote_average || 0,
          posterUrl,
        ]
      );
    }

    console.log("✅ fetchAndStoreMovies: movies successfully stored in DB.");
  } catch (err) {
    // 4. Properly catch and expose any silent failures (network issues, syntax flaws, db errors)
    console.error("❌ fetchAndStoreMovies FAILED with error:");
    if (err.response) {
      console.error(`TMDB API Error: ${err.response.status} - ${JSON.stringify(err.response.data)}`);
    } else {
      console.error(err.message || err);
    }
  }
};

module.exports = { fetchAndStoreMovies };
