import { FastifyInstance } from "fastify";
import {
  searchMovies,
  getMovieById,
  getPopularMovies,
  getTopRatedMovies
} from "../controllers/movie.controller";

// Registers routes for movie data fetched from TMDB
export async function movieRoutes(app: FastifyInstance) {

  // Fetch a list of popular movies from TMDB
  app.get("/popular", getPopularMovies);

  // Fetch a list of top-rated movies from TMDB
  app.get("/top-rated", getTopRatedMovies);

  // Search movies using a query string
  app.get(
    "/search",
    {
      schema: {
        querystring: {
          type: "object",
          required: ["query"],
          properties: {
            query: {
              type: "string",
              minLength: 1,
              maxLength: 100
            }
          }
        }
      }
    },
    searchMovies
  );

  // Fetch detailed information for a specific movie
  app.get("/:id", getMovieById);
}