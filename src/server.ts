import Fastify from "fastify";
import { env } from "./config/env";
import { connectDB } from "./config/db";
import { registerPlugins } from "./config/plugins";
import { authRoutes } from "./routes/auth.routes";
import { reviewRoutes } from "./routes/review.routes";
import { movieRoutes } from "./routes/movie.routes";

// Main function that starts the Fastify server
async function main() {

  // Create Fastify instance with logging enabled
  const app = Fastify({ logger: true });

  // Register plugins such as JWT, cookies and CORS
  await registerPlugins(app);

  // Health check endpoint to verify API status
  app.get("/health", async () => ({ ok: true }));
    
  // Register application routes
  app.register(authRoutes, { prefix: "/api/auth" });
  app.register(reviewRoutes, { prefix: "/api/reviews" });
  app.register(movieRoutes, { prefix: "/api/movies" });

  // Global error handler
  app.setErrorHandler((error, request, reply) => {
    request.log.error(error);
  
    let statusCode = 500;
    let message = "Internal Server Error";
    let stack;
  
    if (error instanceof Error) {
      message = error.message;
      stack = error.stack;
    }
  
    if (typeof (error as any)?.statusCode === "number") {
      statusCode = (error as any).statusCode;
    }
  
    reply.status(statusCode).send({
      message,
      details: env.NODE_ENV === "development" ? stack : undefined,
    });
  });

  // Connect to the MongoDB database before starting the server
  await connectDB();

  // Start server
  await app.listen({ port: env.PORT, host: "0.0.0.0" });
}

// Start application and catch any unhandled errors to prevent the server from crashing without logging
main().catch((err) => {
  console.error(err);
  process.exit(1);
});