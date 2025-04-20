import { useEffect, useState } from "react";
import { AdminSectionLayout } from "@/components/admin/AdminSectionLayout";
import { FormWrapper } from "@/components/admin/FormWrapper";
import { LoadingState } from "@/components/admin/LoadingState";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useLocation, useParams } from "wouter";

const skillLevels = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "expert", label: "Expert" },
];

const skillCategories = [
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "tools", label: "Tools" },
  { value: "database", label: "Database" },
  { value: "blockchain", label: "Blockchain" },
  { value: "soft", label: "Soft Skills" },
];

export default function EditSkillPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();
  const params = useParams();
  const skillId = params.id;
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "frontend",
    level: "intermediate",
    featured: false,
  });
  
  // Fetch skill data
  const { data: skill, isLoading } = useQuery({
    queryKey: ["/api/admin/skills", skillId],
    queryFn: async () => {
      const res = await fetch(`/api/admin/skills/${skillId}`);
      if (!res.ok) throw new Error("Failed to fetch skill");
      return res.json();
    }
  });
  
  // Update form data when skill data is loaded
  useEffect(() => {
    if (skill) {
      setFormData({
        name: skill.name || "",
        description: skill.description || "",
        category: skill.category || "frontend",
        level: skill.level || "intermediate",
        featured: skill.featured || false,
      });
    }
  }, [skill]);
  
  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await apiRequest("PUT", `/api/admin/skills/${skillId}`, data);
      if (!res.ok) throw new Error("Failed to update skill");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Skill updated",
        description: "Your skill has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/skills"] });
      navigate("/admin/skills");
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating skill",
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
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = () => {
    updateMutation.mutate(formData);
  };
  
  if (isLoading) {
    return (
      <AdminSectionLayout
        title="Edit Skill"
        description="Update skill information"
        backButton={{ href: "/admin/skills" }}
      >
        <LoadingState />
      </AdminSectionLayout>
    );
  }
  
  return (
    <AdminSectionLayout
      title={`Edit ${skill?.name || 'Skill'}`}
      description="Update skill information"
      backButton={{ href: "/admin/skills" }}
    >
      <FormWrapper
        title="Skill Information"
        description="Update the details of your skill"
        onSubmit={handleSubmit}
        cancelHref="/admin/skills"
        isPending={updateMutation.isPending}
        submitLabel="Save Changes"
      >
        <div className="grid gap-5 py-4">
          <div className="grid gap-3">
            <Label htmlFor="name">Skill Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g. React, Python, Team Leadership"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="grid gap-3">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="A brief description of your experience with this skill"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-3">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleSelectChange("category", value)}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {skillCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-3">
              <Label htmlFor="level">Proficiency Level</Label>
              <Select
                value={formData.level}
                onValueChange={(value) => handleSelectChange("level", value)}
              >
                <SelectTrigger id="level">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {skillLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Switch
              id="featured"
              checked={formData.featured}
              onCheckedChange={handleSwitchChange}
            />
            <Label htmlFor="featured">Featured Skill</Label>
            <p className="text-xs text-muted-foreground ml-2">
              Featured skills are highlighted in your portfolio
            </p>
          </div>
        </div>
      </FormWrapper>
    </AdminSectionLayout>
  );
}