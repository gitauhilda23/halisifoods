import { db } from "./db";
import { ebooks, blogPosts, users } from "@shared/schema";
import bcrypt from "bcrypt";

async function seed() {
  console.log("Seeding database...");

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await db.insert(users).values({
    username: "admin",
    password: hashedPassword,
    isAdmin: true,
  }).onConflictDoNothing();

  // Seed eBooks
  const ebooksData = [
    {
      title: "Kenyan Breakfast Delights",
      description: "Start your day the Kenyan way with this comprehensive collection of traditional breakfast recipes. From the beloved mandazi to aromatic chai, this eBook brings you authentic recipes that have been passed down through generations.",
      price: "12.99",
      category: "Breakfast",
      recipeCount: 25,
      imageUrl: "/assets/generated_images/Breakfast_recipes_eBook_cover_9d71df24.png",
      ingredients: ["Wheat flour", "Coconut milk", "Sugar", "Cardamom", "Yeast", "Vegetable oil", "Tea leaves", "Milk"],
      featured: true,
    },
    {
      title: "Classic Main Dishes",
      description: "Master the art of preparing authentic Kenyan main courses like pilau, ugali, and nyama choma. This collection features 35 detailed recipes with step-by-step instructions.",
      price: "15.99",
      category: "Main Dishes",
      recipeCount: 35,
      imageUrl: "/assets/generated_images/Main_dishes_eBook_cover_27176a57.png",
      ingredients: ["Rice", "Meat", "Onions", "Tomatoes", "Spices", "Maize flour", "Vegetables"],
      featured: true,
    },
    {
      title: "Vegetarian Favorites",
      description: "Discover delicious plant-based Kenyan recipes featuring fresh vegetables and traditional spices. Perfect for vegetarians and anyone looking to add more variety to their meals.",
      price: "11.99",
      category: "Vegetarian",
      recipeCount: 28,
      imageUrl: "/assets/generated_images/Vegetarian_recipes_eBook_cover_bb33c52b.png",
      ingredients: ["Kale", "Beans", "Lentils", "Coconut", "Spices", "Vegetables", "Corn"],
      featured: true,
    },
    {
      title: "Snacks & Street Food",
      description: "Learn to make popular Kenyan snacks and street food favorites at home. From samosas to chapati, bring the flavors of Kenyan streets to your kitchen.",
      price: "9.99",
      category: "Snacks",
      recipeCount: 20,
      imageUrl: "/assets/generated_images/Snacks_eBook_cover_ede3e266.png",
      ingredients: ["Flour", "Potatoes", "Meat", "Spices", "Vegetables", "Oil"],
      featured: true,
    },
    {
      title: "Traditional Swahili Cuisine",
      description: "Explore coastal flavors with authentic Swahili recipes from Mombasa and beyond. Discover the unique blend of African, Arabic, and Indian influences.",
      price: "14.99",
      category: "Main Dishes",
      recipeCount: 30,
      imageUrl: "/assets/generated_images/Main_dishes_eBook_cover_27176a57.png",
      ingredients: ["Coconut", "Seafood", "Rice", "Spices", "Tamarind", "Cardamom"],
      featured: false,
    },
    {
      title: "Quick Weeknight Dinners",
      description: "Easy and delicious Kenyan recipes perfect for busy weeknights. Get dinner on the table in 30 minutes or less.",
      price: "10.99",
      category: "Healthy Recipes",
      recipeCount: 22,
      imageUrl: "/assets/generated_images/Vegetarian_recipes_eBook_cover_bb33c52b.png",
      ingredients: ["Vegetables", "Rice", "Beans", "Spices", "Eggs", "Tomatoes"],
      featured: false,
    },
  ];

  for (const ebook of ebooksData) {
    await db.insert(ebooks).values(ebook).onConflictDoNothing();
  }

  // Seed blog posts
  const blogPostsData = [
    {
      title: "The Art of Perfect Nyama Choma",
      excerpt: "Learn the traditional techniques for grilling the perfect nyama choma, from selecting the right cuts to achieving that smoky flavor that makes this dish legendary.",
      content: "Nyama choma is more than just grilled meat - it's a cultural experience that brings people together. In this guide, we'll explore the traditional methods of preparing this beloved Kenyan dish...",
      author: "Chef Wanjiku",
      imageUrl: "/assets/generated_images/Traditional_cooking_blog_image_a3fe7a34.png",
      category: "Cooking Tips",
      published: true,
    },
    {
      title: "Essential Kenyan Spices Guide",
      excerpt: "Discover the aromatic world of Kenyan spices and learn how to use them to create authentic flavors in your cooking.",
      content: "Kenyan cuisine is known for its bold, aromatic flavors achieved through careful use of spices. Let's explore the essential spices every Kenyan kitchen should have...",
      author: "Maria Njeri",
      imageUrl: "/assets/generated_images/Traditional_cooking_blog_image_a3fe7a34.png",
      category: "Ingredients",
      published: true,
    },
    {
      title: "Making Ugali: A Step-by-Step Guide",
      excerpt: "Master the technique of making perfect ugali every time with this comprehensive guide to Kenya's beloved staple food.",
      content: "Ugali is the foundation of many Kenyan meals. Getting the consistency just right takes practice, but with these tips, you'll be making perfect ugali in no time...",
      author: "Chef Wanjiku",
      imageUrl: "/assets/generated_images/Traditional_cooking_blog_image_a3fe7a34.png",
      category: "Traditional Recipes",
      published: true,
    },
  ];

  for (const post of blogPostsData) {
    await db.insert(blogPosts).values(post).onConflictDoNothing();
  }

  console.log("Database seeded successfully!");
}

seed().catch(console.error);
