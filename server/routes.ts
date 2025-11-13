// server/routes.ts  ← REPLACE YOUR ENTIRE FILE WITH THIS

import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEbookSchema, insertOrderSchema, newsletters } from "../shared/schema";
import { db } from "./db";
    // ← YOUR REAL TABLE
import { eq } from "drizzle-orm";
import axios from "axios";
import path from "path";
import fs from "fs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.SESSION_SECRET || "your-secret-key";

function verifyAdminToken(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (!decoded.isAdmin) return res.status(403).json({ error: "Forbidden" });
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // ==================== EBOOKS ====================
  app.get("/api/ebooks", async (req, res) => {
    try {
      const { category, search } = req.query;
      let ebooks;
      if (search) ebooks = await storage.searchEbooks(search as string);
      else if (category) ebooks = await storage.getEbooksByCategory(category as string);
      else ebooks = await storage.getAllEbooks();
      res.json(ebooks);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Failed to fetch ebooks" });
    }
  });

  app.get("/api/ebooks/featured", async (_req, res) => {
    try { res.json(await storage.getFeaturedEbooks()); }
    catch (e) { console.error(e); res.status(500).json({ error: "Failed" }); }
  });

  app.get("/api/ebooks/:id", async (req, res) => {
    try {
      const ebook = await storage.getEbookById(req.params.id);
      ebook ? res.json(ebook) : res.status(404).json({ error: "Not found" });
    } catch (e) { console.error(e); res.status(500).json({ error: "Failed" }); }
  });

  app.post("/api/ebooks", verifyAdminToken, async (req, res) => {
    try {
      const data = insertEbookSchema.parse(req.body);
      res.status(201).json(await storage.createEbook(data));
    } catch (e) { console.error(e); res.status(400).json({ error: "Invalid data" }); }
  });

  app.patch("/api/ebooks/:id", verifyAdminToken, async (req, res) => {
    try {
      const ebook = await storage.updateEbook(req.params.id, req.body);
      ebook ? res.json(ebook) : res.status(404).json({ error: "Not found" });
    } catch (e) { console.error(e); res.status(400).json({ error: "Failed" }); }
  });

  app.delete("/api/ebooks/:id", verifyAdminToken, async (req, res) => {
    try { await storage.deleteEbook(req.params.id); res.status(204).send(); }
    catch (e) { console.error(e); res.status(500).json({ error: "Failed" }); }
  });

  // ==================== ORDERS ====================
  app.post("/api/orders", async (req, res) => {
    try {
      const data = insertOrderSchema.parse(req.body);
      res.status(201).json(await storage.createOrder(data));
    } catch (e) { console.error(e); res.status(400).json({ error: "Invalid order" }); }
  });

  // ==================== PAYSTACK ====================
  app.post("/api/verify-payment", async (req, res) => {
    const { reference, recipeId, email, phone } = req.body;
    if (!reference || !recipeId || !email) return res.status(400).json({ success: false });

    try {
      const verify = await axios.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` } }
      );

      if (verify.data.data.status !== "success") return res.json({ success: false });

      const amount = (verify.data.data.amount / 100).toFixed(2);

      await storage.createOrder({
        customerEmail: email,
        customerName: phone || "Paystack Customer",
        ebookId: recipeId,
        totalAmount: amount,
        paymentMethod: "paystack",
        quantity: 1,
        paystackReference: reference,
      });

      // Update status
      const orders = await storage.getAllOrders();
      const order = orders.find(o => o.paystackReference === reference);
      if (order?.id) await storage.updateOrderPaymentStatus(order.id, "completed", reference);

      const ebook = await storage.getEbookById(recipeId);
      if (!ebook?.fileUrl) return res.json({ success: false });

      res.json({ success: true, downloadUrl: `/api/download/${recipeId}?ref=${reference}` });
    } catch (e: any) {
      console.error("Paystack error:", e.response?.data || e.message);
      res.json({ success: false });
    }
  });

  app.get("/api/download/:id", async (req, res) => {
    const { id } = req.params;
    const ref = req.query.ref as string;
    if (!ref) return res.status(403).send("Invalid");

    try {
      const orders = await storage.getAllOrders();
      const order = orders.find(o => o.paystackReference === ref && o.ebookId === id);
      if (!order) return res.status(403).send("Unauthorized");

      const ebook = await storage.getEbookById(id);
      if (!ebook?.fileUrl) return res.status(404).send("Not found");

      const filePath = path.join(process.cwd(), ebook.fileUrl);
      if (!fs.existsSync(filePath)) return res.status(404).send("PDF missing");

      res.download(filePath, `${ebook.title}.pdf`);
    } catch { res.status(500).send("Error"); }
  });

  // ==================== NEWSLETTER – FLAWLESS ====================
  app.post("/api/newsletter", async (req, res) => {
    try {
      const { email } = req.body;

      if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ error: "Valid email required" });
      }

      const normalized = email.toLowerCase().trim();

      // Prevent duplicates
      const exists = await db
        .select()
        .from(newsletters)
        .where(eq(newsletters.email, normalized))
        .limit(1);

      if (exists.length > 0) {
        return res.status(200).json({ success: true });
      }

      // Insert using your perfect newsletters table
      await db.insert(newsletters).values({ email: normalized });

      console.log("New subscriber:", normalized);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Newsletter error:", error);
      res.status(500).json({ error: "Subscription failed" });
    }
  });

  // ==================== SERVER ====================
  const httpServer = createServer(app);
  return httpServer;
}