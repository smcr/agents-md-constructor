import { Router } from "express";
import { requireAuthForWrites } from "../auth.js";
import { prisma } from "../db.js";
import {
  asyncHandler,
  HttpError,
  optionalBool,
  parseId,
} from "../http.js";
import { tagJson } from "../serialize.js";

export const tagsRouter = Router();

tagsRouter.use(requireAuthForWrites());

tagsRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const rows = await prisma.tag.findMany({ orderBy: { id: "asc" } });
    res.json(rows.map(tagJson));
  }),
);

tagsRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const title = String(req.body?.title ?? "").trim();
    if (!title) {
      throw new HttpError(400, "title is required");
    }
    const row = await prisma.tag.create({
      data: {
        title,
        approved: optionalBool(req.body?.approved) ?? false,
      },
    });
    res.status(201).json(tagJson(row));
  }),
);

tagsRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = parseId(req.params.id);
    const row = await prisma.tag.findUnique({ where: { id } });
    if (!row) {
      throw new HttpError(404, "Tag not found");
    }
    res.json(tagJson(row));
  }),
);

tagsRouter.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = parseId(req.params.id);
    const existing = await prisma.tag.findUnique({ where: { id } });
    if (!existing) {
      throw new HttpError(404, "Tag not found");
    }
    const data: { title?: string; approved?: boolean } = {};
    if (req.body?.title !== undefined) {
      const title = String(req.body.title).trim();
      if (!title) {
        throw new HttpError(400, "title is required");
      }
      data.title = title;
    }
    if (req.body?.approved !== undefined) {
      data.approved = optionalBool(req.body.approved);
    }
    const row = await prisma.tag.update({ where: { id }, data });
    res.json(tagJson(row));
  }),
);

tagsRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = parseId(req.params.id);
    const existing = await prisma.tag.findUnique({ where: { id } });
    if (!existing) {
      throw new HttpError(404, "Tag not found");
    }
    await prisma.tag.delete({ where: { id } });
    res.status(204).send();
  }),
);
