import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { initSendGrid, sendEmail, createContactFormEmailHtml } from "./sendgrid";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize SendGrid if API key is available
  const sendgridApiKey = process.env.SENDGRID_API_KEY;
  const emailEnabled = initSendGrid(sendgridApiKey);
  console.log(`Email functionality ${emailEnabled ? 'enabled' : 'disabled'}`);

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
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ 
          success: false, 
          message: "Validation error", 
          errors: validationError.details 
        });
      } else {
        console.error('Contact form error:', error);
        res.status(500).json({ 
          success: false, 
          message: "Failed to process your message" 
        });
      }
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
