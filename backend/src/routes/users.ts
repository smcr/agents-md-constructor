import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import { Router } from "express";
import { requireAuth } from "../auth.js";
import { prisma } from "../db.js";
import { asyncHandler, HttpError, parseId } from "../http.js";
import { userJson } from "../serialize.js";

export const usersRouter = Router();

usersRouter.use(requireAuth);

function requiredText(value: unknown, field: string): string {
  const text = String(value ?? "").trim();
  if (!text) {
    throw new HttpError(400, `${field} is required`);
  }
  return text;
}

function handleUniqueLogin(err: unknown): never {
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
    throw new HttpError(409, "login already exists");
  }
  throw err;
}

usersRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const rows = await prisma.user.findMany({ orderBy: { id: "asc" } });
    res.json(rows.map(userJson));
  }),
);

usersRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const login = requiredText(req.body?.login, "login");
    const name = requiredText(req.body?.name, "name");
    const password = String(req.body?.password ?? "");
    if (!password) {
      throw new HttpError(400, "password is required");
    }
    try {
      const row = await prisma.user.create({
        data: {
          login,
          name,
          password_hash: await bcrypt.hash(password, 10),
        },
      });
      res.status(201).json(userJson(row));
    } catch (err) {
      handleUniqueLogin(err);
    }
  }),
);

usersRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = parseId(req.params.id);
    const row = await prisma.user.findUnique({ where: { id } });
    if (!row) {
      throw new HttpError(404, "User not found");
    }
    res.json(userJson(row));
  }),
);

usersRouter.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = parseId(req.params.id);
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      throw new HttpError(404, "User not found");
    }
    const data: { login?: string; name?: string; password_hash?: string } = {};
    if (req.body?.login !== undefined) {
      data.login = requiredText(req.body.login, "login");
    }
    if (req.body?.name !== undefined) {
      data.name = requiredText(req.body.name, "name");
    }
    const password = req.body?.password;
    if (password !== undefined && password !== null && String(password) !== "") {
      data.password_hash = await bcrypt.hash(String(password), 10);
    }
    try {
      const row = await prisma.user.update({ where: { id }, data });
      res.json(userJson(row));
    } catch (err) {
      handleUniqueLogin(err);
    }
  }),
);

usersRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = parseId(req.params.id);
    if (req.session.userId === id) {
      throw new HttpError(409, "Cannot delete the currently signed-in user");
    }
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      throw new HttpError(404, "User not found");
    }
    await prisma.user.delete({ where: { id } });
    res.status(204).send();
  }),
);
