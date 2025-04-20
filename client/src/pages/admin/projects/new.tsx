import { useState } from "react";
import { AdminSectionLayout } from "@/components/admin/AdminSectionLayout";
import { FormWrapper } from "@/components/admin/FormWrapper";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Github, Image, ExternalLink, Hash } from "lucide-react";
import { useLocation } from "wouter";

export default function NewProjectPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    techStack: "",
    github: "",
    liveUrl: "",
    featured: false,
    order: 0,
  });
  
  // Create project mutation
  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await apiRequest("POST", "/api/projects", data);
      if (!res.ok) throw new Error("Failed to create project");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Project created",
        description: "Your new project has been added successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      navigate("/admin/projects");
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating project",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Handle form changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, featured: checked }));
  };
  
  const handleSubmit = () => {
    createMutation.mutate(formData);
  };
  
  // Preview of the project image
  const ImagePreview = () => {
    if (!formData.image) return null;
    
    return (
      <div className="rounded-md overflow-hidden border mt-2">
        <img
          src={formData.image}
          alt="Project preview"
          className="w-full h-auto object-cover max-h-48"
          onError={(e) => {
            e.currentTarget.src = "https://placehold.co/600x400?text=Image+Preview";
          }}
        />
      </div>
    );
  };
  
  return (
    <AdminSectionLayout
      title="Add Project"
      description="Create a new project for your portfolio"
      backButton={{ href: "/admin/projects" }}
    >
      <FormWrapper
        title="Project Information"
        description="Enter the details of your project"
        onSubmit={handleSubmit}
        cancelHref="/admin/projects"
        isPending={createMutation.isPending}
        submitLabel="Create Project"
      >
        <div className="grid gap-5 py-4">
          <div className="grid gap-3">
            <Label htmlFor="title">Project Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g. Portfolio Website, E-commerce App"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="grid gap-3">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Provide a detailed description of your project, including its features and purpose"
              className="min-h-32"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="grid gap-3">
            <Label htmlFor="image" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              <span>Image URL</span>
            </Label>
            <Input
              id="image"
              name="image"
              placeholder="https://example.com/project-image.jpg"
              value={formData.image}
              onChange={handleInputChange}
            />
            <p className="text-xs text-muted-foreground">
              Enter a URL to an image that represents your project (upload functionality coming soon)
            </p>
            <ImagePreview />
          </div>
          
          <div className="grid gap-3">
            <Label htmlFor="techStack" className="flex items-center gap-2">
              <Hash className="h-4 w-4" />
              <span>Tech Stack</span>
            </Label>
            <Input
              id="techStack"
              name="techStack"
              placeholder="React, Node.js, MongoDB, TailwindCSS"
              value={formData.techStack}
              onChange={handleInputChange}
            />
            <p className="text-xs text-muted-foreground">
              List the technologies used, separated by commas
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-3">
              <Label htmlFor="github" className="flex items-center gap-2">
                <Github className="h-4 w-4" />
                <span>GitHub Repository</span>
              </Label>
              <Input
                id="github"
                name="github"
                placeholder="https://github.com/username/repo"
                value={formData.github}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid gap-3">
              <Label htmlFor="liveUrl" className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                <span>Live Demo URL</span>
              </Label>
              <Input
                id="liveUrl"
                name="liveUrl"
                placeholder="https://your-project-demo.com"
                value={formData.liveUrl}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="grid gap-3">
            <Label htmlFor="order">Display Order</Label>
            <Input
              id="order"
              name="order"
              type="number"
              min="0"
              placeholder="0"
              value={formData.order.toString()}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  order: parseInt(e.target.value) || 0,
                }));
              }}
            />
            <p className="text-xs text-muted-foreground">
              Lower numbers display first. Leave at 0 for automatic ordering.
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Switch
              id="featured"
              checked={formData.featured}
              onCheckedChange={handleSwitchChange}
            />
            <Label htmlFor="featured">Featured Project</Label>
            <p className="text-xs text-muted-foreground ml-2">
              Featured projects appear prominently on your portfolio homepage
            </p>
          </div>
        </div>
      </FormWrapper>
    </AdminSectionLayout>
  );
}