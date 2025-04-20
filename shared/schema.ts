import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  fullName: text("full_name"),
  role: text("role").default("user").notNull(), // 'admin' or 'user'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
  role: true,
});

// Contact messages 
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  read: boolean("read").default(false),
});

export const insertContactSchema = createInsertSchema(contactMessages).pick({
  name: true,
  email: true,
  subject: true,
  message: true,
});

// Projects table
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  demoUrl: text("demo_url"),
  githubUrl: text("github_url"),
  technologies: text("technologies").array(),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertProjectSchema = createInsertSchema(projects).pick({
  title: true,
  description: true,
  imageUrl: true,
  demoUrl: true,
  githubUrl: true,
  technologies: true,
  featured: true,
});

// Blog posts table
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  summary: text("summary").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  tags: text("tags").array(),
  published: boolean("published").default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).pick({
  title: true,
  slug: true,
  summary: true,
  content: true,
  imageUrl: true,
  tags: true, 
  published: true,
  publishedAt: true,
});

// Achievements/certifications table
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  issuer: text("issuer").notNull(),
  date: timestamp("date").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  certificateUrl: text("certificate_url"),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAchievementSchema = createInsertSchema(achievements).pick({
  title: true,
  issuer: true,
  date: true,
  description: true,
  imageUrl: true,
  certificateUrl: true,
  featured: true,
});

// Site settings/content table (for configurable text, taglines, etc.)
export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value"),
  valueJson: json("value_json"),
  type: text("type").notNull(), // 'text', 'json', 'array', etc.
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSiteSettingsSchema = createInsertSchema(siteSettings).pick({
  key: true,
  value: true,
  valueJson: true,
  type: true,
});

// Type definitions for TypeScript
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertContact = z.infer<typeof insertContactSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type Achievement = typeof achievements.$inferSelect;

export type InsertSiteSetting = z.infer<typeof insertSiteSettingsSchema>;
export type SiteSetting = typeof siteSettings.$inferSelect;
