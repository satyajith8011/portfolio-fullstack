import { ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import { User } from "lucide-react";
import AdminSidebar from "./AdminSidebar";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <AdminSidebar />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="bg-white dark:bg-gray-800 shadow h-16 flex items-center px-6 lg:px-8 sticky top-0 z-10">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h1>
          
          {/* User info */}
          <div className="ml-auto flex items-center">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white">
                <User className="h-5 w-5" />
              </div>
              <div className="ml-3 hidden md:block">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.username}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.role}
                </p>
              </div>
            </div>
          </div>
        </header>
        
        {/* Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto bg-gray-50 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
}