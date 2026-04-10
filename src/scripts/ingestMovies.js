require("dotenv").config({
  path: require("path").resolve(__dirname, "../../.env"),
});

const axios = require("axios");
const pool = require("../config/db");

const API_KEY = process.env.TMDB_API_KEY;

const fetchMovies = async () => {
  let allMovies = [];

  for (let page = 1; page <= 25; page++) {
    console.log(`Fetching page ${page}`);

    const res = await axios.get("https://api.themoviedb.org/3/movie/popular", {
      params: {
        api_key: API_KEY,
        page,
      },
    });

    allMovies.push(...res.data.results);
  }

  return allMovies;
};

const movieMap = (movie) => {
  return {
    title: movie.title,
    description: movie.overview,
    language: movie.original_language,
    region: "Global",
    genre: "Unknown",
    emotion_tag_id: null,
    popularity_score: movie.vote_average || 0,

    // 🔥 REQUIRED FOR FRONTEND
    poster: movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "https://via.placeholder.com/500x750?text=No+Image",
  };
};

const insertMovie = async (movie) => {
  await pool.query(
    `
    INSERT INTO items 
    (title, description, language, region, genre, emotion_tag_id, popularity_score, poster)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    ON CONFLICT (title) 
    DO UPDATE SET 
      description = EXCLUDED.description,
      language = EXCLUDED.language,
      popularity_score = EXCLUDED.popularity_score,
      poster = EXCLUDED.poster
    `,
    [
      movie.title,
      movie.description,
      movie.language,
      movie.region,
      movie.genre,
      movie.emotion_tag_id,
      movie.popularity_score,
      movie.poster,
    ],
  );
};

const run = async () => {
  try {
    const movies = await fetchMovies();
    console.log("Movies fetched:", movies.length);

    for (let m of movies) {
      const mapped = movieMap(m);
      await insertMovie(mapped);
    }

    console.log("Movies inserted");
    process.exit();
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

run();
