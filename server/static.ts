import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { storage } from "./storage";

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

      // --- Fix Soft 404: Check if barcode pages actually exist ---
      // If Google crawls /barcode/XXXX and the barcode is NOT in DB,
      // return a real 404 so Google doesn't soft-404 index the page.
      const barcodeMatch = req.originalUrl.match(/^\/barcode\/([^\/?#]+)/);
      if (barcodeMatch) {
        const codeOrId = barcodeMatch[1];
        let barcode;
        try {
          if (codeOrId.match(/^[0-9a-fA-F]{24}$/)) {
            barcode = await storage.getBarcodeById(codeOrId);
          }
          if (!barcode) {
            barcode = await storage.getBarcodeByCode(codeOrId);
          }
        } catch (e) {
          // DB error — still serve the page with 200, don't block
        }

        if (!barcode) {
          // Barcode not found — send real 404 to stop Google soft-404
          return res.status(404).set({ "Content-Type": "text/html" }).send(html);
        }
      }

      const { injectSEO } = await import("./seo");
      const finalHtml = await injectSEO(html, req.originalUrl);
      res.status(200).set({ "Content-Type": "text/html" }).send(finalHtml);
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  });
}
