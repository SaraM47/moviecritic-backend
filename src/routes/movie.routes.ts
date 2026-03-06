import { FastifyInstance } from "fastify";
import { searchMovies, getMovieById, getPopularMovies } from "../controllers/movie.controller";

// Registers routes for movie data fetched from TMDB
export async function movieRoutes(app: FastifyInstance) {

  // Fetch a list of popular movies from TMDB
  app.get("/popular", getPopularMovies);

  // Search movies using a query string
  app.get("/search", searchMovies);

  // Fetch detailed information for a specific movie
  app.get("/:id", getMovieById);
}