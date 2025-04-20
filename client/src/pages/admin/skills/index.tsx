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
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Edit,
  Trash2,
  Code,
  Database,
  Wrench,
  Briefcase,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const skillCategories = [
  { id: "frontend", label: "Frontend", icon: <Code className="h-4 w-4" /> },
  { id: "backend", label: "Backend", icon: <Database className="h-4 w-4" /> },
  { id: "tools", label: "Tools", icon: <Wrench className="h-4 w-4" /> },
  { id: "blockchain", label: "Blockchain", icon: <Briefcase className="h-4 w-4" /> },
  { id: "soft", label: "Soft Skills", icon: <Heart className="h-4 w-4" /> },
];

export default function AdminSkillsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  // Fetch skills data
  const { data: skills, isLoading } = useQuery({
    queryKey: ["/api/admin/skills"],
    queryFn: async () => {
      const res = await fetch("/api/admin/skills");
      if (!res.ok) throw new Error("Failed to fetch skills");
      return res.json();
    }
  });
  
  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/admin/skills/${id}`);
      if (!res.ok) throw new Error("Failed to delete skill");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Skill deleted",
        description: "The skill has been removed successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/skills"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting skill",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Filter skills by category
  const filteredSkills = selectedCategory === "all"
    ? skills
    : skills?.filter((skill: any) => skill.category === selectedCategory);
  
  // Group skills by category
  const groupedSkills = filteredSkills?.reduce((acc: any, skill: any) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {});
  
  if (isLoading) {
    return (
      <AdminSectionLayout 
        title="Skills" 
        description="Manage your technical and soft skills"
        createButton={{ href: "/admin/skills/new" }}
      >
        <LoadingState type="card" />
      </AdminSectionLayout>
    );
  }
  
  return (
    <AdminSectionLayout
      title="Skills"
      description="Manage your technical and soft skills"
      createButton={{ href: "/admin/skills/new" }}
      headerContent={
        <div className="mt-2 flex items-center gap-2 self-start sm:mt-0 sm:self-center">
          <Select
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {skillCategories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  <div className="flex items-center gap-2">
                    {category.icon}
                    <span>{category.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      }
    >
      {!skills || skills.length === 0 ? (
        <EmptyState
          title="No skills added yet"
          description="Start adding your technical and soft skills to display on your portfolio."
          icon={<Code className="h-8 w-8 text-muted-foreground" />}
          action={{
            href: "/admin/skills/new",
            label: "Add Skill",
          }}
        />
      ) : !filteredSkills || filteredSkills.length === 0 ? (
        <div className="text-center py-8">
          <h3 className="text-lg font-medium">No skills in this category</h3>
          <p className="text-muted-foreground mt-1">Try selecting a different category or add new skills.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedSkills).map(([category, categorySkills]: [string, any]) => {
            const categoryInfo = skillCategories.find(c => c.id === category) || {
              label: category.charAt(0).toUpperCase() + category.slice(1),
              icon: <Code className="h-4 w-4" />
            };
            
            return (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {categoryInfo.icon}
                    <span>{categoryInfo.label} Skills</span>
                  </CardTitle>
                  <CardDescription>
                    {categoryInfo.label === "Frontend" && "Languages, frameworks and libraries for user interfaces"}
                    {categoryInfo.label === "Backend" && "Server-side technologies and services"}
                    {categoryInfo.label === "Tools" && "Development tools and utilities"}
                    {categoryInfo.label === "Blockchain" && "Blockchain and web3 technologies"}
                    {categoryInfo.label === "Soft Skills" && "Professional and interpersonal abilities"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {categorySkills.map((skill: any) => (
                      <Card key={skill.id} className="overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex flex-col">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h3 className="font-medium">{skill.name}</h3>
                                <div className="flex flex-wrap gap-1 mt-1 mb-2">
                                  <Badge variant="outline" className="text-xs">
                                    {skill.level || "Proficient"}
                                  </Badge>
                                  {skill.featured && (
                                    <Badge className="bg-blue-500 text-xs">Featured</Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-3 mt-1">
                                  {skill.description || "No description provided"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="bg-muted/50 p-2 flex gap-2 justify-end">
                          <Link href={`/admin/skills/${skill.id}`}>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </Link>
                          <ConfirmDialog
                            title="Delete Skill"
                            description={`Are you sure you want to delete ${skill.name}? This action cannot be undone.`}
                            onConfirm={() => deleteMutation.mutate(skill.id)}
                            isPending={deleteMutation.isPending}
                            triggerLabel="Delete"
                          />
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </AdminSectionLayout>
  );
}