import type { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import jwt from "@fastify/jwt";
import { env } from "./env";

// Function to register all plugins with the Fastify app
export async function registerPlugins(app: FastifyInstance) {

    /*
    Registers CORS support to allow requests from the frontend application. The allowed origin is defined in environment variables and credentials are enabled so cookies and authentication headers can be sent
    */ 
  await app.register(cors, {
    origin: env.CORS_ORIGIN,
    credentials: true,
  });

  /*
  Registers cookie handling for the server. Cookies can be signed using the secret defined in environment variables. This helps verify that cookies have not been tampered with
  */
  await app.register(cookie, {
    secret: env.COOKIE_SECRET,
  });

  /*
  Registers JWT authentication support. The secret is used to sign and verify JSON Web Tokens. Tokens are stored inside a signed cookie named "token"
  */
  await app.register(jwt, {
    secret: env.JWT_SECRET,
    cookie: {
      cookieName: "token",
      signed: true,
    },
  });
}