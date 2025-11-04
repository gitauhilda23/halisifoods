import { db } from "./db";
import { 
  users, ebooks, orders, newsletters, blogPosts,
  type User, type InsertUser,
  type Ebook, type InsertEbook,
  type Order, type InsertOrder,
  type Newsletter, type InsertNewsletter,
  type BlogPost, type InsertBlogPost
} from "@shared/schema";
import { eq, desc, like, and, gte, lte } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Ebook operations
  getAllEbooks(): Promise<Ebook[]>;
  getEbookById(id: string): Promise<Ebook | undefined>;
  getFeaturedEbooks(): Promise<Ebook[]>;
  getEbooksByCategory(category: string): Promise<Ebook[]>;
  searchEbooks(query: string): Promise<Ebook[]>;
  createEbook(ebook: InsertEbook): Promise<Ebook>;
  updateEbook(id: string, ebook: Partial<InsertEbook>): Promise<Ebook | undefined>;
  deleteEbook(id: string): Promise<void>;
  
  // Order operations
  createOrder(order: InsertOrder): Promise<Order>;
  getOrderById(id: string): Promise<Order | undefined>;
  getOrdersByEmail(email: string): Promise<Order[]>;
  getAllOrders(): Promise<Order[]>;
  updateOrderPaymentStatus(id: string, status: string, paymentId?: string): Promise<Order | undefined>;
  
  // Newsletter operations
  subscribeNewsletter(newsletter: InsertNewsletter): Promise<Newsletter>;
  getAllNewsletters(): Promise<Newsletter[]>;
  
  // Blog operations
  getAllBlogPosts(): Promise<BlogPost[]>;
  getBlogPostById(id: string): Promise<BlogPost | undefined>;
  getBlogPostsByCategory(category: string): Promise<BlogPost[]>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
}

export class DbStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Ebook operations
  async getAllEbooks(): Promise<Ebook[]> {
    return await db.select().from(ebooks).orderBy(desc(ebooks.createdAt));
  }

  async getEbookById(id: string): Promise<Ebook | undefined> {
    const result = await db.select().from(ebooks).where(eq(ebooks.id, id));
    return result[0];
  }

  async getFeaturedEbooks(): Promise<Ebook[]> {
    return await db.select().from(ebooks).where(eq(ebooks.featured, true)).limit(4);
  }

  async getEbooksByCategory(category: string): Promise<Ebook[]> {
    return await db.select().from(ebooks).where(eq(ebooks.category, category));
  }

  async searchEbooks(query: string): Promise<Ebook[]> {
    return await db.select().from(ebooks).where(like(ebooks.title, `%${query}%`));
  }

  async createEbook(ebook: InsertEbook): Promise<Ebook> {
    const result = await db.insert(ebooks).values(ebook).returning();
    return result[0];
  }

  async updateEbook(id: string, ebook: Partial<InsertEbook>): Promise<Ebook | undefined> {
    const result = await db.update(ebooks).set(ebook).where(eq(ebooks.id, id)).returning();
    return result[0];
  }

  async deleteEbook(id: string): Promise<void> {
    await db.delete(ebooks).where(eq(ebooks.id, id));
  }

  // Order operations
  async createOrder(order: InsertOrder): Promise<Order> {
    const result = await db.insert(orders).values(order).returning();
    return result[0];
  }

  async getOrderById(id: string): Promise<Order | undefined> {
    const result = await db.select().from(orders).where(eq(orders.id, id));
    return result[0];
  }

  async getOrdersByEmail(email: string): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.customerEmail, email));
  }

  async getAllOrders(): Promise<Order[]> {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  async updateOrderPaymentStatus(id: string, status: string, paymentId?: string): Promise<Order | undefined> {
    const updateData: any = { paymentStatus: status };
    if (paymentId) {
      updateData.stripePaymentIntentId = paymentId;
    }
    const result = await db.update(orders).set(updateData).where(eq(orders.id, id)).returning();
    return result[0];
  }

  // Newsletter operations
  async subscribeNewsletter(newsletter: InsertNewsletter): Promise<Newsletter> {
    const result = await db.insert(newsletters).values(newsletter).returning();
    return result[0];
  }

  async getAllNewsletters(): Promise<Newsletter[]> {
    return await db.select().from(newsletters).orderBy(desc(newsletters.subscribedAt));
  }

  // Blog operations
  async getAllBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts).where(eq(blogPosts.published, true)).orderBy(desc(blogPosts.createdAt));
  }

  async getBlogPostById(id: string): Promise<BlogPost | undefined> {
    const result = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return result[0];
  }

  async getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
    return await db.select().from(blogPosts).where(
      and(eq(blogPosts.category, category), eq(blogPosts.published, true))
    ).orderBy(desc(blogPosts.createdAt));
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const result = await db.insert(blogPosts).values(post).returning();
    return result[0];
  }

  async updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const result = await db.update(blogPosts).set(post).where(eq(blogPosts.id, id)).returning();
    return result[0];
  }
}

export const storage = new DbStorage();
