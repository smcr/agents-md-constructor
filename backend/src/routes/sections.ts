import { Router } from "express";
import { requireAuthForWrites } from "../auth.js";
import { prisma } from "../db.js";
import {
  asyncHandler,
  HttpError,
  optionalBool,
  optionalInt,
  optionalString,
  parseId,
  parseTagIds,
} from "../http.js";
import { sectionInclude, sectionJson } from "../serialize.js";

export const sectionsRouter = Router();

sectionsRouter.use(
  requireAuthForWrites((req) => req.method === "POST" && /^\/propose\/?$/.test(req.path)),
);

sectionsRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const rows = await prisma.section.findMany({
      include: sectionInclude,
      orderBy: { id: "asc" },
    });
    res.json(rows.map(sectionJson));
  }),
);

sectionsRouter.post(
  "/propose",
  asyncHandler(async (req, res) => {
    const title = String(req.body?.title ?? "").trim();
    if (!title) {
      throw new HttpError(400, "title is required");
    }
    const tagIds = parseTagIds(req.body?.tag_ids);
    if (tagIds.length > 0) {
      const found = await prisma.tag.count({ where: { id: { in: tagIds } } });
      if (found !== tagIds.length) {
        throw new HttpError(400, "Tag not found");
      }
    }
    const row = await prisma.section.create({
      data: {
        title,
        description: optionalString(req.body?.description) ?? null,
        counter: 0,
        approved: false,
        tagSections: { create: tagIds.map((tag_id) => ({ tag_id })) },
      },
      include: sectionInclude,
    });
    res.status(201).json(sectionJson(row));
  }),
);

sectionsRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const title = String(req.body?.title ?? "").trim();
    if (!title) {
      throw new HttpError(400, "title is required");
    }
    const row = await prisma.section.create({
      data: {
        title,
        description: optionalString(req.body?.description) ?? null,
        counter: optionalInt(req.body?.counter, 0) ?? 0,
        approved: optionalBool(req.body?.approved) ?? false,
      },
      include: sectionInclude,
    });
    res.status(201).json(sectionJson(row));
  }),
);

sectionsRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = parseId(req.params.id);
    const row = await prisma.section.findUnique({
      where: { id },
      include: sectionInclude,
    });
    if (!row) {
      throw new HttpError(404, "Section not found");
    }
    res.json(sectionJson(row));
  }),
);

sectionsRouter.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = parseId(req.params.id);
    const existing = await prisma.section.findUnique({ where: { id } });
    if (!existing) {
      throw new HttpError(404, "Section not found");
    }
    const data: {
      title?: string;
      description?: string | null;
      counter?: number;
      approved?: boolean;
    } = {};
    if (req.body?.title !== undefined) {
      const title = String(req.body.title).trim();
      if (!title) {
        throw new HttpError(400, "title is required");
      }
      data.title = title;
    }
    if (req.body?.description !== undefined) {
      data.description = optionalString(req.body.description) ?? null;
    }
    if (req.body?.counter !== undefined) {
      data.counter = optionalInt(req.body.counter) ?? existing.counter;
    }
    if (req.body?.approved !== undefined) {
      data.approved = optionalBool(req.body.approved) ?? existing.approved;
    }
    const row = await prisma.section.update({
      where: { id },
      data,
      include: sectionInclude,
    });
    res.json(sectionJson(row));
  }),
);

sectionsRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = parseId(req.params.id);
    const existing = await prisma.section.findUnique({
      where: { id },
      include: { _count: { select: { rules: true } } },
    });
    if (!existing) {
      throw new HttpError(404, "Section not found");
    }
    if (existing._count.rules > 0) {
      throw new HttpError(409, "Section still has Rules");
    }
    await prisma.section.delete({ where: { id } });
    res.status(204).send();
  }),
);

sectionsRouter.put(
  "/:id/tags/:tagId",
  asyncHandler(async (req, res) => {
    const sectionId = parseId(req.params.id);
    const tagId = parseId(req.params.tagId);
    const [section, tag] = await Promise.all([
      prisma.section.findUnique({ where: { id: sectionId } }),
      prisma.tag.findUnique({ where: { id: tagId } }),
    ]);
    if (!section || !tag) {
      throw new HttpError(404, "Section or Tag not found");
    }
    await prisma.tagSection.upsert({
      where: { tag_id_section_id: { tag_id: tagId, section_id: sectionId } },
      create: { tag_id: tagId, section_id: sectionId },
      update: {},
    });
    const row = await prisma.section.findUniqueOrThrow({
      where: { id: sectionId },
      include: sectionInclude,
    });
    res.json(sectionJson(row));
  }),
);

sectionsRouter.delete(
  "/:id/tags/:tagId",
  asyncHandler(async (req, res) => {
    const sectionId = parseId(req.params.id);
    const tagId = parseId(req.params.tagId);
    const [section, tag] = await Promise.all([
      prisma.section.findUnique({ where: { id: sectionId } }),
      prisma.tag.findUnique({ where: { id: tagId } }),
    ]);
    if (!section || !tag) {
      throw new HttpError(404, "Section or Tag not found");
    }
    await prisma.tagSection.deleteMany({
      where: { tag_id: tagId, section_id: sectionId },
    });
    const row = await prisma.section.findUniqueOrThrow({
      where: { id: sectionId },
      include: sectionInclude,
    });
    res.json(sectionJson(row));
  }),
);
