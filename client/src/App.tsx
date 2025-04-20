import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import AllProjects from "@/pages/AllProjects";
import AllBlogPosts from "@/pages/AllBlogPosts";
import AllAchievements from "@/pages/AllAchievements";
import AuthPage from "@/pages/auth-page";
import AdminDashboard from "@/pages/admin";

// Import admin pages
import AdminAboutPage from "@/pages/admin/about";
import AdminSkillsPage from "@/pages/admin/skills";
import AdminSkillNewPage from "@/pages/admin/skills/new";
import AdminSkillEditPage from "@/pages/admin/skills/[id]";
import AdminProjectsPage from "@/pages/admin/projects";
import AdminProjectNewPage from "@/pages/admin/projects/new";
import AdminProjectEditPage from "@/pages/admin/projects/[id]";
import AdminBlogsPage from "@/pages/admin/blogs";
import AdminBlogNewPage from "@/pages/admin/blogs/new";
import AdminBlogEditPage from "@/pages/admin/blogs/[id]";
import AdminAchievementsPage from "@/pages/admin/achievements";
import AdminAchievementNewPage from "@/pages/admin/achievements/new";
import AdminAchievementEditPage from "@/pages/admin/achievements/[id]";
import AdminMessagesPage from "@/pages/admin/messages";
import AdminBiographyPage from "@/pages/admin/biography";
import AdminContactPage from "@/pages/admin/contact";
import AdminSocialPage from "@/pages/admin/social";
import AdminTestimonialsPage from "@/pages/admin/testimonials";

// Lazy load admin pages to reduce initial bundle size
import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";

const Loading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
  </div>
);

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={HomePage} />
      <Route path="/projects" component={AllProjects} />
      <Route path="/blog" component={AllBlogPosts} />
      <Route path="/achievements" component={AllAchievements} />
      <Route path="/auth" component={AuthPage} />
      
      {/* Admin Dashboard */}
      <ProtectedRoute path="/admin" component={AdminDashboard} adminOnly />
      
      {/* About Me Section */}
      <ProtectedRoute path="/admin/about" component={AdminAboutPage} adminOnly />
      
      {/* Skills Section */}
      <ProtectedRoute path="/admin/skills" component={AdminSkillsPage} adminOnly />
      <ProtectedRoute path="/admin/skills/new" component={AdminSkillNewPage} adminOnly />
      <ProtectedRoute path="/admin/skills/:id" component={AdminSkillEditPage} adminOnly />
      
      {/* Projects Section */}
      <ProtectedRoute path="/admin/projects" component={AdminProjectsPage} adminOnly />
      <ProtectedRoute path="/admin/projects/new" component={AdminProjectNewPage} adminOnly />
      <ProtectedRoute path="/admin/projects/:id" component={AdminProjectEditPage} adminOnly />
      
      {/* Blog Posts Section */}
      <ProtectedRoute path="/admin/blogs" component={AdminBlogsPage} adminOnly />
      <ProtectedRoute path="/admin/blogs/new" component={AdminBlogNewPage} adminOnly />
      <ProtectedRoute path="/admin/blogs/:id" component={AdminBlogEditPage} adminOnly />
      
      {/* Achievements Section */}
      <ProtectedRoute path="/admin/achievements" component={AdminAchievementsPage} adminOnly />
      <ProtectedRoute path="/admin/achievements/new" component={AdminAchievementNewPage} adminOnly />
      <ProtectedRoute path="/admin/achievements/:id" component={AdminAchievementEditPage} adminOnly />
      
      {/* Messages Section */}
      <ProtectedRoute path="/admin/messages" component={AdminMessagesPage} adminOnly />
      
      {/* Biography Section */}
      <ProtectedRoute path="/admin/biography" component={AdminBiographyPage} adminOnly />
      
      {/* Current Work Section */}
      <ProtectedRoute path="/admin/current-work" component={() => (
        <Suspense fallback={<Loading />}>
          <AdminDashboard />
        </Suspense>
      )} adminOnly />
      
      {/* Contact Section */}
      <ProtectedRoute path="/admin/contact" component={AdminContactPage} adminOnly />
      
      {/* Social Media Section */}
      <ProtectedRoute path="/admin/social" component={AdminSocialPage} adminOnly />
      <ProtectedRoute path="/admin/resume" component={() => (
        <Suspense fallback={<Loading />}>
          <AdminDashboard />
        </Suspense>
      )} adminOnly />
      
      {/* Testimonials Section */}
      <ProtectedRoute path="/admin/testimonials" component={AdminTestimonialsPage} adminOnly />
      <ProtectedRoute path="/admin/hero" component={() => (
        <Suspense fallback={<Loading />}>
          <AdminDashboard />
        </Suspense>
      )} adminOnly />
      
      {/* 404 Route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
