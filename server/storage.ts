import { 
  users, 
  type User, 
  type InsertUser, 
  contactMessages, 
  type ContactMessage, 
  type InsertContact,
  projects,
  type Project,
  type InsertProject,
  blogPosts,
  type BlogPost,
  type InsertBlogPost,
  achievements,
  type Achievement,
  type InsertAchievement,
  siteSettings,
  type SiteSetting,
  type InsertSiteSetting,
  contactInfo,
  type ContactInfo,
  type InsertContactInfo,
  socialLinks,
  type SocialLink,
  type InsertSocialLink,
  testimonials,
  type Testimonial,
  type InsertTestimonial,
  heroSettings,
  type HeroSetting,
  type InsertHeroSetting,
  currentFocus,
  type CurrentFocus,
  type InsertCurrentFocus,
  biographyEntries,
  type BiographyEntry,
  type InsertBiographyEntry,
  skills,
  type Skill,
  type InsertSkill
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, and, sql, like, isNull, not, lt, gt } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

// Database storage interface
export interface IStorage {
  // Session store
  sessionStore: session.Store;

  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  getAllUsers(): Promise<User[]>;

  // Contact message operations
  createContactMessage(message: InsertContact): Promise<ContactMessage>;
  getContactMessages(): Promise<ContactMessage[]>;
  getContactMessage(id: number): Promise<ContactMessage | undefined>;
  markContactMessageAsRead(id: number): Promise<boolean>;
  deleteContactMessage(id: number): Promise<boolean>;

  // Project operations
  createProject(project: InsertProject): Promise<Project>;
  getProject(id: number): Promise<Project | undefined>;
  getAllProjects(): Promise<Project[]>;
  getFeaturedProjects(): Promise<Project[]>;
  updateProject(id: number, projectData: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;

  // Blog post operations
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getAllBlogPosts(includeUnpublished?: boolean): Promise<BlogPost[]>;
  updateBlogPost(id: number, postData: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;

  // Achievement operations
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  getAchievement(id: number): Promise<Achievement | undefined>;
  getAllAchievements(): Promise<Achievement[]>;
  getFeaturedAchievements(): Promise<Achievement[]>;
  updateAchievement(id: number, achievementData: Partial<InsertAchievement>): Promise<Achievement | undefined>;
  deleteAchievement(id: number): Promise<boolean>;

  // Site settings operations
  getSetting(key: string): Promise<SiteSetting | undefined>;
  getAllSettings(): Promise<SiteSetting[]>;
  updateSetting(key: string, value: string | null, valueJson?: any): Promise<SiteSetting | undefined>;
  
  // Contact info operations
  getContactInfo(): Promise<ContactInfo[]>;
  createContactInfo(contactInfo: InsertContactInfo): Promise<ContactInfo>;
  updateContactInfo(id: number, data: Partial<InsertContactInfo>): Promise<ContactInfo | undefined>;
  deleteContactInfo(id: number): Promise<boolean>;
  
  // Social links operations
  getSocialLinks(): Promise<SocialLink[]>;
  createSocialLink(socialLink: InsertSocialLink): Promise<SocialLink>;
  updateSocialLink(id: number, data: Partial<InsertSocialLink>): Promise<SocialLink | undefined>;
  deleteSocialLink(id: number): Promise<boolean>;
  updateSocialLinkOrder(id: number, direction: 'up' | 'down'): Promise<SocialLink | undefined>;
  
  // Testimonials operations
  getTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  updateTestimonial(id: number, data: Partial<InsertTestimonial>): Promise<Testimonial | undefined>;
  deleteTestimonial(id: number): Promise<boolean>;
  
  // Hero settings operations
  getHeroSettings(): Promise<HeroSetting | undefined>;
  updateHeroSettings(data: Partial<InsertHeroSetting>): Promise<HeroSetting>;
  
  // Current focus operations
  getCurrentFocus(): Promise<CurrentFocus[]>;
  createCurrentFocus(focus: InsertCurrentFocus): Promise<CurrentFocus>;
  updateCurrentFocus(id: number, data: Partial<InsertCurrentFocus>): Promise<CurrentFocus | undefined>;
  deleteCurrentFocus(id: number): Promise<boolean>;
  updateCurrentFocusOrder(id: number, direction: 'up' | 'down'): Promise<CurrentFocus | undefined>;
  
  // Resume operations
  getResumeSetting(): Promise<{ url: string; is_public: boolean; type: string } | undefined>;
  updateResumeSetting(data: { url: string; is_public: boolean; type: string }): Promise<{ url: string; is_public: boolean; type: string }>;
  deleteResumeSetting(): Promise<boolean>;
  
  // Biography operations
  getBiographyEntries(): Promise<BiographyEntry[]>;
  createBiographyEntry(entry: InsertBiographyEntry): Promise<BiographyEntry>;
  updateBiographyEntry(id: number, data: Partial<InsertBiographyEntry>): Promise<BiographyEntry | undefined>;
  deleteBiographyEntry(id: number): Promise<boolean>;
  
  // Skills operations
  getSkills(): Promise<Skill[]>;
  createSkill(skill: InsertSkill): Promise<Skill>;
  updateSkill(id: number, data: Partial<InsertSkill>): Promise<Skill | undefined>;
  deleteSkill(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await db
      .delete(users)
      .where(eq(users.id, id));
    return true;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  // Contact message operations
  async createContactMessage(insertMessage: InsertContact): Promise<ContactMessage> {
    const [message] = await db
      .insert(contactMessages)
      .values(insertMessage)
      .returning();
    return message;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    const messages = await db
      .select()
      .from(contactMessages)
      .orderBy(desc(contactMessages.createdAt));
    return messages;
  }

  async getContactMessage(id: number): Promise<ContactMessage | undefined> {
    const [message] = await db
      .select()
      .from(contactMessages)
      .where(eq(contactMessages.id, id));
    return message;
  }

  async markContactMessageAsRead(id: number): Promise<boolean> {
    await db
      .update(contactMessages)
      .set({ read: true })
      .where(eq(contactMessages.id, id));
    return true;
  }

  async deleteContactMessage(id: number): Promise<boolean> {
    await db
      .delete(contactMessages)
      .where(eq(contactMessages.id, id));
    return true;
  }

  // Project operations
  async createProject(project: InsertProject): Promise<Project> {
    const [newProject] = await db
      .insert(projects)
      .values(project)
      .returning();
    return newProject;
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, id));
    return project;
  }

  async getAllProjects(): Promise<Project[]> {
    return await db
      .select()
      .from(projects)
      .orderBy(desc(projects.createdAt));
  }

  async getFeaturedProjects(): Promise<Project[]> {
    return await db
      .select()
      .from(projects)
      .where(eq(projects.featured, true))
      .orderBy(desc(projects.createdAt));
  }

  async updateProject(id: number, projectData: Partial<InsertProject>): Promise<Project | undefined> {
    const [updatedProject] = await db
      .update(projects)
      .set({
        ...projectData,
        updatedAt: new Date()
      })
      .where(eq(projects.id, id))
      .returning();
    return updatedProject;
  }

  async deleteProject(id: number): Promise<boolean> {
    await db
      .delete(projects)
      .where(eq(projects.id, id));
    return true;
  }

  // Blog post operations
  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [newPost] = await db
      .insert(blogPosts)
      .values(post)
      .returning();
    return newPost;
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    const [post] = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.id, id));
    return post;
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.slug, slug));
    return post;
  }

  async getAllBlogPosts(includeUnpublished: boolean = false): Promise<BlogPost[]> {
    if (!includeUnpublished) {
      return await db
        .select()
        .from(blogPosts)
        .where(eq(blogPosts.published, true))
        .orderBy(desc(blogPosts.publishedAt));
    } else {
      return await db
        .select()
        .from(blogPosts)
        .orderBy(desc(blogPosts.publishedAt));
    }
  }

  async updateBlogPost(id: number, postData: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const [updatedPost] = await db
      .update(blogPosts)
      .set({
        ...postData,
        updatedAt: new Date()
      })
      .where(eq(blogPosts.id, id))
      .returning();
    return updatedPost;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    await db
      .delete(blogPosts)
      .where(eq(blogPosts.id, id));
    return true;
  }

  // Achievement operations
  async createAchievement(achievement: InsertAchievement): Promise<Achievement> {
    const [newAchievement] = await db
      .insert(achievements)
      .values(achievement)
      .returning();
    return newAchievement;
  }

  async getAchievement(id: number): Promise<Achievement | undefined> {
    const [achievement] = await db
      .select()
      .from(achievements)
      .where(eq(achievements.id, id));
    return achievement;
  }

  async getAllAchievements(): Promise<Achievement[]> {
    return await db
      .select()
      .from(achievements)
      .orderBy(desc(achievements.date));
  }

  async getFeaturedAchievements(): Promise<Achievement[]> {
    return await db
      .select()
      .from(achievements)
      .where(eq(achievements.featured, true))
      .orderBy(desc(achievements.date));
  }

  async updateAchievement(id: number, achievementData: Partial<InsertAchievement>): Promise<Achievement | undefined> {
    const [updatedAchievement] = await db
      .update(achievements)
      .set(achievementData)
      .where(eq(achievements.id, id))
      .returning();
    return updatedAchievement;
  }

  async deleteAchievement(id: number): Promise<boolean> {
    await db
      .delete(achievements)
      .where(eq(achievements.id, id));
    return true;
  }

  // Site settings operations
  async getSetting(key: string): Promise<SiteSetting | undefined> {
    const [setting] = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, key));
    return setting;
  }

  async getAllSettings(): Promise<SiteSetting[]> {
    return await db
      .select()
      .from(siteSettings)
      .orderBy(asc(siteSettings.key));
  }

  async updateSetting(key: string, value: string | null, valueJson?: any): Promise<SiteSetting | undefined> {
    // Check if setting exists
    const existingSetting = await this.getSetting(key);
    
    if (existingSetting) {
      // Update existing setting
      const [updatedSetting] = await db
        .update(siteSettings)
        .set({ 
          value, 
          valueJson: valueJson ? JSON.stringify(valueJson) : null,
          updatedAt: new Date() 
        })
        .where(eq(siteSettings.key, key))
        .returning();
      return updatedSetting;
    } else {
      // Create new setting
      const [newSetting] = await db
        .insert(siteSettings)
        .values({
          key,
          value,
          valueJson: valueJson ? JSON.stringify(valueJson) : null,
          type: valueJson ? 'json' : 'text'
        })
        .returning();
      return newSetting;
    }
  }

  // Contact info operations
  async getContactInfo(): Promise<ContactInfo[]> {
    return await db
      .select()
      .from(contactInfo)
      .orderBy(asc(contactInfo.type));
  }

  async createContactInfo(info: InsertContactInfo): Promise<ContactInfo> {
    const [newInfo] = await db
      .insert(contactInfo)
      .values(info)
      .returning();
    return newInfo;
  }

  async updateContactInfo(id: number, data: Partial<InsertContactInfo>): Promise<ContactInfo | undefined> {
    const [updatedInfo] = await db
      .update(contactInfo)
      .set(data)
      .where(eq(contactInfo.id, id))
      .returning();
    return updatedInfo;
  }

  async deleteContactInfo(id: number): Promise<boolean> {
    await db
      .delete(contactInfo)
      .where(eq(contactInfo.id, id));
    return true;
  }

  // Social links operations
  async getSocialLinks(): Promise<SocialLink[]> {
    return await db
      .select()
      .from(socialLinks)
      .orderBy(asc(socialLinks.displayOrder));
  }

  async createSocialLink(link: InsertSocialLink): Promise<SocialLink> {
    // Set display order to max + 1
    const existingLinks = await this.getSocialLinks();
    const maxOrder = existingLinks.length > 0 
      ? Math.max(...existingLinks.map(l => l.displayOrder || 0)) 
      : 0;
    
    const [newLink] = await db
      .insert(socialLinks)
      .values({
        ...link,
        displayOrder: maxOrder + 1
      })
      .returning();
    return newLink;
  }

  async updateSocialLink(id: number, data: Partial<InsertSocialLink>): Promise<SocialLink | undefined> {
    const [updatedLink] = await db
      .update(socialLinks)
      .set(data)
      .where(eq(socialLinks.id, id))
      .returning();
    return updatedLink;
  }

  async deleteSocialLink(id: number): Promise<boolean> {
    await db
      .delete(socialLinks)
      .where(eq(socialLinks.id, id));
    return true;
  }

  async updateSocialLinkOrder(id: number, direction: 'up' | 'down'): Promise<SocialLink | undefined> {
    // Get the current link
    const [currentLink] = await db
      .select()
      .from(socialLinks)
      .where(eq(socialLinks.id, id));
    
    if (!currentLink) return undefined;
    
    // Get the adjacent link
    const operator = direction === 'up' ? lt : gt;
    const orderBy = direction === 'up' ? desc : asc;
    
    const [adjacentLink] = await db
      .select()
      .from(socialLinks)
      .where(operator(socialLinks.displayOrder, currentLink.displayOrder))
      .orderBy(orderBy(socialLinks.displayOrder))
      .limit(1);
    
    if (!adjacentLink) return currentLink; // No adjacent link found
    
    // Swap the order
    await db
      .update(socialLinks)
      .set({ displayOrder: currentLink.displayOrder })
      .where(eq(socialLinks.id, adjacentLink.id));
    
    const [updatedLink] = await db
      .update(socialLinks)
      .set({ displayOrder: adjacentLink.displayOrder })
      .where(eq(socialLinks.id, id))
      .returning();
    
    return updatedLink;
  }

  // Testimonials operations
  async getTestimonials(): Promise<Testimonial[]> {
    return await db
      .select()
      .from(testimonials)
      .orderBy(desc(testimonials.createdAt));
  }

  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const [newTestimonial] = await db
      .insert(testimonials)
      .values(testimonial)
      .returning();
    return newTestimonial;
  }

  async updateTestimonial(id: number, data: Partial<InsertTestimonial>): Promise<Testimonial | undefined> {
    const [updatedTestimonial] = await db
      .update(testimonials)
      .set(data)
      .where(eq(testimonials.id, id))
      .returning();
    return updatedTestimonial;
  }

  async deleteTestimonial(id: number): Promise<boolean> {
    await db
      .delete(testimonials)
      .where(eq(testimonials.id, id));
    return true;
  }

  // Hero settings operations
  async getHeroSettings(): Promise<HeroSetting | undefined> {
    const [settings] = await db
      .select()
      .from(heroSettings)
      .limit(1);
    return settings;
  }

  async updateHeroSettings(data: Partial<InsertHeroSetting>): Promise<HeroSetting> {
    const existingSettings = await this.getHeroSettings();
    
    if (existingSettings) {
      const [updatedSettings] = await db
        .update(heroSettings)
        .set({
          ...data,
          updatedAt: new Date()
        })
        .where(eq(heroSettings.id, existingSettings.id))
        .returning();
      return updatedSettings;
    } else {
      const [newSettings] = await db
        .insert(heroSettings)
        .values({
          ...data as InsertHeroSetting,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning();
      return newSettings;
    }
  }

  // Current focus operations
  async getCurrentFocus(): Promise<CurrentFocus[]> {
    return await db
      .select()
      .from(currentFocus)
      .orderBy(asc(currentFocus.displayOrder));
  }

  async createCurrentFocus(focus: InsertCurrentFocus): Promise<CurrentFocus> {
    // Set display order to max + 1
    const existingFocus = await this.getCurrentFocus();
    const maxOrder = existingFocus.length > 0
      ? Math.max(...existingFocus.map(f => f.displayOrder || 0))
      : 0;
    
    const [newFocus] = await db
      .insert(currentFocus)
      .values({
        ...focus,
        displayOrder: maxOrder + 1
      })
      .returning();
    return newFocus;
  }

  async updateCurrentFocus(id: number, data: Partial<InsertCurrentFocus>): Promise<CurrentFocus | undefined> {
    const [updatedFocus] = await db
      .update(currentFocus)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(eq(currentFocus.id, id))
      .returning();
    return updatedFocus;
  }

  async deleteCurrentFocus(id: number): Promise<boolean> {
    await db
      .delete(currentFocus)
      .where(eq(currentFocus.id, id));
    return true;
  }

  async updateCurrentFocusOrder(id: number, direction: 'up' | 'down'): Promise<CurrentFocus | undefined> {
    // Similar to social links order update
    const [current] = await db
      .select()
      .from(currentFocus)
      .where(eq(currentFocus.id, id));
    
    if (!current) return undefined;
    
    const operator = direction === 'up' ? lt : gt;
    const orderBy = direction === 'up' ? desc : asc;
    
    const [adjacent] = await db
      .select()
      .from(currentFocus)
      .where(operator(currentFocus.displayOrder, current.displayOrder))
      .orderBy(orderBy(currentFocus.displayOrder))
      .limit(1);
    
    if (!adjacent) return current;
    
    await db
      .update(currentFocus)
      .set({ displayOrder: current.displayOrder })
      .where(eq(currentFocus.id, adjacent.id));
    
    const [updated] = await db
      .update(currentFocus)
      .set({ displayOrder: adjacent.displayOrder })
      .where(eq(currentFocus.id, id))
      .returning();
    
    return updated;
  }

  // Resume operations - using site settings for storage
  async getResumeSetting(): Promise<{ url: string; is_public: boolean; type: string } | undefined> {
    const setting = await this.getSetting('resume');
    if (!setting || !setting.valueJson) return undefined;
    
    try {
      return JSON.parse(setting.valueJson);
    } catch (e) {
      return undefined;
    }
  }

  async updateResumeSetting(data: { url: string; is_public: boolean; type: string }): Promise<{ url: string; is_public: boolean; type: string }> {
    await this.updateSetting('resume', null, data);
    return data;
  }

  async deleteResumeSetting(): Promise<boolean> {
    const setting = await this.getSetting('resume');
    if (setting) {
      await db
        .delete(siteSettings)
        .where(eq(siteSettings.key, 'resume'));
    }
    return true;
  }

  // Biography operations
  async getBiographyEntries(): Promise<BiographyEntry[]> {
    return await db
      .select()
      .from(biographyEntries)
      .orderBy(desc(biographyEntries.date));
  }

  async createBiographyEntry(entry: InsertBiographyEntry): Promise<BiographyEntry> {
    const [newEntry] = await db
      .insert(biographyEntries)
      .values(entry)
      .returning();
    return newEntry;
  }

  async updateBiographyEntry(id: number, data: Partial<InsertBiographyEntry>): Promise<BiographyEntry | undefined> {
    const [updatedEntry] = await db
      .update(biographyEntries)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(eq(biographyEntries.id, id))
      .returning();
    return updatedEntry;
  }

  async deleteBiographyEntry(id: number): Promise<boolean> {
    await db
      .delete(biographyEntries)
      .where(eq(biographyEntries.id, id));
    return true;
  }

  // Skills operations
  async getSkills(): Promise<Skill[]> {
    return await db
      .select()
      .from(skills)
      .orderBy(asc(skills.category), asc(skills.name));
  }

  async createSkill(skill: InsertSkill): Promise<Skill> {
    const [newSkill] = await db
      .insert(skills)
      .values(skill)
      .returning();
    return newSkill;
  }

  async updateSkill(id: number, data: Partial<InsertSkill>): Promise<Skill | undefined> {
    const [updatedSkill] = await db
      .update(skills)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(eq(skills.id, id))
      .returning();
    return updatedSkill;
  }

  async deleteSkill(id: number): Promise<boolean> {
    await db
      .delete(skills)
      .where(eq(skills.id, id));
    return true;
  }
}

export const storage = new DatabaseStorage();
