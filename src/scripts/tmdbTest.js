/*
FILE: tmdbTest.js

PURPOSE:
Tests connectivity to the TMDB API.

FLOW:
Script Execution -> API Request -> Output

USED BY:
Manual execution / Debugging

NEXT FLOW:
TMDB API

*/
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