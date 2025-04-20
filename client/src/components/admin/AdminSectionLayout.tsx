import { ReactNode } from "react";
import { AdminLayout } from "./AdminLayout";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

interface AdminSectionLayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
  createButton?: {
    href: string;
    label?: string;
  };
  backButton?: {
    href: string;
    label?: string;
  };
  headerContent?: ReactNode; // Optional header content
}

export function AdminSectionLayout({ 
  title, 
  description, 
  children, 
  createButton,
  backButton,
  headerContent
}: AdminSectionLayoutProps) {
  return (
    <AdminLayout title={title}>
      <div className="space-y-6">
        {/* Header section */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {backButton && (
              <Link href={backButton.href} className="mb-2 inline-block">
                <Button variant="ghost" size="sm" className="mb-2 gap-1 pl-0 text-muted-foreground">
                  <ArrowLeft className="h-4 w-4" />
                  {backButton.label || "Back"}
                </Button>
              </Link>
            )}
            <h1 className="text-2xl font-semibold">{title}</h1>
            {description && <p className="text-muted-foreground">{description}</p>}
          </div>
          
          {createButton && (
            <Link href={createButton.href}>
              <Button className="gap-1">
                <Plus className="h-4 w-4" />
                {createButton.label || "Create New"}
              </Button>
            </Link>
          )}
          
          {headerContent}
        </div>
        
        {/* Main content */}
        <div className="relative">{children}</div>
      </div>
    </AdminLayout>
  );
}