import { useState } from "react";
import { AdminSectionLayout } from "@/components/admin/AdminSectionLayout";
import { LoadingState } from "@/components/admin/LoadingState";
import { EmptyState } from "@/components/admin/EmptyState";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Award,
  Calendar,
  Edit,
  Star,
  StarOff,
  Clock,
  Tag,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export default function AdminAchievementsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [view, setView] = useState<string>("all");
  
  // Fetch achievements
  const { data: achievements = [], isLoading } = useQuery({
    queryKey: ["/api/achievements"],
    queryFn: async () => {
      const res = await fetch("/api/achievements");
      if (!res.ok) throw new Error("Failed to fetch achievements");
      return res.json();
    }
  });
  
  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/achievements/${id}`);
      if (!res.ok) throw new Error("Failed to delete achievement");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Achievement deleted",
        description: "The achievement has been removed successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/achievements"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting achievement",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Toggle featured mutation
  const toggleFeaturedMutation = useMutation({
    mutationFn: async ({ id, featured }: { id: number; featured: boolean }) => {
      const res = await apiRequest("PATCH", `/api/achievements/${id}/featured`, { featured });
      if (!res.ok) throw new Error("Failed to update achievement");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/achievements"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating achievement",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const filteredAchievements = view === "all" 
    ? achievements 
    : view === "featured" 
      ? achievements.filter((achievement: any) => achievement.featured) 
      : achievements.filter((achievement: any) => !achievement.featured);
  
  if (isLoading) {
    return (
      <AdminSectionLayout 
        title="Achievements" 
        description="Manage your certifications, awards, and achievements"
        createButton={{ href: "/admin/achievements/new" }}
      >
        <LoadingState type="table" rows={3} />
      </AdminSectionLayout>
    );
  }
  
  return (
    <AdminSectionLayout
      title="Achievements"
      description="Manage your certifications, awards, and achievements"
      createButton={{ href: "/admin/achievements/new" }}
    >
      <Tabs defaultValue="all" value={view} onValueChange={setView} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Achievements</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="regular">Not Featured</TabsTrigger>
        </TabsList>
      </Tabs>

      {achievements.length === 0 ? (
        <EmptyState
          title="No achievements yet"
          description="Start adding your certifications, awards, and other achievements."
          icon={<Award className="h-8 w-8 text-muted-foreground" />}
          action={{
            href: "/admin/achievements/new",
            label: "Add Achievement",
          }}
        />
      ) : filteredAchievements.length === 0 ? (
        <div className="text-center py-8">
          <h3 className="text-lg font-medium">No achievements found</h3>
          <p className="text-muted-foreground mt-1">Try changing your filter or add new achievements.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAchievements.map((achievement: any) => (
            <Card key={achievement.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl mb-1 flex items-center gap-2">
                      {achievement.title}
                      {achievement.featured && (
                        <Star className="h-4 w-4 text-amber-500" />
                      )}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {achievement.year}
                      {achievement.type && (
                        <Badge variant="outline" className="ml-2">{achievement.type}</Badge>
                      )}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => 
                      toggleFeaturedMutation.mutate({
                        id: achievement.id,
                        featured: !achievement.featured,
                      })
                    }
                    disabled={toggleFeaturedMutation.isPending}
                  >
                    {achievement.featured ? (
                      <StarOff className="h-4 w-4 mr-1" />
                    ) : (
                      <Star className="h-4 w-4 mr-1" />
                    )}
                    {achievement.featured ? "Unfeature" : "Feature"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-sm text-muted-foreground">
                  {achievement.description}
                </p>
                
                {achievement.image && (
                  <div className="mt-3 aspect-video w-full max-h-32 overflow-hidden rounded-md border">
                    <img
                      src={achievement.image}
                      alt={achievement.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                
                <div className="flex flex-wrap gap-1 mt-3">
                  {achievement.tags?.split(',').map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag.trim()}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-3 flex justify-end items-center border-t gap-2">
                <Link href={`/admin/achievements/${achievement.id}`}>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </Link>
                <ConfirmDialog
                  title="Delete Achievement"
                  description={`Are you sure you want to delete "${achievement.title}"? This action cannot be undone.`}
                  onConfirm={() => deleteMutation.mutate(achievement.id)}
                  isPending={deleteMutation.isPending}
                />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </AdminSectionLayout>
  );
}