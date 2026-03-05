import { FastifyInstance } from "fastify";
import { register, login, logout, me } from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth";

export async function authRoutes(app: FastifyInstance) {
  app.post("/register", register);
  app.post("/login", login);
  app.post("/logout", logout);

  // Protected route
  app.get("/me", { preHandler: [requireAuth] }, me);
}