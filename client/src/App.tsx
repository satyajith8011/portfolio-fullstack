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
      
      {/* Admin Routes - Protected */}
      <ProtectedRoute path="/admin" component={AdminDashboard} adminOnly />
      <ProtectedRoute path="/admin/projects" component={() => (
        <Suspense fallback={<Loading />}>
          <AdminDashboard />
        </Suspense>
      )} adminOnly />
      <ProtectedRoute path="/admin/blog" component={() => (
        <Suspense fallback={<Loading />}>
          <AdminDashboard />
        </Suspense>
      )} adminOnly />
      <ProtectedRoute path="/admin/achievements" component={() => (
        <Suspense fallback={<Loading />}>
          <AdminDashboard />
        </Suspense>
      )} adminOnly />
      <ProtectedRoute path="/admin/messages" component={() => (
        <Suspense fallback={<Loading />}>
          <AdminDashboard />
        </Suspense>
      )} adminOnly />
      <ProtectedRoute path="/admin/settings" component={() => (
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
