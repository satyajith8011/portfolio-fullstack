import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingStateProps {
  type?: "table" | "card" | "simple";
  rows?: number;
}

export function LoadingState({ type = "simple", rows = 5 }: LoadingStateProps) {
  if (type === "simple") {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (type === "table") {
    return (
      <div className="w-full space-y-3">
        <div className="flex items-center gap-4 rounded-md border p-4">
          <Skeleton className="h-12 w-12 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
        {Array(rows - 1)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="flex items-center gap-4 rounded-md border p-4">
              <Skeleton className="h-12 w-12 rounded-md" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
      </div>
    );
  }

  if (type === "card") {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array(rows)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="flex flex-col gap-2 rounded-md border p-4 shadow-sm"
            >
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="mt-2 h-20 w-full rounded-md" />
              <div className="flex gap-2 mt-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
              </div>
            </div>
          ))}
      </div>
    );
  }

  return null;
}