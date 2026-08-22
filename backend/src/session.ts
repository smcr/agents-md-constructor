import session from "express-session";

declare module "express-session" {
  interface SessionData {
    userId?: number;
  }
}

function sessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (secret) {
    return secret;
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET is required");
  }
  return "dev-session-secret";
}

export const sessionMiddleware = session({
  secret: sessionSecret(),
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.COOKIE_SECURE === "true",
  },
});
