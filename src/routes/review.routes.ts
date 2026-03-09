import type { FastifyInstance } from "fastify";
import { requireAuth } from "../middleware/auth";
import {
  createReview,
  getReviewsByMovie,
  updateReview,
  deleteReview,
  getMyReviews,
} from "../controllers/review.controller";

// Registers routes related to movie reviews
export async function reviewRoutes(app: FastifyInstance) {
  // Public route to fetch all reviews for a specific movie
  app.get("/", getReviewsByMovie);

  // Protected routes that require authentication
  // Create a new review
  app.get("/me", { preHandler: [requireAuth] }, getMyReviews);
  
  app.post("/", { preHandler: [requireAuth] }, createReview);
  
  // Update an existing review
  app.put("/:id", { preHandler: [requireAuth] }, updateReview);
  
  // Delete a review
  app.delete("/:id", { preHandler: [requireAuth] }, deleteReview);
}