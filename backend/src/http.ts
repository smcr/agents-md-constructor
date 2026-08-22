import type { NextFunction, Request, Response } from "express";

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export function parseId(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) {
    throw new HttpError(400, "Invalid id");
  }
  return id;
}

export function optionalQueryId(value: unknown): number | undefined {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }
  const raw = Array.isArray(value) ? value[0] : value;
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) {
    throw new HttpError(400, "Invalid id");
  }
  return id;
}

export function optionalString(value: unknown): string | null | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return String(value);
}

export function optionalBool(value: unknown): boolean | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (typeof value === "boolean") {
    return value;
  }
  throw new HttpError(400, "Invalid boolean");
}

export function parseTagIds(value: unknown): number[] {
  if (value === undefined || value === null || value === "") {
    return [];
  }
  if (!Array.isArray(value)) {
    throw new HttpError(400, "tag_ids must be an array");
  }
  const ids = value.map((item) => {
    const id = Number(item);
    if (!Number.isInteger(id) || id <= 0) {
      throw new HttpError(400, "Invalid tag id");
    }
    return id;
  });
  return [...new Set(ids)];
}

export function optionalInt(value: unknown, fallback?: number): number | undefined {
  if (value === undefined) {
    return fallback;
  }
  const n = Number(value);
  if (!Number.isInteger(n)) {
    throw new HttpError(400, "Invalid integer");
  }
  return n;
}

export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}
