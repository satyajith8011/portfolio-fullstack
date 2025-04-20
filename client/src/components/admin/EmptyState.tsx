import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { PlusCircle } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: {
    href?: string;
    label: string;
    onClick?: () => void;
  };
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        {icon && <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">{icon}</div>}
        <h3 className="mt-4 text-lg font-semibold">{title}</h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground">{description}</p>
        {action && (
          action.href && action.href.length > 0 ? (
            <Link href={action.href}>
              <Button size="sm" className="relative">
                <PlusCircle className="mr-2 h-4 w-4" />
                {action.label}
              </Button>
            </Link>
          ) : action.onClick ? (
            <Button size="sm" className="relative" onClick={action.onClick}>
              <PlusCircle className="mr-2 h-4 w-4" />
              {action.label}
            </Button>
          ) : null
        )}
      </div>
    </div>
  );
}