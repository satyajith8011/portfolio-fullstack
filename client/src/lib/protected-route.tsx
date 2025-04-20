import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route, RouteProps } from "wouter";

interface ProtectedRouteProps {
  path: string;
  component: React.ComponentType<any>;
  adminOnly?: boolean;
}

export function ProtectedRoute({
  path,
  component: Component,
  adminOnly = false,
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  // Show loading indicator while auth status is determined
  if (isLoading) {
    return (
      <Route path={path}>
        {(params) => (
          <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        )}
      </Route>
    );
  }

  // If user is not authenticated, redirect to login
  if (!user) {
    return (
      <Route path={path}>
        {() => <Redirect to="/auth" />}
      </Route>
    );
  }

  // If route requires admin privileges and user isn't admin
  if (adminOnly && user.role !== "admin") {
    return (
      <Route path={path}>
        {() => (
          <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
            <h1 className="text-3xl font-bold text-red-500 mb-3">Access Denied</h1>
            <p className="text-gray-600 max-w-md">
              You don't have permission to access this area. 
              This section requires administrator privileges.
            </p>
            <a href="/" className="mt-6 text-blue-600 hover:underline">
              Return to Home
            </a>
          </div>
        )}
      </Route>
    );
  }

  // Render the component if all checks pass
  return (
    <Route path={path}>
      {(params) => <Component {...params} />}
    </Route>
  );
}