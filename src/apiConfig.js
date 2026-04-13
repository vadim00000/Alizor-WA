export const API_URL = "https://exercisedb.p.rapidapi.com";

export const API_OPTIONS = {
  method: "GET",
  headers: {
    "x-rapidapi-key": import.meta.env.VITE_RAPIDAPI_KEY,
    "x-rapidapi-host": "exercisedb.p.rapidapi.com"
  }
};