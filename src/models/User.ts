import { Schema, model } from "mongoose";

export interface UserDoc {
  username: string; // Public username
  email: string; // Unique user email
  passwordHash: string; // Hashed password stored securely
  createdAt: Date; // Account creation timestamp
  updatedAt: Date; // Last update timestamp
}

// Mongoose schema defining how user data is stored
const userSchema = new Schema<UserDoc>(
  {
    // Username with validation and trimming
    username: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },

    // Unique email used for login
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },

    // Hashed password generated during registration
    passwordHash: { type: String, required: true },
  },

    // Automatically adds createdAt and updatedAt timestamps
  { timestamps: true }
);

export const User = model<UserDoc>("User", userSchema);