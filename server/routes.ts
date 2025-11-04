import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEbookSchema, insertOrderSchema, insertNewsletterSchema, insertBlogPostSchema } from "@shared/schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.SESSION_SECRET || "your-secret-key";

// Middleware to verify admin JWT token
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
  // ============ EBOOK ROUTES ============
  
  // Get all eBooks
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

  // Get featured eBooks
  app.get("/api/ebooks/featured", async (req, res) => {
    try {
      const ebooks = await storage.getFeaturedEbooks();
      res.json(ebooks);
    } catch (error) {
      console.error("Error fetching featured ebooks:", error);
      res.status(500).json({ error: "Failed to fetch featured ebooks" });
    }
  });

  // Get single eBook by ID
  app.get("/api/ebooks/:id", async (req, res) => {
    try {
      const ebook = await storage.getEbookById(req.params.id);
      if (!ebook) {
        return res.status(404).json({ error: "eBook not found" });
      }
      res.json(ebook);
    } catch (error) {
      console.error("Error fetching ebook:", error);
      res.status(500).json({ error: "Failed to fetch ebook" });
    }
  });

  // Create eBook (admin only)
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

  // Update eBook (admin only)
  app.patch("/api/ebooks/:id", verifyAdminToken, async (req, res) => {
    try {
      const ebook = await storage.updateEbook(req.params.id, req.body);
      if (!ebook) {
        return res.status(404).json({ error: "eBook not found" });
      }
      res.json(ebook);
    } catch (error) {
      console.error("Error updating ebook:", error);
      res.status(400).json({ error: "Failed to update ebook" });
    }
  });

  // Delete eBook (admin only)
  app.delete("/api/ebooks/:id", verifyAdminToken, async (req, res) => {
    try {
      await storage.deleteEbook(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting ebook:", error);
      res.status(500).json({ error: "Failed to delete ebook" });
    }
  });

  // ============ ORDER ROUTES ============

  // Create order
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

  // Get order by ID
  app.get("/api/orders/:id", async (req, res) => {
    try {
      const order = await storage.getOrderById(req.params.id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  // Get orders by email
  app.get("/api/orders", async (req, res) => {
    try {
      const { email } = req.query;
      if (email) {
        const orders = await storage.getOrdersByEmail(email as string);
        res.json(orders);
      } else {
        // Admin only - get all orders
        const orders = await storage.getAllOrders();
        res.json(orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  // Update order payment status
  app.patch("/api/orders/:id/payment", async (req, res) => {
    try {
      const { status, paymentId } = req.body;
      const order = await storage.updateOrderPaymentStatus(req.params.id, status, paymentId);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      console.error("Error updating order:", error);
      res.status(500).json({ error: "Failed to update order" });
    }
  });

  // ============ NEWSLETTER ROUTES ============

  // Subscribe to newsletter
  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const validatedData = insertNewsletterSchema.parse(req.body);
      const subscription = await storage.subscribeNewsletter(validatedData);
      res.status(201).json(subscription);
    } catch (error: any) {
      if (error?.message?.includes("unique")) {
        return res.status(400).json({ error: "Email already subscribed" });
      }
      console.error("Error subscribing to newsletter:", error);
      res.status(400).json({ error: "Failed to subscribe" });
    }
  });

  // Get all newsletter subscribers (admin only)
  app.get("/api/newsletter", verifyAdminToken, async (req, res) => {
    try {
      const subscribers = await storage.getAllNewsletters();
      res.json(subscribers);
    } catch (error) {
      console.error("Error fetching subscribers:", error);
      res.status(500).json({ error: "Failed to fetch subscribers" });
    }
  });

  // ============ BLOG ROUTES ============

  // Get all blog posts
  app.get("/api/blog", async (req, res) => {
    try {
      const { category } = req.query;
      
      let posts;
      if (category) {
        posts = await storage.getBlogPostsByCategory(category as string);
      } else {
        posts = await storage.getAllBlogPosts();
      }
      
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  // Get single blog post
  app.get("/api/blog/:id", async (req, res) => {
    try {
      const post = await storage.getBlogPostById(req.params.id);
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });

  // Create blog post (admin only)
  app.post("/api/blog", verifyAdminToken, async (req, res) => {
    try {
      const validatedData = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      console.error("Error creating blog post:", error);
      res.status(400).json({ error: "Invalid blog post data" });
    }
  });

  // Update blog post (admin only)
  app.patch("/api/blog/:id", verifyAdminToken, async (req, res) => {
    try {
      const post = await storage.updateBlogPost(req.params.id, req.body);
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error updating blog post:", error);
      res.status(400).json({ error: "Failed to update blog post" });
    }
  });

  // ============ AUTH ROUTES ============

  // Admin login
  app.post("/api/auth/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      const user = await storage.getUserByUsername(username);
      if (!user || !user.isAdmin) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, isAdmin: user.isAdmin },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.json({ token, user: { id: user.id, username: user.username, isAdmin: user.isAdmin } });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Verify admin token
  app.get("/api/auth/admin/verify", verifyAdminToken, async (req: any, res) => {
    res.json({ valid: true, user: req.user });
  });

  // ============ ANALYTICS ROUTES (Admin) ============

  app.get("/api/analytics/stats", verifyAdminToken, async (req, res) => {
    try {
      const orders = await storage.getAllOrders();
      const newsletters = await storage.getAllNewsletters();
      const ebooks = await storage.getAllEbooks();

      const completedOrders = orders.filter(o => o.paymentStatus === "completed");
      const totalSales = completedOrders.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0);
      
      const ebooksSold = completedOrders.reduce((sum, order) => sum + order.quantity, 0);

      res.json({
        totalSales: totalSales.toFixed(2),
        totalOrders: completedOrders.length,
        ebooksSold,
        newsletterSubscribers: newsletters.length,
        totalEbooks: ebooks.length,
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
