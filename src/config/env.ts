import dotenv from "dotenv";
dotenv.config();

// Loading all required environment variables and providing defaults where appropriate
export const env = {
  PORT: Number(process.env.PORT ?? 3001),
  NODE_ENV: process.env.NODE_ENV ?? "development",
  MONGO_URI: process.env.MONGO_URI ?? "",
  JWT_SECRET: process.env.JWT_SECRET ?? "",
  COOKIE_SECRET: process.env.COOKIE_SECRET ?? "",
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? "http://localhost:5173",
  TMDB_API_KEY: process.env.TMDB_API_KEY ?? "",
  TMDB_BASE_URL: process.env.TMDB_BASE_URL ?? "https://api.themoviedb.org/3",
};

// If any required environment variable is missing, throw an error to prevent the application from starting
if (
    !env.MONGO_URI ||
    !env.JWT_SECRET ||
    !env.COOKIE_SECRET ||
    !env.TMDB_API_KEY
  ) {
    throw new Error("Missing required environment variables");
  }