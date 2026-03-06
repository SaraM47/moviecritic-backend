import type { FastifyRequest, FastifyReply } from "fastify";
import bcrypt from "bcrypt";
import { z } from "zod";
import { User } from "../models/User";
import { env } from "../config/env";

// Validation schema for user registration input
const registerSchema = z.object({
  username: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

// Validation schema for login input
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Cookie configuration used when storing JWT tokens
function cookieOptions() {
  const isProd = env.NODE_ENV === "production";
  return {
    httpOnly: true, // prevents JavaScript access to the cookie
    secure: isProd, // only send cookie over HTTPS in production
    sameSite: "lax" as const,
    path: "/",
    signed: true,
  };
}

// Handles user registration
export async function register(request: FastifyRequest, reply: FastifyReply) {
// Validate request body 
  const parsed = registerSchema.safeParse(request.body);
  if (!parsed.success) {
    return reply.code(400).send({
        message: "Invalid credentials",
      });
  }

  const { username, email, password } = parsed.data;

  // Check if email already exists
  const existing = await User.findOne({ email });
  if (existing) {
    return reply.code(400).send({ message: "Email already in use" });
  }

  // Hash the password before storing
  const passwordHash = await bcrypt.hash(password, 12);

  // Create user in database
  const user = await User.create({
    username,
    email,
    passwordHash,
  });

  // Generate JWT token for the new user
  const token = request.server.jwt.sign({ userId: user._id.toString() });

  // Store token in cookie
  reply.setCookie("token", token, cookieOptions()).code(201).send({
    id: user._id,
    username: user.username,
    email: user.email,
  });
}

// Handles user login
export async function login(request: FastifyRequest, reply: FastifyReply) {
  const parsed = loginSchema.safeParse(request.body);
  if (!parsed.success) {
    return reply
      .code(400)
      .send({ message: "Invalid input", issues: parsed.error.issues });
  }

  const { email, password } = parsed.data;

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    return reply.code(400).send({ message: "Invalid credentials" });
  }

  // Compare password with stored hash
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return reply.code(400).send({ message: "Invalid credentials" });
  }
 
  // Create JWT token for authenticated user
  const token = request.server.jwt.sign({ userId: user._id.toString() });

  // Store token in cookie and send success response
  reply
    .setCookie("token", token, cookieOptions())
    .code(200)
    .send({ message: "Login successful" });
}

// Logs out user by clearing cookie
export async function logout(request: FastifyRequest, reply: FastifyReply) {
  reply
    .clearCookie("token", { path: "/" })
    .code(200)
    .send({ message: "Logged out" });
}

// Returns information about the authenticated user
export async function me(request: FastifyRequest, reply: FastifyReply) {
  // RequireAuth middleware ensures that request.user contains the JWT payload
  const payload = request.user as { userId: string };

  const user = await User.findById(payload.userId).select(
    "_id username email createdAt"
  );
  // If user is not found (e.g. deleted), return 401 Unauthorized
  if (!user) {
    return reply.code(401).send({ message: "Unauthorized" });
  }

  // Send user info in response (excluding sensitive data like passwordHash)
  return reply.send({
    id: user._id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt,
  });
}
