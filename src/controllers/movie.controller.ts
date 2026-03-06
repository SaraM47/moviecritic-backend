import { tmdbFetch } from "../config/tmdb";

// Controller functions for handling movie-related requests. These functions use the tmdbFetch helper to communicate with the TMDB API and return the relevant data to the client.

/*
Search movies using a query string.
Example: /api/movies/search?query=batman
*/
export async function searchMovies(request: any, reply: any) {
  const { query } = request.query;

  // Validate that the query parameter is provided and is a string
  const data = await tmdbFetch("/search/movie", {
    query,
  });

  // Return the search results from TMDB to the client
  return data;
}

/*
Fetch a list of currently popular movies from TMDB.
This is used for the Hero Slider and other sections showing trending content.
Example: /api/movies/popular
*/
export async function getPopularMovies(request: any, reply: any) {

  // Optional query parameter for pagination
  const { page = "1" } = request.query;

  // Fetch popular movies from TMDB
  const data = await tmdbFetch("/movie/popular", {
    page,
  });

  // Return the list of popular movies to the client
  return data;
}

// Fetch a list of top-rated movies from TMDB. This will be used to populate sections like "Top Rated Movies" on the frontend.
export async function getTopRatedMovies(request: any, reply: any) {

  const data = await tmdbFetch("/movie/top_rated", {
    page: "1"
  });

  return data;
}

/*
Fetch detailed information about a specific movie using its ID.
Example: /api/movies/550
*/
export async function getMovieById(request: any, reply: any) {
  const { id } = request.params;

  // Validate that the ID parameter is provided and is a valid number
  const data = await tmdbFetch(`/movie/${id}`);

  // Return the movie details from TMDB to the client
  return data;
}