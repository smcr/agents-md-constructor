import express, { type NextFunction, type Request, type Response } from "express";
import fs from "node:fs";
import path from "node:path";
import { HttpError } from "./http.js";
import { rulesRouter } from "./routes/rules.js";
import { sectionsRouter } from "./routes/sections.js";
import { tagsRouter } from "./routes/tags.js";

const app = express();
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/sections", sectionsRouter);
app.use("/api/rules", rulesRouter);
app.use("/api/tags", tagsRouter);

const frontendDist = process.env.FRONTEND_DIST;
if (frontendDist) {
  app.use(express.static(frontendDist));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) {
      next();
      return;
    }
    const indexPath = path.join(frontendDist, "index.html");
    if (!fs.existsSync(indexPath)) {
      next();
      return;
    }
    res.sendFile(indexPath);
  });
}

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message });
    return;
  }
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

const port = Number(process.env.PORT || 3000);
app.listen(port, "0.0.0.0", () => {
  console.log(`API listening on ${port}`);
});
