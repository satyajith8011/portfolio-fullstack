import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as UserType, InsertUser } from "@shared/schema";

// Extend Express User interface to include our User properties
declare global {
  namespace Express {
    interface User {
      id: number;
      username: string;
      role?: string;
      password: string;
      email?: string;
      fullName?: string;
      createdAt?: Date;
    }
  }
}

const scryptAsync = promisify(scrypt);

// Password hashing and verification
export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

// Admin middleware to check if user is an admin
export function isAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated() && req.user?.role === 'admin') {
    return next();
  }
  res.status(403).json({ message: "Access denied. Admin privileges required." });
}

// Authentication setup
export function setupAuth(app: Express) {
  // Session configuration
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "portfolio-session-secret",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production"
    }
  };

  // Configure session and passport
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Set up local strategy
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false, { message: "Invalid username or password" });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );

  // Serialize and deserialize user
  passport.serializeUser((user: Express.User, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Authentication routes
  // Login route
  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (error: Error | null, user: Express.User | false, info: { message?: string } | undefined) => {
      if (error) {
        return next(error);
      }
      if (!user) {
        return res.status(401).json({ message: info?.message || "Authentication failed" });
      }
      req.login(user, (loginErr) => {
        if (loginErr) {
          return next(loginErr);
        }
        return res.status(200).json({ 
          id: user.id,
          username: user.username,
          role: user.role
        });
      });
    })(req, res, next);
  });

  // Register route (typically only used for admin setup)
  app.post("/api/register", async (req, res, next) => {
    try {
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Hash password and create user
      const hashedPassword = await hashPassword(req.body.password);
      const user = await storage.createUser({
        ...req.body,
        password: hashedPassword
      });

      // Auto-login after registration
      req.login(user, (loginErr) => {
        if (loginErr) {
          return next(loginErr);
        }
        return res.status(201).json({ 
          id: user.id,
          username: user.username,
          role: user.role
        });
      });
    } catch (error) {
      next(error);
    }
  });

  // Logout route
  app.post("/api/logout", (req, res, next) => {
    req.logout((logoutErr) => {
      if (logoutErr) {
        return next(logoutErr);
      }
      res.status(200).json({ message: "Logged out successfully" });
    });
  });

  // Get current user
  app.get("/api/me", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    res.json({
      id: req.user?.id,
      username: req.user?.username,
      role: req.user?.role
    });
  });
}