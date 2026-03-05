import { Schema, model, Types } from "mongoose";

// TypeScript interface describing the structure of a review document
export interface ReviewDoc {
  movieId: number; // Object id from TMDB the review belongs to
  userId: Types.ObjectId; // Users id who wrote the review
  rating: number; // Rating value from 1 to 10
  text: string; // Review text written by the user
  createdAt: Date; // Timestamp when review was created
  updatedAt: Date; // Timestamp when review was last updated
}

// Mongoose schema defining how reviews are stored in MongoDB with validation rules
const reviewSchema = new Schema<ReviewDoc>(
  {
    movieId: { type: Number, required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 10 },
    text: { type: String, required: true, minlength: 2, maxlength: 2000 },
  },
  { timestamps: true }
);

// Exporting the Review model used to interact with the reviews collection
export const Review = model<ReviewDoc>("Review", reviewSchema);