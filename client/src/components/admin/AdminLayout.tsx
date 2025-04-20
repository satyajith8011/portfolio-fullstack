import { ReactNode, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  FileText, 
  Folder, 
  Award, 
  Settings, 
  Mail, 
  LogOut, 
  Menu, 
  X, 
  User
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const { user, logoutMutation } = useAuth();
  const [location, navigate] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Projects", href: "/admin/projects", icon: Folder },
    { name: "Blog Posts", href: "/admin/blog", icon: FileText },
    { name: "Achievements", href: "/admin/achievements", icon: Award },
    { name: "Messages", href: "/admin/messages", icon: Mail },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle menu"
        >
          {sidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>
      
      {/* Sidebar for desktop */}
      <div 
        className={cn(
          "fixed inset-y-0 z-40 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800 shadow-lg transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0 lg:static lg:max-w-[280px]"
        )}
      >
        {/* Logo area */}
        <div className="flex items-center h-16 px-6 border-b dark:border-gray-700">
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">Portfolio Admin</h1>
        </div>
        
        {/* User info */}
        <div className="px-6 py-4 border-b dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
              <User className="h-5 w-5" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user?.username}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user?.role}
              </p>
            </div>
          </div>
        </div>
        
        {/* Navigation links */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <a
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-3 rounded-md text-sm font-medium transition",
                  isActive
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-800/20 dark:text-blue-300"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/30"
                )}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(item.href);
                  setSidebarOpen(false);
                }}
              >
                <item.icon className={cn("mr-3 h-5 w-5 flex-shrink-0", isActive ? "text-blue-500" : "text-gray-400")} />
                {item.name}
              </a>
            );
          })}
        </nav>
        
        {/* Logout button */}
        <div className="px-4 py-3 border-t dark:border-gray-700">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-gray-600 dark:text-gray-300"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="bg-white dark:bg-gray-800 shadow h-16 flex items-center px-6 lg:px-8 sticky top-0 z-10">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white ml-auto lg:ml-0">{title}</h1>
          
          {/* Responsive info - only visible on mobile */}
          <div className="ml-auto lg:hidden flex items-center">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
              <User className="h-4 w-4" />
            </div>
          </div>
        </header>
        
        {/* Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto bg-gray-50 dark:bg-gray-900">
          {children}
        </main>
      </div>
      
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}