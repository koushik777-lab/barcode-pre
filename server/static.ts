import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", async (req, res) => {
    try {
      const indexPath = path.resolve(distPath, "index.html");
      const html = fs.readFileSync(indexPath, "utf-8");
      const { injectSEO } = await import("./seo");
      const finalHtml = await injectSEO(html, req.originalUrl);
      res.status(200).set({ "Content-Type": "text/html" }).send(finalHtml);
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  });
}
