import type { FastifyRequest, FastifyReply } from "fastify";

// Middleware to protect routes that require authentication
export async function requireAuth(request: FastifyRequest, reply: FastifyReply) {
  try {
    // Verifices the JWT and adds the payload to request.user
    await request.jwtVerify();
  } catch {
    // If verification fails, respond with 401 Unauthorized
    return reply.code(401).send({ message: "Unauthorized" });
  }
}