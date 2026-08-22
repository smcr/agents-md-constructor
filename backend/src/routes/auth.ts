import bcrypt from "bcrypt";
import { Router } from "express";
import { prisma } from "../db.js";
import { asyncHandler, HttpError } from "../http.js";
import { userJson } from "../serialize.js";

export const authRouter = Router();

authRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const login = String(req.body?.login ?? "").trim();
    const password = String(req.body?.password ?? "");
    if (!login || !password) {
      throw new HttpError(400, "login and password are required");
    }
    const user = await prisma.user.findUnique({ where: { login } });
    const ok = user ? await bcrypt.compare(password, user.password_hash) : false;
    if (!user || !ok) {
      throw new HttpError(401, "Invalid login or password");
    }
    await new Promise<void>((resolve, reject) => {
      req.session.regenerate((err) => {
        if (err) {
          reject(err);
          return;
        }
        req.session.userId = user.id;
        req.session.save((saveErr) => {
          if (saveErr) {
            reject(saveErr);
            return;
          }
          resolve();
        });
      });
    });
    res.json(userJson(user));
  }),
);

authRouter.post(
  "/logout",
  asyncHandler(async (req, res) => {
    await new Promise<void>((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
    res.clearCookie("connect.sid", { path: "/" });
    res.status(204).send();
  }),
);

authRouter.get(
  "/me",
  asyncHandler(async (req, res) => {
    const userId = req.session?.userId;
    if (!userId) {
      throw new HttpError(401, "Unauthorized");
    }
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new HttpError(401, "Unauthorized");
    }
    res.json(userJson(user));
  }),
);
