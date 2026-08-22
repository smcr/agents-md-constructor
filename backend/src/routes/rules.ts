import { Prisma } from "@prisma/client";
import { Router } from "express";
import { requireAuthForWrites } from "../auth.js";
import { prisma } from "../db.js";
import {
  asyncHandler,
  HttpError,
  optionalBool,
  optionalInt,
  optionalQueryId,
  optionalString,
  parseId,
  parseTagIds,
} from "../http.js";
import { ruleInclude, ruleJson } from "../serialize.js";

export const rulesRouter = Router();

rulesRouter.use(
  requireAuthForWrites(
    (req) =>
      req.method === "POST" &&
      (/^\/\d+\/counter\/?$/.test(req.path) || /^\/propose\/?$/.test(req.path)),
  ),
);

rulesRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const sectionId = optionalQueryId(req.query.section_id);
    const tagId = optionalQueryId(req.query.tag_id);
    const where: Prisma.RuleWhereInput = {};
    if (sectionId !== undefined) {
      where.section_id = sectionId;
    }
    if (tagId !== undefined) {
      where.tagRules = { some: { tag_id: tagId } };
    }
    const rows = await prisma.rule.findMany({
      where,
      include: ruleInclude,
      orderBy: { id: "asc" },
    });
    res.json(rows.map(ruleJson));
  }),
);

rulesRouter.post(
  "/propose",
  asyncHandler(async (req, res) => {
    const sectionId = optionalInt(req.body?.section_id);
    if (sectionId === undefined) {
      throw new HttpError(400, "section_id is required");
    }
    const ruleText = String(req.body?.rule ?? "").trim();
    if (!ruleText) {
      throw new HttpError(400, "rule is required");
    }
    const checksRaw = optionalString(req.body?.checks);
    const checks =
      checksRaw === undefined || checksRaw === null ? null : checksRaw.trim() || null;
    const section = await prisma.section.findUnique({ where: { id: sectionId } });
    if (!section) {
      throw new HttpError(400, "Section not found");
    }
    const tagIds = parseTagIds(req.body?.tag_ids);
    if (tagIds.length > 0) {
      const found = await prisma.tag.count({ where: { id: { in: tagIds } } });
      if (found !== tagIds.length) {
        throw new HttpError(400, "Tag not found");
      }
    }
    const row = await prisma.rule.create({
      data: {
        section_id: sectionId,
        description: optionalString(req.body?.description) ?? null,
        rule: ruleText,
        checks,
        counter: 0,
        approved: false,
        tagRules: { create: tagIds.map((tag_id) => ({ tag_id })) },
      },
      include: ruleInclude,
    });
    res.status(201).json(ruleJson(row));
  }),
);

rulesRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const sectionId = optionalInt(req.body?.section_id);
    if (sectionId === undefined) {
      throw new HttpError(400, "section_id is required");
    }
    const ruleText = String(req.body?.rule ?? "").trim();
    if (!ruleText) {
      throw new HttpError(400, "rule is required");
    }
    const checksRaw = optionalString(req.body?.checks);
    const checks =
      checksRaw === undefined || checksRaw === null ? null : checksRaw.trim() || null;
    const section = await prisma.section.findUnique({ where: { id: sectionId } });
    if (!section) {
      throw new HttpError(400, "Section not found");
    }
    const data: {
      section_id: number;
      description: string | null;
      rule: string;
      checks?: string | null;
      counter: number;
      approved: boolean;
    } = {
      section_id: sectionId,
      description: optionalString(req.body?.description) ?? null,
      rule: ruleText,
      counter: optionalInt(req.body?.counter, 0) ?? 0,
      approved: optionalBool(req.body?.approved) ?? false,
    };
    if (checks !== null) {
      data.checks = checks;
    }
    const row = await prisma.rule.create({
      data,
      include: ruleInclude,
    });
    res.status(201).json(ruleJson(row));
  }),
);

rulesRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = parseId(req.params.id);
    const row = await prisma.rule.findUnique({
      where: { id },
      include: ruleInclude,
    });
    if (!row) {
      throw new HttpError(404, "Rule not found");
    }
    res.json(ruleJson(row));
  }),
);

rulesRouter.post(
  "/:id/counter",
  asyncHandler(async (req, res) => {
    const id = parseId(req.params.id);
    try {
      const row = await prisma.rule.update({
        where: { id },
        data: { counter: { increment: 1 } },
        include: ruleInclude,
      });
      res.json(ruleJson(row));
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
        throw new HttpError(404, "Rule not found");
      }
      throw err;
    }
  }),
);

rulesRouter.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = parseId(req.params.id);
    const existing = await prisma.rule.findUnique({ where: { id } });
    if (!existing) {
      throw new HttpError(404, "Rule not found");
    }
    const data: {
      section_id?: number;
      description?: string | null;
      rule?: string;
      checks?: string | null;
      counter?: number;
      approved?: boolean;
    } = {};
    if (req.body?.section_id !== undefined) {
      const sectionId = optionalInt(req.body.section_id);
      if (sectionId === undefined) {
        throw new HttpError(400, "section_id is required");
      }
      const section = await prisma.section.findUnique({ where: { id: sectionId } });
      if (!section) {
        throw new HttpError(400, "Section not found");
      }
      data.section_id = sectionId;
    }
    if (req.body?.description !== undefined) {
      data.description = optionalString(req.body.description) ?? null;
    }
    if (req.body?.rule !== undefined) {
      const ruleText = String(req.body.rule).trim();
      if (!ruleText) {
        throw new HttpError(400, "rule is required");
      }
      data.rule = ruleText;
    }
    if (req.body?.checks !== undefined) {
      const checksRaw = optionalString(req.body.checks);
      data.checks = checksRaw === null ? null : (checksRaw ?? "").trim() || null;
    }
    if (req.body?.counter !== undefined) {
      data.counter = optionalInt(req.body.counter) ?? existing.counter;
    }
    if (req.body?.approved !== undefined) {
      data.approved = optionalBool(req.body.approved) ?? existing.approved;
    }
    const row = await prisma.rule.update({
      where: { id },
      data,
      include: ruleInclude,
    });
    res.json(ruleJson(row));
  }),
);

rulesRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = parseId(req.params.id);
    const existing = await prisma.rule.findUnique({ where: { id } });
    if (!existing) {
      throw new HttpError(404, "Rule not found");
    }
    await prisma.rule.delete({ where: { id } });
    res.status(204).send();
  }),
);

rulesRouter.put(
  "/:id/tags/:tagId",
  asyncHandler(async (req, res) => {
    const ruleId = parseId(req.params.id);
    const tagId = parseId(req.params.tagId);
    const [rule, tag] = await Promise.all([
      prisma.rule.findUnique({ where: { id: ruleId } }),
      prisma.tag.findUnique({ where: { id: tagId } }),
    ]);
    if (!rule || !tag) {
      throw new HttpError(404, "Rule or Tag not found");
    }
    await prisma.tagRule.upsert({
      where: { tag_id_rule_id: { tag_id: tagId, rule_id: ruleId } },
      create: { tag_id: tagId, rule_id: ruleId },
      update: {},
    });
    const row = await prisma.rule.findUniqueOrThrow({
      where: { id: ruleId },
      include: ruleInclude,
    });
    res.json(ruleJson(row));
  }),
);

rulesRouter.delete(
  "/:id/tags/:tagId",
  asyncHandler(async (req, res) => {
    const ruleId = parseId(req.params.id);
    const tagId = parseId(req.params.tagId);
    const [rule, tag] = await Promise.all([
      prisma.rule.findUnique({ where: { id: ruleId } }),
      prisma.tag.findUnique({ where: { id: tagId } }),
    ]);
    if (!rule || !tag) {
      throw new HttpError(404, "Rule or Tag not found");
    }
    await prisma.tagRule.deleteMany({
      where: { tag_id: tagId, rule_id: ruleId },
    });
    const row = await prisma.rule.findUniqueOrThrow({
      where: { id: ruleId },
      include: ruleInclude,
    });
    res.json(ruleJson(row));
  }),
);
