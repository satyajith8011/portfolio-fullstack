import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission route
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const savedMessage = await storage.createContactMessage(validatedData);
      res.status(200).json({ success: true, message: "Message received successfully" });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ 
          success: false, 
          message: "Validation error", 
          errors: validationError.details 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: "Failed to save message" 
        });
      }
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
