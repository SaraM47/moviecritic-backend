import { tmdbFetch } from "../config/tmdb";

// Controller functions for handling movie-related requests. These functions use the tmdbFetch helper to communicate with the TMDB API and return the relevant data to the client.
export async function searchMovies(request: any, reply: any) {
  const { query } = request.query;

  // Validate that the query parameter is provided and is a string
  const data = await tmdbFetch("/search/movie", {
    query,
  });

  // Return the search results from TMDB to the client
  return data;
}

// Fetch detailed information about a specific movie using its ID
export async function getMovieById(request: any, reply: any) {
  const { id } = request.params;

  // Validate that the ID parameter is provided and is a valid number
  const data = await tmdbFetch(`/movie/${id}`);

  // Return the movie details from TMDB to the client
  return data;
}