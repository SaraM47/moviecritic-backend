import type { FastifyRequest, FastifyReply } from "fastify";
import { Types } from "mongoose";
import { z } from "zod";
import { Review } from "../models/Review";

// Zod scheme to validate input data to create and update reviews
const createReviewSchema = z.object({
  movieId: z.number(),
  rating: z.number().min(1).max(10),
  text: z.string().min(2).max(2000),
});

// Validation schema for updating reviews
const updateReviewSchema = z.object({
  rating: z.number().min(1).max(10).optional(),
  text: z.string().min(2).max(2000).optional(),
});

// Create a new review for a movie by an authenticated user
export async function createReview(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const parsed = createReviewSchema.safeParse(request.body);

  // If validation fails, return a 400 Bad Request with error details
  if (!parsed.success) {
    return reply.code(400).send({
      message: "Invalid input",
      details: parsed.error.issues,
    });
  }

  // Extract validated data and user information from the request
  const { movieId, rating, text } = parsed.data;
  const payload = request.user as { userId: string };

  // Store review in database
  const created = await Review.create({
    movieId,
    rating,
    text,
    userId: new Types.ObjectId(payload.userId),
  });

  return reply.code(201).send(created);
}

// Fetch reviews for a specific movies
export async function getReviewsByMovie(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const movieIdRaw = (request.query as any).movieId;
  const movieId = Number(movieIdRaw);

  // Validate movieId
  if (!movieIdRaw || Number.isNaN(movieId)) {
    return reply.code(400).send({
      message: "movieId is required and must be a number",
    });
  }

  // Find reviews sorted by newest first
  const reviews = await Review.find({ movieId })
    .sort({ createdAt: -1 })
    .populate("userId", "username");

  return reply.send(reviews);
}

// Update movie review by id, only allowed for the user who created the review
export async function updateReview(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const parsed = updateReviewSchema.safeParse(request.body);

  if (!parsed.success) {
    return reply.code(400).send({
      message: "Invalid input",
      details: parsed.error.issues,
    });
  }

  // Extract review ID from URL parameters and user information from the request
  const { id } = request.params as { id: string };
  const payload = request.user as { userId: string };

  // Validate that the review ID is a valid MongoDB ObjectId
  if (!Types.ObjectId.isValid(id)) {
    return reply.code(400).send({
      message: "Invalid review id",
    });
  }

  // Find the review by ID
  const review = await Review.findById(id);

  if (!review) {
    return reply.code(404).send({
      message: "Review not found",
    });
  }

  // Check if the authenticated user is the owner of the review
  if (review.userId.toString() !== payload.userId) {
    return reply.code(403).send({
      message: "Forbidden",
    });
  }

  // Update the review fields if they are provided in the request body
  if (parsed.data.rating !== undefined) {
    review.rating = parsed.data.rating;
  }

  // Only update the text if it's provided, allowing partial updates
  if (parsed.data.text !== undefined) {
    review.text = parsed.data.text;
  }

  // Save the updated review to the database
  await review.save();

  // Return the updated review to the client
  return reply.send(review);
}

// Delete reviews by id, only allowed for the user who created the review
export async function deleteReview(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as { id: string };
  const payload = request.user as { userId: string };

  if (!Types.ObjectId.isValid(id)) {
    return reply.code(400).send({
      message: "Invalid review id",
    });
  }

  const review = await Review.findById(id);

  if (!review) {
    return reply.code(404).send({
      message: "Review not found",
    });
  }

  // Ensure only owner can delete review
  if (review.userId.toString() !== payload.userId) {
    return reply.code(403).send({
      message: "Forbidden",
    });
  }

  await review.deleteOne();

  return reply.code(204).send();
}