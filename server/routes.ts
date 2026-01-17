import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { connectDB } from "./db";
import { sendApplicationEmail } from "./mailer";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  await connectDB();

  // Admin Login
  app.post("/api/admin/login", async (req, res) => {
    const { username, password } = req.body;

    // Check against environment variables
    const adminUser = process.env.ADMIN_USERNAME || "admin";
    const adminPass = process.env.ADMIN_PASSWORD || "admin";

    if (username === adminUser && password === adminPass) {
      return res.json({ success: true, message: "Logged in successfully", isAdmin: true });
    }

    const user = await storage.getUserByUsername(username);
    if (user && user.password === password) {
      return res.json({ success: true, message: "Logged in", isAdmin: user.isAdmin });
    }

    res.status(401).json({ success: false, message: "Invalid credentials" });
  });

  // --- Barcode CRUD ---

  // GET All
  app.get("/api/barcodes", async (req, res) => {
    try {
      const barcodes = await storage.getAllBarcodes();
      res.json(barcodes);
    } catch (err) {
      res.status(500).json({ message: "Error fetching barcodes" });
    }
  });

  // GET Single
  app.get("/api/barcodes/:code", async (req, res) => {
    try {
      const codeOrId = req.params.code;
      let barcode;

      // Check if it's a valid MongoDB ObjectId (24 hex characters)
      if (codeOrId.match(/^[0-9a-fA-F]{24}$/)) {
        barcode = await storage.getBarcodeById(codeOrId);
      }

      // If not found by ID, or not an ID, try finding by barcode string
      if (!barcode) {
        barcode = await storage.getBarcodeByCode(codeOrId);
      }

      if (!barcode) {
        return res.status(404).json({ message: "Barcode not found" });
      }
      res.json(barcode);
    } catch (err) {
      res.status(500).json({ message: "Error fetching barcode" });
    }
  });

  // POST Create
  app.post("/api/barcodes", async (req, res) => {
    try {
      const barcode = await storage.createBarcode(req.body);
      res.json(barcode);
    } catch (err) {
      res.status(500).json({ message: "Error creating barcode", error: err });
    }
  });

  // PUT Update
  app.put("/api/barcodes/:id", async (req, res) => {
    try {
      const barcode = await storage.updateBarcode(req.params.id, req.body);
      res.json(barcode);
    } catch (err) {
      res.status(500).json({ message: "Error updating barcode", error: err });
    }
  });

  // DELETE
  app.delete("/api/barcodes/:id", async (req, res) => {
    try {
      await storage.deleteBarcode(req.params.id);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ message: "Error deleting barcode", error: err });
    }
  });

  // --- Applications ---

  // POST Create (Public)
  app.post("/api/applications", async (req, res) => {
    try {
      const application = await storage.createApplication(req.body);

      // Send email notification
      await sendApplicationEmail(req.body);

      res.json(application);
    } catch (err) {
      res.status(500).json({ message: "Error submitting application", error: err });
    }
  });

  // GET All (Admin)
  app.get("/api/applications", async (req, res) => {
    try {
      const applications = await storage.getAllApplications();
      res.json(applications);
    } catch (err) {
      res.status(500).json({ message: "Error fetching applications" });
    }
  });

  // PATCH Status (Admin)
  app.patch("/api/applications/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const updated = await storage.updateApplicationStatus(req.params.id, status);
      res.json(updated);
    } catch (err) {
      res.status(500).json({ message: "Error updating application status" });
    }
  });

  return httpServer;
}
