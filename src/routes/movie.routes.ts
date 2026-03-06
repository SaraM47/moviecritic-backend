import { FastifyInstance } from "fastify";
import { searchMovies, getMovieById } from "../controllers/movie.controller";

// Registers routes for movie data fetched from TMDB
export async function movieRoutes(app: FastifyInstance) {
  app.get("/search", searchMovies); // Search movies using a query string
  app.get("/:id", getMovieById); // Fetch detailed information for a specific movie
}