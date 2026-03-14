import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { connectDB } from "./db";
import { sendApplicationEmail, sendOtpEmail, sendVerificationEmail } from "./mailer";
import { hashPassword, verifyPassword } from "./auth";
import { randomInt, randomBytes, createHmac } from "crypto";
import { razorpay } from "./razorpay";

// In-memory OTP store: email -> { otp, expires }
const otpStore = new Map<string, { otp: string; expires: number }>();
// In-memory reset token store: token -> email
const resetTokenStore = new Map<string, { email: string; expires: number }>();

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  await connectDB();

  // Admin Login
  app.post("/api/admin/login", async (req, res) => {
    const { username, password } = req.body;

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

  // --- User Auth ---

  app.post("/api/users/signup", async (req, res) => {
    try {
      const { username, email, password } = req.body;
      if (!username || !email || !password) {
        return res.status(400).json({ success: false, message: "All fields are required" });
      }
      const existing = await storage.getUserByEmail(email);
      if (existing) {
        return res.status(409).json({ success: false, message: "Email already registered" });
      }
      const existingUsername = await storage.getUserByUsername(username);
      if (existingUsername) {
        return res.status(409).json({ success: false, message: "Username already taken" });
      }
      const hashedPassword = await hashPassword(password);
      const verifyToken = randomBytes(32).toString("hex");
      const user = await storage.createUser({ username, email, password: hashedPassword, verifyToken, isVerified: false });
      // Send verification email (non-blocking)
      sendVerificationEmail(email, username, verifyToken).catch(console.error);
      res.json({ success: true, needsVerification: true, message: "Account created. Please check your inbox to verify your email." });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ success: false, message: "Error creating account" });
    }
  });

  // Verify Email – JSON endpoint (called by /verify-email frontend page)
  app.get("/api/users/verify-email-check/:token", async (req, res) => {
    try {
      const { token } = req.params;
      const User = (await import("./models")).User;
      const user = await User.findOne({ verifyToken: token });
      if (!user) {
        return res.status(400).json({ success: false, message: "invalid" });
      }
      if (user.isVerified) {
        return res.json({ success: true, message: "already_verified" });
      }
      user.isVerified = true;
      user.verifyToken = undefined;
      await user.save();
      res.json({ success: true, message: "verified" });
    } catch (error) {
      console.error("Verify email error:", error);
      res.status(500).json({ success: false, message: "error" });
    }
  });

  // Handle verification directly from the email link and redirect
  // This hides the API path from the user
  app.get("/verify-email", async (req, res) => {
    try {
      const token = req.query.token as string;
      if (!token) return res.redirect("/?verified=error");

      const User = (await import("./models")).User;
      const user = await User.findOne({ verifyToken: token });

      if (!user) {
        return res.redirect("/?verified=invalid");
      }

      if (user.isVerified) {
        return res.redirect("/?verified=already");
      }

      user.isVerified = true;
      user.verifyToken = undefined;
      await user.save();

      res.redirect("/?verified=success");
    } catch (error) {
      console.error("Verification redirect error:", error);
      res.redirect("/?verified=error");
    }
  });

  // Resend verification email
  app.post("/api/users/resend-verification", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ success: false, message: "Email required" });
      const user = await storage.getUserByEmail(email);
      if (!user) return res.json({ success: true, message: "If that email exists, a verification link has been sent." });
      if (user.isVerified) return res.json({ success: true, message: "Email is already verified. You can log in." });

      const verifyToken = randomBytes(32).toString("hex");
      await storage.updateUserProfile(String(user._id), { verifyToken });
      sendVerificationEmail(email, user.username, verifyToken).catch(console.error);
      res.json({ success: true, message: "Verification email resent. Please check your inbox." });
    } catch (error) {
      console.error("Resend verification error:", error);
      res.status(500).json({ success: false, message: "Error resending verification email" });
    }
  });

  app.post("/api/users/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and password are required" });
      }
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ success: false, message: "Invalid email or password" });
      }
      const isValid = await verifyPassword(password, user.password!);
      if (!isValid) {
        return res.status(401).json({ success: false, message: "Invalid email or password" });
      }
      if (!user.isVerified) {
        return res.status(403).json({ success: false, message: "Please verify your email before logging in.", needsVerification: true, email: user.email });
      }
      const safeUser = { id: user._id, username: user.username, email: user.email, isAdmin: user.isAdmin };
      res.json({ success: true, message: "Logged in successfully", user: safeUser });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ success: false, message: "Error logging in" });
    }
  });

  // Forgot Password – sends OTP
  app.post("/api/users/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ success: false, message: "Email is required" });

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.json({ success: true, message: "If that email exists, an OTP has been sent" });
      }

      const otp = String(randomInt(100000, 999999));
      otpStore.set(email, { otp, expires: Date.now() + 10 * 60 * 1000 }); // 10 min TTL

      await sendOtpEmail(email, user.username, otp);
      res.json({ success: true, message: "OTP sent to your email" });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({ success: false, message: "Error sending OTP" });
    }
  });

  // Verify OTP – returns reset token
  app.post("/api/users/verify-otp", async (req, res) => {
    try {
      const { email, otp } = req.body;
      if (!email || !otp) return res.status(400).json({ success: false, message: "Email and OTP required" });

      const record = otpStore.get(email);
      if (!record || record.otp !== otp || Date.now() > record.expires) {
        return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
      }

      otpStore.delete(email);
      const token = Math.random().toString(36).slice(2) + Date.now().toString(36);
      resetTokenStore.set(token, { email, expires: Date.now() + 15 * 60 * 1000 }); // 15 min TTL

      res.json({ success: true, message: "OTP verified", resetToken: token });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error verifying OTP" });
    }
  });

  // Reset Password
  app.post("/api/users/reset-password", async (req, res) => {
    try {
      const { resetToken, newPassword } = req.body;
      if (!resetToken || !newPassword) {
        return res.status(400).json({ success: false, message: "Token and new password required" });
      }

      const record = resetTokenStore.get(resetToken);
      if (!record || Date.now() > record.expires) {
        return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
      }

      const user = await storage.getUserByEmail(record.email);
      if (!user) return res.status(404).json({ success: false, message: "User not found" });

      const hashedPassword = await hashPassword(newPassword);
      await (user as any).updateOne({ password: hashedPassword });
      resetTokenStore.delete(resetToken);

      res.json({ success: true, message: "Password reset successfully" });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ success: false, message: "Error resetting password" });
    }
  });

  // --- Profile ---

  app.get("/api/users/profile/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) return res.status(404).json({ success: false, message: "User not found" });
      const safeUser = {
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        phone: user.phone,
        bio: user.bio,
        createdAt: user.createdAt,
      };
      res.json({ success: true, user: safeUser });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error fetching profile" });
    }
  });

  app.put("/api/users/profile/:id", async (req, res) => {
    try {
      const { username, phone, bio } = req.body;
      const updated = await storage.updateUserProfile(req.params.id, { username, phone, bio });
      if (!updated) return res.status(404).json({ success: false, message: "User not found" });
      const safeUser = { id: updated._id, username: updated.username, email: updated.email, isAdmin: updated.isAdmin, phone: updated.phone, bio: updated.bio };
      res.json({ success: true, user: safeUser });
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({ success: false, message: "Error updating profile" });
    }
  });

  app.put("/api/users/change-password/:id", async (req, res) => {
    try {
      const { oldPassword, newPassword } = req.body;
      if (!oldPassword || !newPassword) {
        return res.status(400).json({ success: false, message: "Old and new passwords are required" });
      }
      const user = await storage.getUser(req.params.id);
      if (!user) return res.status(404).json({ success: false, message: "User not found" });
      const isValid = await verifyPassword(oldPassword, user.password!);
      if (!isValid) return res.status(401).json({ success: false, message: "Current password is incorrect" });
      if (newPassword.length < 6) return res.status(400).json({ success: false, message: "New password must be at least 6 characters" });
      const hashedPassword = await hashPassword(newPassword);
      await storage.updateUserProfile(req.params.id, { password: hashedPassword } as any);
      res.json({ success: true, message: "Password changed successfully" });
    } catch (error) {
      console.error("Change password error:", error);
      res.status(500).json({ success: false, message: "Error changing password" });
    }
  });

  // --- Payment (Razorpay) ---

  app.post("/api/payment/create-order", async (req, res) => {
    try {
      const { amount, currency = "INR", receipt } = req.body;
      if (!amount) return res.status(400).json({ success: false, message: "Amount is required" });
      const order = await razorpay.orders.create({
        amount: Math.round(amount * 100), // paise
        currency,
        receipt: receipt || `receipt_${Date.now()}`,
      });
      res.json({
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
      });
    } catch (error) {
      console.error("Create Razorpay order error:", error);
      res.status(500).json({ success: false, message: "Error creating payment order" });
    }
  });

  app.post("/api/payment/verify", async (req, res) => {
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        userId,
        packageName,
        quantity,
        totalPrice,
      } = req.body;

      const secret = process.env.RAZORPAY_KEY_SECRET || "";
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = createHmac("sha256", secret).update(body).digest("hex");

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({ success: false, message: "Payment verification failed. Invalid signature." });
      }

      // Create the order in DB
      const order = await storage.createOrder({
        userId,
        packageName,
        quantity: quantity || 1,
        totalPrice,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
      });

      res.json({ success: true, order });
    } catch (error) {
      console.error("Payment verify error:", error);
      res.status(500).json({ success: false, message: "Error verifying payment" });
    }
  });

  // --- Orders ---

  app.post("/api/orders", async (req, res) => {
    try {
      const { userId, packageName, quantity, totalPrice } = req.body;
      if (!userId || !packageName || !totalPrice) {
        return res.status(400).json({ success: false, message: "Missing required order fields" });
      }
      const order = await storage.createOrder({ userId, packageName, quantity: quantity || 1, totalPrice });
      res.json({ success: true, order });
    } catch (err) {
      res.status(500).json({ success: false, message: "Error creating order", error: err });
    }
  });

  app.get("/api/orders/:userId", async (req, res) => {
    try {
      const orders = await storage.getOrdersByUser(req.params.userId);
      res.json(orders);
    } catch (err) {
      res.status(500).json({ message: "Error fetching orders" });
    }
  });

  // --- Barcode CRUD ---

  app.get("/api/barcodes", async (req, res) => {
    try {
      const barcodes = await storage.getAllBarcodes();
      res.json(barcodes);
    } catch (err) {
      res.status(500).json({ message: "Error fetching barcodes" });
    }
  });

  app.get("/api/barcodes/:code", async (req, res) => {
    try {
      const codeOrId = req.params.code;
      let barcode;

      if (codeOrId.match(/^[0-9a-fA-F]{24}$/)) {
        barcode = await storage.getBarcodeById(codeOrId);
      }

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

  app.post("/api/barcodes", async (req, res) => {
    try {
      const barcode = await storage.createBarcode(req.body);
      res.json(barcode);
    } catch (err) {
      res.status(500).json({ message: "Error creating barcode", error: err });
    }
  });

  app.put("/api/barcodes/:id", async (req, res) => {
    try {
      const barcode = await storage.updateBarcode(req.params.id, req.body);
      res.json(barcode);
    } catch (err) {
      res.status(500).json({ message: "Error updating barcode", error: err });
    }
  });

  app.delete("/api/barcodes/:id", async (req, res) => {
    try {
      await storage.deleteBarcode(req.params.id);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ message: "Error deleting barcode", error: err });
    }
  });

  // --- Applications ---

  app.post("/api/applications", async (req, res) => {
    try {
      const application = await storage.createApplication(req.body);
      await sendApplicationEmail(req.body);
      res.json(application);
    } catch (err) {
      res.status(500).json({ message: "Error submitting application", error: err });
    }
  });

  app.get("/api/applications", async (req, res) => {
    try {
      const applications = await storage.getAllApplications();
      res.json(applications);
    } catch (err) {
      res.status(500).json({ message: "Error fetching applications" });
    }
  });

  app.patch("/api/applications/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const updated = await storage.updateApplicationStatus(req.params.id, status);
      res.json(updated);
    } catch (err) {
      res.status(500).json({ message: "Error updating application status" });
    }
  });

  // Sitemap
  app.get("/sitemap.xml", async (req, res) => {
    try {
      const barcodes = await storage.getAllBarcodes();
      const baseUrl = "https://shopmybarcode.in";

      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
      xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

      const staticPages = ['', '/about', '/contact', '/verify', '/terms', '/privacy'];
      for (const page of staticPages) {
        xml += `  <url>\n    <loc>${baseUrl}${page}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
      }

      for (const b of barcodes) {
        if (b.status === 'Active') {
          let dateStr = new Date().toISOString();
          if (b.createdAt) {
            dateStr = new Date(b.createdAt).toISOString();
          }
          xml += `  <url>\n    <loc>${baseUrl}/barcode/${b.barcode}</loc>\n    <lastmod>${dateStr}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
        }
      }

      xml += `</urlset>`;

      res.header('Content-Type', 'application/xml');
      res.send(xml);
    } catch (err) {
      res.status(500).send("Error generating sitemap");
    }
  });

  app.get("/google3654bafa8a07822d.html", (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.send("google-site-verification: google3654bafa8a07822d.html");
  });

  return httpServer;
}
