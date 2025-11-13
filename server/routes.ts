import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEbookSchema, insertOrderSchema, insertNewsletterSchema, insertBlogPostSchema } from "@shared/schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import axios from "axios";
import path from "path";
import fs from "fs";

const JWT_SECRET = process.env.SESSION_SECRET || "your-secret-key";

function verifyAdminToken(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (!decoded.isAdmin) {
      return res.status(403).json({ error: "Forbidden" });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // ============ ALL YOUR ORIGINAL ROUTES (KEEP THESE) ============
  app.get("/api/ebooks", async (req, res) => {
    try {
      const { category, search } = req.query;
      let ebooks;
      if (search) {
        ebooks = await storage.searchEbooks(search as string);
      } else if (category) {
        ebooks = await storage.getEbooksByCategory(category as string);
      } else {
        ebooks = await storage.getAllEbooks();
      }
      res.json(ebooks);
    } catch (error) {
      console.error("Error fetching ebooks:", error);
      res.status(500).json({ error: "Failed to fetch ebooks" });
    }
  });

  app.get("/api/ebooks/featured", async (req, res) => {
    try {
      const ebooks = await storage.getFeaturedEbooks();
      res.json(ebooks);
    } catch (error) {
      console.error("Error fetching featured ebooks:", error);
      res.status(500).json({ error: "Failed to fetch featured ebooks" });
    }
  });

  app.get("/api/ebooks/:id", async (req, res) => {
    try {
      const ebook = await storage.getEbookById(req.params.id);
      if (!ebook) return res.status(404).json({ error: "eBook not found" });
      res.json(ebook);
    } catch (error) {
      console.error("Error fetching ebook:", error);
      res.status(500).json({ error: "Failed to fetch ebook" });
    }
  });

  app.post("/api/ebooks", verifyAdminToken, async (req, res) => {
    try {
      const validatedData = insertEbookSchema.parse(req.body);
      const ebook = await storage.createEbook(validatedData);
      res.status(201).json(ebook);
    } catch (error) {
      console.error("Error creating ebook:", error);
      res.status(400).json({ error: "Invalid ebook data" });
    }
  });

  app.patch("/api/ebooks/:id", verifyAdminToken, async (req, res) => {
    try {
      const ebook = await storage.updateEbook(req.params.id, req.body);
      if (!ebook) return res.status(404).json({ error: "eBook not found" });
      res.json(ebook);
    } catch (error) {
      console.error("Error updating ebook:", error);
      res.status(400).json({ error: "Failed to update ebook" });
    }
  });

  app.delete("/api/ebooks/:id", verifyAdminToken, async (req, res) => {
    try {
      await storage.deleteEbook(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting ebook:", error);
      res.status(500).json({ error: "Failed to delete ebook" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const validatedData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(validatedData);
      res.status(201).json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(400).json({ error: "Invalid order data" });
    }
  });

  // ============ PAYSTACK — FINAL WORKING VERSION (NO ERRORS) ============
  app.post("/api/verify-payment", async (req, res) => {
    const { reference, recipeId, email, phone } = req.body;

    if (!reference || !recipeId || !email) {
      return res.status(400).json({ success: false });
    }

    try {
      const response = await axios.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` } }
      );

      if (response.data.data.status !== "success") {
        return res.json({ success: false });
      }

      const amountPaid = response.data.data.amount / 100;

      await storage.createOrder({
        customerEmail: email,
        customerName: phone || "Paystack Customer",
        ebookId: recipeId,
        totalAmount: amountPaid.toFixed(2),
        paymentMethod: "paystack",
        quantity: 1,
        stripePaymentIntentId: null,
        paypalOrderId: null,
        paystackReference: reference,
      });

      const ordersList = await storage.getAllOrders();
      const order = ordersList.find(o => o.paystackReference === reference);
      if (order?.id) {
        await storage.updateOrderPaymentStatus(order.id, "completed", reference);
      }

      const ebook = await storage.getEbookById(recipeId);
      if (!ebook?.fileUrl) return res.json({ success: false });

      res.json({
        success: true,
        downloadUrl: `/api/download/${recipeId}?ref=${reference}`,
      });
    } catch (error: any) {
      console.error("Paystack error:", error.response?.data || error.message);
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
    } catch (err) {
      res.status(500).send("Error");
    }
  });

  // ============ END ============
  const httpServer = createServer(app);
  return httpServer;
}