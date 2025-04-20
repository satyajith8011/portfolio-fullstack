import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  LayoutDashboard, 
  FolderKanban,
  FileText, 
  Award, 
  User, 
  Clock, 
  Briefcase, 
  Mail, 
  Share2, 
  FileUp, 
  MessageSquareQuote,
  Image,
  Menu,
  LogOut,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";

type NavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
};

export default function AdminSidebar() {
  const [, setLocation] = useLocation();
  const { logoutMutation } = useAuth();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    { 
      title: "Dashboard", 
      href: "/admin", 
      icon: <LayoutDashboard className="h-5 w-5" /> 
    },
    { 
      title: "Projects", 
      href: "/admin/projects", 
      icon: <FolderKanban className="h-5 w-5" /> 
    },
    { 
      title: "Blog Posts", 
      href: "/admin/blogs", 
      icon: <FileText className="h-5 w-5" /> 
    },
    { 
      title: "Achievements", 
      href: "/admin/achievements", 
      icon: <Award className="h-5 w-5" /> 
    },
    { 
      title: "About Me", 
      href: "/admin/about", 
      icon: <User className="h-5 w-5" /> 
    },
    { 
      title: "Biography", 
      href: "/admin/biography", 
      icon: <Clock className="h-5 w-5" /> 
    },
    { 
      title: "Skills", 
      href: "/admin/skills", 
      icon: <Briefcase className="h-5 w-5" /> 
    },
    { 
      title: "Current Work", 
      href: "/admin/current-work", 
      icon: <Briefcase className="h-5 w-5" /> 
    },
    { 
      title: "Contact Details", 
      href: "/admin/contact", 
      icon: <Mail className="h-5 w-5" /> 
    },
    { 
      title: "Social Media", 
      href: "/admin/social", 
      icon: <Share2 className="h-5 w-5" /> 
    },
    { 
      title: "Resume", 
      href: "/admin/resume", 
      icon: <FileUp className="h-5 w-5" /> 
    },
    { 
      title: "Testimonials", 
      href: "/admin/testimonials", 
      icon: <MessageSquareQuote className="h-5 w-5" /> 
    },
    { 
      title: "Hero Section", 
      href: "/admin/hero", 
      icon: <Image className="h-5 w-5" /> 
    },
  ];

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    setLocation("/auth");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleMobileMenu}
          className="bg-white dark:bg-gray-800"
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Sidebar - Desktop */}
      <div className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 h-screen border-r border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Admin Panel
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-2 space-y-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all",
                    location === item.href
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  )}
                >
                  {item.icon}
                  <span className="ml-3">{item.title}</span>
                  {location === item.href && (
                    <motion.div
                      className="absolute left-0 w-1 h-8 bg-blue-500 rounded-r-md"
                      layoutId="sidebar-highlight"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </div>
              </Link>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
          >
            <LogOut className="h-5 w-5 mr-2" />
            {logoutMutation.isPending ? "Logging out..." : "Log out"}
          </Button>
        </div>
      </div>

      {/* Sidebar - Mobile */}
      {isMobileMenuOpen && (
        <motion.div
          className="md:hidden fixed inset-0 z-40 bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={toggleMobileMenu}
        >
          <motion.div
            className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 z-50 flex flex-col"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Admin Panel
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto py-4">
              <nav className="px-2 space-y-1">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <div
                      className={cn(
                        "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all",
                        location === item.href
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      )}
                      onClick={toggleMobileMenu}
                    >
                      {item.icon}
                      <span className="ml-3">{item.title}</span>
                    </div>
                  </Link>
                ))}
              </nav>
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
              >
                <LogOut className="h-5 w-5 mr-2" />
                {logoutMutation.isPending ? "Logging out..." : "Log out"}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}