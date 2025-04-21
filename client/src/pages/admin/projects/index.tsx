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
  Folder,
  ExternalLink,
  Github,
  Edit,
  Star,
  StarOff,
  Pencil,
  Trash2,
  Link as LinkIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export default function AdminProjectsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [view, setView] = useState<string>("all");
  
  // Fetch projects
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["/api/projects"],
    queryFn: async () => {
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("Failed to fetch projects");
      return res.json();
    }
  });
  
  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/projects/${id}`);
      if (!res.ok) throw new Error("Failed to delete project");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Project deleted",
        description: "The project has been removed successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting project",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Toggle featured mutation
  const toggleFeaturedMutation = useMutation({
    mutationFn: async ({ id, featured }: { id: number; featured: boolean }) => {
      const res = await apiRequest("PATCH", `/api/projects/${id}/featured`, { featured });
      if (!res.ok) throw new Error("Failed to update project");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating project",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const filteredProjects = view === "all" 
    ? projects 
    : view === "featured" 
      ? projects.filter((project: any) => project.featured) 
      : projects.filter((project: any) => !project.featured);
  
  if (isLoading) {
    return (
      <AdminSectionLayout 
        title="Projects" 
        description="Manage your portfolio projects"
        createButton={{ href: "/admin/projects/new" }}
      >
        <LoadingState type="card" rows={3} />
      </AdminSectionLayout>
    );
  }
  
  return (
    <AdminSectionLayout
      title="Projects"
      description="Manage your portfolio projects"
      createButton={{ href: "/admin/projects/new" }}
    >
      <Tabs defaultValue="all" value={view} onValueChange={setView} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Projects</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="regular">Not Featured</TabsTrigger>
        </TabsList>
      </Tabs>

      {projects.length === 0 ? (
        <EmptyState
          title="No projects yet"
          description="Start adding your portfolio projects to showcase your work."
          icon={<Folder className="h-8 w-8 text-muted-foreground" />}
          action={{
            href: "/admin/projects/new",
            label: "Create Project",
          }}
        />
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-8">
          <h3 className="text-lg font-medium">No projects found</h3>
          <p className="text-muted-foreground mt-1">Try changing your filter or add new projects.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project: any) => (
            <Card key={project.id} className="overflow-hidden">
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => 
                      toggleFeaturedMutation.mutate({
                        id: project.id,
                        featured: !project.featured,
                      })
                    }
                    disabled={toggleFeaturedMutation.isPending}
                  >
                    {project.featured ? (
                      <Star className="h-5 w-5 text-amber-500" />
                    ) : (
                      <StarOff className="h-5 w-5 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                <CardDescription className="line-clamp-2">{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                {project.image && (
                  <div className="mb-3 aspect-video overflow-hidden rounded-md border">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-wrap gap-1">
                  {Array.isArray(project.techStack) 
                    ? project.techStack.map((tech: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))
                    : project.techStack?.split(',').map((tech: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tech.trim()}
                        </Badge>
                      ))
                  }
                  {project.featured && (
                    <Badge className="bg-amber-500 text-white text-xs">Featured</Badge>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center p-4 border-t gap-2">
                <div className="flex gap-2">
                  {project.github && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={project.github} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4 mr-1" />
                        Code
                      </a>
                    </Button>
                  )}
                  {project.liveUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Live
                      </a>
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/projects/${project.id}`}>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </Link>
                  <ConfirmDialog
                    title="Delete Project"
                    description={`Are you sure you want to delete "${project.title}"? This action cannot be undone.`}
                    onConfirm={() => deleteMutation.mutate(project.id)}
                    isPending={deleteMutation.isPending}
                  />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </AdminSectionLayout>
  );
}