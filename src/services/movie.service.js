const axios = require("axios");
const pool = require("../config/db");
const { mapToEmotion } = require("../utils/emotionMap");

console.log("movie.service.js loaded");

const genreIdMap = {
  28: "action",
  12: "adventure",
  16: "animation",
  35: "comedy",
  80: "crime",
  99: "documentary",
  18: "drama",
  10751: "family",
  14: "fantasy",
  36: "history",
  27: "horror",
  10402: "music",
  9648: "mystery",
  10749: "romance",
  878: "sci-fi",
  10770: "tv-movie",
  53: "thriller",
  10752: "war",
  37: "western",
};

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

async function fetchKeywords(movieId, API_KEY) {
  const res = await axios.get(
    `https://api.themoviedb.org/3/movie/${movieId}/keywords`,
    {
      params: { api_key: API_KEY },
      timeout: 15000,
    },
  );
  return (res.data.keywords || []).map((k) => k.name);
}

async function getOrCreateEmotion(name) {
  const existing = await pool.query(
    "SELECT id FROM emotion_tags WHERE name = $1",
    [name],
  );

  if (existing.rows.length) return existing.rows[0].id;

  const res = await pool.query(
    "INSERT INTO emotion_tags (name, weight_multiplier) VALUES ($1, 1.0) RETURNING id",
    [name],
  );

  return res.rows[0].id;
}

/*
  Fix existing movies that still have "unknown" genre
*/
async function fixUnknownMovies(API_KEY) {
  const res = await pool.query(
    "SELECT title FROM items WHERE LOWER(genre) = 'unknown'",
  );

  const unknownMovies = res.rows;
  console.log(`Fixing ${unknownMovies.length} unknown movies`);

  for (let row of unknownMovies) {
    try {
      const search = await axios.get(
        "https://api.themoviedb.org/3/search/movie",
        {
          params: {
            api_key: API_KEY,
            query: row.title,
          },
          timeout: 15000,
        },
      );

      const movie = search.data.results[0];
      if (!movie) continue;

      let keywords = [];
      try {
        keywords = await fetchKeywords(movie.id, API_KEY);
      } catch {}

      let genres = movie.genre_ids.map((id) => genreIdMap[id]).filter(Boolean);

      const emotion = mapToEmotion(genres, keywords);
      const emotionId = await getOrCreateEmotion(emotion);

      const finalGenre = genres.length ? genres.join(",") : "general";

      await pool.query(
        `
        UPDATE items
        SET genre = $1,
            emotion_tag_id = $2
        WHERE title = $3
        `,
        [finalGenre, emotionId, row.title],
      );

      await delay(400);
    } catch {
      console.log(`Failed to fix: ${row.title}`);
    }
  }
}

/*
  Main ingestion
*/
const fetchAndStoreMovies = async () => {
  try {
    console.log("Fetching movies...");

    const API_KEY = process.env.TMDB_API_KEY;
    if (!API_KEY) throw new Error("TMDB_API_KEY is missing");

    let allMovies = [];

    // Fetch movies with retry
    for (let page = 1; page <= 10; page++) {
      let retries = 3;

      while (retries > 0) {
        try {
          const res = await axios.get(
            "https://api.themoviedb.org/3/movie/popular",
            {
              params: { api_key: API_KEY, page },
              timeout: 15000,
            },
          );

          allMovies.push(...res.data.results);
          break;
        } catch {
          retries--;
          await delay(1500);
        }
      }

      await delay(700);
    }

    console.log(`${allMovies.length} movies fetched`);

    // Batch processing for speed
    const BATCH_SIZE = 5;

    for (let i = 0; i < allMovies.length; i += BATCH_SIZE) {
      const batch = allMovies.slice(i, i + BATCH_SIZE);

      await Promise.all(
        batch.map(async (movie) => {
          try {
            let keywords = [];
            let retries = 2;

            while (retries > 0) {
              try {
                keywords = await fetchKeywords(movie.id, API_KEY);
                break;
              } catch {
                retries--;
                await delay(500);
              }
            }

            let genres = movie.genre_ids
              .map((id) => genreIdMap[id])
              .filter(Boolean);

            if (genres.length === 0) {
              const keywordGenres = keywords
                .map((k) => k.toLowerCase())
                .filter((k) =>
                  [
                    "action",
                    "comedy",
                    "drama",
                    "romance",
                    "thriller",
                    "horror",
                    "adventure",
                    "crime",
                    "mystery",
                    "family",
                  ].includes(k),
                );

              if (keywordGenres.length) {
                genres = keywordGenres;
              }
            }

            let finalGenre;

            if (genres.length) {
              finalGenre = genres.join(",");
            } else {
              if (movie.original_language === "hi") {
                finalGenre = "drama";
              } else if (movie.original_language === "ja") {
                finalGenre = "animation";
              } else {
                finalGenre = "general";
              }
            }

            const emotion = mapToEmotion(genres, keywords);
            const emotionId = await getOrCreateEmotion(emotion);

            const posterUrl = movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "https://via.placeholder.com/500x750?text=No+Poster";

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
                poster_url = EXCLUDED.poster_url,
                genre = EXCLUDED.genre,
                emotion_tag_id = EXCLUDED.emotion_tag_id
              `,
              [
                movie.title,
                movie.overview,
                movie.original_language,
                "Global",
                finalGenre,
                emotionId,
                movie.vote_average || 0,
                posterUrl,
              ],
            );
          } catch {
            console.log(`Skipped: ${movie.title}`);
          }
        }),
      );

      await delay(800);
    }

    console.log("Movies stored successfully");

    // Fix old unknown data
    await fixUnknownMovies(API_KEY);

    console.log("Unknown movies fixed");
  } catch (err) {
    console.error("Ingestion failed");
    throw err;
  }
};

module.exports = { fetchAndStoreMovies };
