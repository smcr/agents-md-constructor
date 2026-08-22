import type { NextFunction, Request, Response } from "express";
import { HttpError } from "./http.js";

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  if (!req.session?.userId) {
    next(new HttpError(401, "Unauthorized"));
    return;
  }
  next();
}

export function requireAuthForWrites(allow?: (req: Request) => boolean) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.method === "GET" || req.method === "HEAD" || req.method === "OPTIONS") {
      next();
      return;
    }
    if (allow?.(req)) {
      next();
      return;
    }
    requireAuth(req, res, next);
  };
}
