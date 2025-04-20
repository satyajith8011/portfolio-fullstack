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
  bio: text("bio"),
  profilePhoto: text("profile_photo"),
  headline: text("headline"),
  quote: text("quote"),
  resumeUrl: text("resume_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
  role: true,
  bio: true,
  profilePhoto: true,
  headline: true,
  quote: true,
  resumeUrl: true,
});

// Biography Timeline
export const biographyEntries = pgTable("biography_entries", {
  id: serial("id").primaryKey(),
  year: integer("year").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // 'education', 'work', 'personal', etc.
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertBiographyEntrySchema = createInsertSchema(biographyEntries).pick({
  year: true,
  title: true,
  description: true,
  type: true,
});

// Skills
export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // 'frontend', 'backend', 'tools', 'db', 'blockchain', 'soft'
  icon: text("icon"),
  proficiency: integer("proficiency"), // 1-5 rating
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSkillSchema = createInsertSchema(skills).pick({
  name: true,
  category: true,
  icon: true,
  proficiency: true,
});

// Current Work/Learning
export const currentFocus = pgTable("current_focus", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(), // 'learning', 'working'
  priority: integer("priority"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCurrentFocusSchema = createInsertSchema(currentFocus).pick({
  title: true,
  description: true,
  type: true,
  priority: true,
});

// Social Media Links
export const socialLinks = pgTable("social_links", {
  id: serial("id").primaryKey(),
  platform: text("platform").notNull(),
  url: text("url").notNull(),
  icon: text("icon"),
  displayOrder: integer("display_order"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSocialLinkSchema = createInsertSchema(socialLinks).pick({
  platform: true,
  url: true,
  icon: true,
  displayOrder: true,
});

// Testimonials
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  company: text("company"),
  photoUrl: text("photo_url"),
  content: text("content").notNull(),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTestimonialSchema = createInsertSchema(testimonials).pick({
  name: true,
  role: true,
  company: true,
  photoUrl: true,
  content: true,
  featured: true,
});

// Contact Information
export const contactInfo = pgTable("contact_info", {
  id: serial("id").primaryKey(),
  type: text("type").notNull().unique(), // 'email', 'phone', 'location', 'linkedin', 'github', 'whatsapp'
  value: text("value").notNull(),
  public: boolean("public").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertContactInfoSchema = createInsertSchema(contactInfo).pick({
  type: true,
  value: true,
  public: true,
});

// Hero Section
export const heroSettings = pgTable("hero_settings", {
  id: serial("id").primaryKey(),
  profileImage: text("profile_image"),
  title: text("title"),
  subtitle: text("subtitle"),
  tagline: text("tagline"),
  background: text("background"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertHeroSettingsSchema = createInsertSchema(heroSettings).pick({
  profileImage: true,
  title: true, 
  subtitle: true,
  tagline: true,
  background: true,
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

export type InsertBiographyEntry = z.infer<typeof insertBiographyEntrySchema>;
export type BiographyEntry = typeof biographyEntries.$inferSelect;

export type InsertSkill = z.infer<typeof insertSkillSchema>;
export type Skill = typeof skills.$inferSelect;

export type InsertCurrentFocus = z.infer<typeof insertCurrentFocusSchema>;
export type CurrentFocus = typeof currentFocus.$inferSelect;

export type InsertSocialLink = z.infer<typeof insertSocialLinkSchema>;
export type SocialLink = typeof socialLinks.$inferSelect;

export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type Testimonial = typeof testimonials.$inferSelect;

export type InsertContactInfo = z.infer<typeof insertContactInfoSchema>;
export type ContactInfo = typeof contactInfo.$inferSelect;

export type InsertHeroSetting = z.infer<typeof insertHeroSettingsSchema>;
export type HeroSetting = typeof heroSettings.$inferSelect;
