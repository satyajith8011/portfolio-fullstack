import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertContactSchema, 
  insertProjectSchema, 
  insertBlogPostSchema, 
  insertAchievementSchema,
  insertSiteSettingsSchema
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { initSendGrid, sendEmail, createContactFormEmailHtml } from "./sendgrid";
import { setupAuth, isAdmin, hashPassword } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);

  // Initialize SendGrid if API key is available
  const sendgridApiKey = process.env.SENDGRID_API_KEY;
  const emailEnabled = initSendGrid(sendgridApiKey);
  console.log(`Email functionality ${emailEnabled ? 'enabled' : 'disabled'}`);

  // Helper function for error handling
  const handleError = (res: Response, error: any) => {
    if (error instanceof ZodError) {
      const validationError = fromZodError(error);
      return res.status(400).json({ 
        success: false, 
        message: "Validation error", 
        errors: validationError.details 
      });
    } else {
      console.error('API error:', error);
      return res.status(500).json({ 
        success: false, 
        message: error.message || "An error occurred" 
      });
    }
  };

  // PUBLIC ROUTES

  // Contact form submission route
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const savedMessage = await storage.createContactMessage(validatedData);
      
      // Send email notification if SendGrid is configured
      if (emailEnabled) {
        const { name, email, subject, message } = validatedData;
        const htmlContent = createContactFormEmailHtml(name, email, subject, message);
        
        // Send email to portfolio owner
        await sendEmail(
          'satyajith500@gmail.com', // Your email address 
          'noreply@portfolio.com', // Should be a verified sender in SendGrid
          `Portfolio Contact: ${subject}`,
          htmlContent,
          email // So you can reply directly to the sender
        );
      }
      
      res.status(200).json({ success: true, message: "Message received successfully" });
    } catch (error) {
      handleError(res, error);
    }
  });

  // Get featured projects
  app.get("/api/projects/featured", async (req, res) => {
    try {
      const projects = await storage.getFeaturedProjects();
      res.json(projects);
    } catch (error) {
      handleError(res, error);
    }
  });

  // Get all public projects
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getAllProjects();
      res.json(projects);
    } catch (error) {
      handleError(res, error);
    }
  });

  // Get a single project
  app.get("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProject(id);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json(project);
    } catch (error) {
      handleError(res, error);
    }
  });

  // Get published blog posts
  app.get("/api/blog", async (req, res) => {
    try {
      const posts = await storage.getAllBlogPosts(false); // Only published posts
      res.json(posts);
    } catch (error) {
      handleError(res, error);
    }
  });

  // Get a single blog post by slug
  app.get("/api/blog/:slug", async (req, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      
      if (!post || !post.published) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      res.json(post);
    } catch (error) {
      handleError(res, error);
    }
  });

  // Get featured achievements
  app.get("/api/achievements/featured", async (req, res) => {
    try {
      const achievements = await storage.getFeaturedAchievements();
      res.json(achievements);
    } catch (error) {
      handleError(res, error);
    }
  });

  // Get all achievements
  app.get("/api/achievements", async (req, res) => {
    try {
      const achievements = await storage.getAllAchievements();
      res.json(achievements);
    } catch (error) {
      handleError(res, error);
    }
  });

  // Get a single achievement
  app.get("/api/achievements/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const achievement = await storage.getAchievement(id);
      
      if (!achievement) {
        return res.status(404).json({ message: "Achievement not found" });
      }
      
      res.json(achievement);
    } catch (error) {
      handleError(res, error);
    }
  });

  // Get site settings
  app.get("/api/settings/:key", async (req, res) => {
    try {
      const setting = await storage.getSetting(req.params.key);
      
      if (!setting) {
        return res.status(404).json({ message: "Setting not found" });
      }
      
      res.json(setting);
    } catch (error) {
      handleError(res, error);
    }
  });

  // ADMIN ROUTES (protected)

  // Create the default admin user if none exists
  app.get("/api/setup-admin", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      
      if (users.length === 0) {
        // Create default admin user with new credentials
        const password = await hashPassword("bootstrapsatya2025");
        await storage.createUser({
          username: "admin",
          password,
          role: "admin"
        });
        
        return res.status(201).json({ message: "Admin user created successfully" });
      }
      
      return res.status(200).json({ message: "Setup already completed" });
    } catch (error) {
      handleError(res, error);
    }
  });

  // Get all contact messages (admin only)
  app.get("/api/admin/messages", isAdmin, async (req, res) => {
    try {
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error) {
      handleError(res, error);
    }
  });

  // Mark message as read
  app.patch("/api/admin/messages/:id/read", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.markContactMessageAsRead(id);
      res.json({ success: true });
    } catch (error) {
      handleError(res, error);
    }
  });

  // Delete message
  app.delete("/api/admin/messages/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteContactMessage(id);
      res.json({ success: true });
    } catch (error) {
      handleError(res, error);
    }
  });

  // Create project
  app.post("/api/admin/projects", isAdmin, async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    } catch (error) {
      handleError(res, error);
    }
  });

  // Update project
  app.patch("/api/admin/projects/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.updateProject(id, req.body);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json(project);
    } catch (error) {
      handleError(res, error);
    }
  });

  // Delete project
  app.delete("/api/admin/projects/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteProject(id);
      res.json({ success: true });
    } catch (error) {
      handleError(res, error);
    }
  });

  // Create blog post
  app.post("/api/admin/blog", isAdmin, async (req, res) => {
    try {
      const validatedData = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      handleError(res, error);
    }
  });

  // Get all blog posts (including unpublished)
  app.get("/api/admin/blog", isAdmin, async (req, res) => {
    try {
      const posts = await storage.getAllBlogPosts(true); // Include unpublished
      res.json(posts);
    } catch (error) {
      handleError(res, error);
    }
  });

  // Update blog post
  app.patch("/api/admin/blog/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const post = await storage.updateBlogPost(id, req.body);
      
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      res.json(post);
    } catch (error) {
      handleError(res, error);
    }
  });

  // Delete blog post
  app.delete("/api/admin/blog/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteBlogPost(id);
      res.json({ success: true });
    } catch (error) {
      handleError(res, error);
    }
  });

  // Create achievement
  app.post("/api/admin/achievements", isAdmin, async (req, res) => {
    try {
      const validatedData = insertAchievementSchema.parse(req.body);
      const achievement = await storage.createAchievement(validatedData);
      res.status(201).json(achievement);
    } catch (error) {
      handleError(res, error);
    }
  });

  // Update achievement
  app.patch("/api/admin/achievements/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const achievement = await storage.updateAchievement(id, req.body);
      
      if (!achievement) {
        return res.status(404).json({ message: "Achievement not found" });
      }
      
      res.json(achievement);
    } catch (error) {
      handleError(res, error);
    }
  });

  // Delete achievement
  app.delete("/api/admin/achievements/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteAchievement(id);
      res.json({ success: true });
    } catch (error) {
      handleError(res, error);
    }
  });

  // Update site setting
  app.put("/api/admin/settings/:key", isAdmin, async (req, res) => {
    try {
      const { key } = req.params;
      const { value, valueJson, type } = req.body;
      
      const setting = await storage.updateSetting(key, value, valueJson);
      res.json(setting);
    } catch (error) {
      handleError(res, error);
    }
  });

  // Get all site settings
  app.get("/api/admin/settings", isAdmin, async (req, res) => {
    try {
      const settings = await storage.getAllSettings();
      res.json(settings);
    } catch (error) {
      handleError(res, error);
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
