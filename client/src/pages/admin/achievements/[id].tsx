import { useState, useEffect } from "react";
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
import { 
  Award, 
  Image as ImageIcon, 
  Tag,
  Calendar,
  FileText,
  Link as LinkIcon
} from "lucide-react";
import { useLocation, useParams } from "wouter";

const achievementTypes = [
  { value: "certification", label: "Certification" },
  { value: "award", label: "Award" },
  { value: "education", label: "Education" },
  { value: "project", label: "Project" },
  { value: "work", label: "Work Experience" },
  { value: "other", label: "Other" },
];

// Function to generate years from 2000 to current year
const generateYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear; year >= 2000; year--) {
    years.push({ value: year.toString(), label: year.toString() });
  }
  return years;
};

export default function EditAchievementPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();
  const params = useParams();
  const achievementId = params.id;
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    year: new Date().getFullYear().toString(),
    image: "",
    type: "certification",
    tags: "",
    url: "",
    featured: false,
    order: 0,
  });
  
  // Fetch achievement data
  const { data: achievement, isLoading } = useQuery({
    queryKey: ["/api/achievements", achievementId],
    queryFn: async () => {
      const res = await fetch(`/api/achievements/${achievementId}`);
      if (!res.ok) throw new Error("Failed to fetch achievement");
      return res.json();
    }
  });
  
  // Update form when achievement data is loaded
  useEffect(() => {
    if (achievement) {
      setFormData({
        title: achievement.title || "",
        description: achievement.description || "",
        year: achievement.year?.toString() || new Date().getFullYear().toString(),
        image: achievement.image || "",
        type: achievement.type || "certification",
        tags: achievement.tags || "",
        url: achievement.url || "",
        featured: achievement.featured || false,
        order: achievement.order || 0,
      });
    }
  }, [achievement]);
  
  // Update achievement mutation
  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await apiRequest("PUT", `/api/achievements/${achievementId}`, data);
      if (!res.ok) throw new Error("Failed to update achievement");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Achievement updated",
        description: "Your achievement has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/achievements"] });
      navigate("/admin/achievements");
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating achievement",
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
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, featured: checked }));
  };
  
  const handleSubmit = () => {
    updateMutation.mutate(formData);
  };
  
  // Preview of the achievement image
  const ImagePreview = () => {
    if (!formData.image) return null;
    
    return (
      <div className="rounded-md overflow-hidden border mt-2">
        <img
          src={formData.image}
          alt="Achievement preview"
          className="w-full h-auto object-cover max-h-48"
          onError={(e) => {
            e.currentTarget.src = "https://placehold.co/600x400?text=Image+Preview";
          }}
        />
      </div>
    );
  };
  
  if (isLoading) {
    return (
      <AdminSectionLayout
        title="Edit Achievement"
        description="Update achievement information"
        backButton={{ href: "/admin/achievements" }}
      >
        <LoadingState />
      </AdminSectionLayout>
    );
  }
  
  return (
    <AdminSectionLayout
      title={`Edit ${achievement?.title || 'Achievement'}`}
      description="Update achievement information"
      backButton={{ href: "/admin/achievements" }}
    >
      <FormWrapper
        title="Achievement Information"
        description="Update the details of your achievement"
        onSubmit={handleSubmit}
        cancelHref="/admin/achievements"
        isPending={updateMutation.isPending}
        submitLabel="Save Changes"
      >
        <div className="grid gap-5 py-4">
          <div className="grid gap-3">
            <Label htmlFor="title" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              <span>Title</span>
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g. AWS Certified Solutions Architect, Best Coding Award"
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
              placeholder="Provide details about this achievement or certification"
              value={formData.description}
              onChange={handleInputChange}
              className="min-h-24"
            />
          </div>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-3">
              <Label htmlFor="type" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Type</span>
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleSelectChange("type", value)}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {achievementTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-3">
              <Label htmlFor="year" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Year</span>
              </Label>
              <Select
                value={formData.year}
                onValueChange={(value) => handleSelectChange("year", value)}
              >
                <SelectTrigger id="year">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {generateYears().map((year) => (
                    <SelectItem key={year.value} value={year.value}>
                      {year.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid gap-3">
            <Label htmlFor="image" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              <span>Image URL</span>
            </Label>
            <Input
              id="image"
              name="image"
              placeholder="https://example.com/achievement-image.jpg"
              value={formData.image}
              onChange={handleInputChange}
            />
            <p className="text-xs text-muted-foreground">
              Enter a URL to an image of your certificate or award
            </p>
            <ImagePreview />
          </div>
          
          <div className="grid gap-3">
            <Label htmlFor="url" className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              <span>URL/Link</span>
            </Label>
            <Input
              id="url"
              name="url"
              placeholder="https://example.com/certification-verification"
              value={formData.url}
              onChange={handleInputChange}
            />
            <p className="text-xs text-muted-foreground">
              Optional link to the certification verification or related website
            </p>
          </div>
          
          <div className="grid gap-3">
            <Label htmlFor="tags" className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              <span>Tags</span>
            </Label>
            <Input
              id="tags"
              name="tags"
              placeholder="AWS, Cloud Computing, Leadership"
              value={formData.tags}
              onChange={handleInputChange}
            />
            <p className="text-xs text-muted-foreground">
              Separate tags with commas
            </p>
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
            <Label htmlFor="featured">Featured Achievement</Label>
            <p className="text-xs text-muted-foreground ml-2">
              Featured achievements appear prominently on your portfolio
            </p>
          </div>
        </div>
      </FormWrapper>
    </AdminSectionLayout>
  );
}