const axios = require("axios");
require("dotenv").config();

const test = async () => {
  const res = await axios.get("https://api.themoviedb.org/3/movie/popular", {
    params: {
      api_key: process.env.TMDB_API_KEY
    }
  });

  console.log(res.data.results[0]);
};

test();