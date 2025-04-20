import { useState, useEffect } from "react";
import { AdminSectionLayout } from "@/components/admin/AdminSectionLayout";
import { LoadingState } from "@/components/admin/LoadingState";
import { FormWrapper } from "@/components/admin/FormWrapper";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  User,
  Upload,
  FileImage,
  Pen,
  Image as ImageIcon,
  Palette,
  Type,
  Quote,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AdminHeroPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    profile_image: "",
    title: "",
    subtitle: "",
    tagline: "",
    background: "gradient", // gradient, image, color
  });
  
  // Selected file for upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Fetch hero settings
  const { data: heroSettings, isLoading } = useQuery({
    queryKey: ["/api/admin/hero"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/admin/hero");
        if (!res.ok) {
          if (res.status === 404) {
            return null; // Return null if endpoint not implemented
          }
          throw new Error("Failed to fetch hero settings");
        }
        return res.json();
      } catch (error) {
        console.error("Error fetching hero settings:", error);
        return null; // Return null on error
      }
    }
  });
  
  // Update effect when heroSettings changes
  useEffect(() => {
    if (heroSettings) {
      setFormData({
        profile_image: heroSettings.profile_image || "",
        title: heroSettings.title || "",
        subtitle: heroSettings.subtitle || "",
        tagline: heroSettings.tagline || "",
        background: heroSettings.background || "gradient",
      });
      if (heroSettings.profile_image) {
        setFilePreview(heroSettings.profile_image);
      }
    }
  }, [heroSettings]);
  
  // File upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("image", file);
      
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      
      if (!res.ok) throw new Error("Failed to upload image");
      return res.json();
    },
    onSuccess: (data) => {
      setFormData((prev) => ({ ...prev, profile_image: data.url }));
      toast({
        title: "Image uploaded",
        description: "Profile image has been uploaded successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error uploading image",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Update hero settings mutation
  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await apiRequest("PUT", "/api/admin/hero", data);
      if (!res.ok) throw new Error("Failed to update hero settings");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Hero settings updated",
        description: "Your hero section has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/hero"] });
      setIsSaving(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating hero settings",
        description: error.message,
        variant: "destructive",
      });
      setIsSaving(false);
    },
  });
  
  // Handle text input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  // Handle background type change
  const handleBackgroundChange = (value: string) => {
    setFormData((prev) => ({ ...prev, background: value }));
  };
  
  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle file upload
  const handleFileUpload = () => {
    if (selectedFile) {
      uploadMutation.mutate(selectedFile);
    }
  };
  
  const handleSave = () => {
    setIsSaving(true);
    updateMutation.mutate(formData);
  };
  
  // Preview component for hero section
  const HeroPreview = () => (
    <div className="w-full rounded-lg overflow-hidden border border-border">
      <div 
        className={`relative w-full h-64 flex flex-col items-center justify-center p-6 text-center
          ${formData.background === 'gradient' ? 'bg-gradient-to-r from-primary/20 to-primary/40' : 
            formData.background === 'color' ? 'bg-primary/20' : 'bg-gray-100 dark:bg-gray-800'}`}
      >
        <div className="mb-4">
          {filePreview || formData.profile_image ? (
            <Avatar className="h-24 w-24 border-4 border-background">
              <AvatarImage 
                src={filePreview || formData.profile_image} 
                alt="Profile" 
                className="object-cover"
              />
              <AvatarFallback className="text-2xl">
                {formData.title ? formData.title.charAt(0) : 'U'}
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
              <User className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
        </div>
        <h1 className="text-2xl font-bold mb-1">
          {formData.title || "Your Name"}
        </h1>
        <h2 className="text-lg text-muted-foreground mb-2">
          {formData.subtitle || "Your Profession"}
        </h2>
        <p className="text-sm max-w-lg">
          {formData.tagline || "Your captivating tagline goes here"}
        </p>
      </div>
    </div>
  );
  
  if (isLoading) {
    return (
      <AdminSectionLayout 
        title="Hero Section" 
        description="Configure the main hero section of your portfolio homepage"
      >
        <LoadingState />
      </AdminSectionLayout>
    );
  }
  
  return (
    <AdminSectionLayout
      title="Hero Section"
      description="Configure the main hero section of your portfolio homepage"
    >
      <Tabs defaultValue="content">
        <TabsList className="mb-6">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Profile Details</CardTitle>
              <CardDescription>
                Configure the main content that appears in your hero section
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid gap-3">
                  <Label htmlFor="title">Name / Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="e.g., John Doe"
                    value={formData.title}
                    onChange={handleInputChange}
                  />
                  <p className="text-xs text-muted-foreground">
                    Your name or main title displayed prominently in the hero section
                  </p>
                </div>
                
                <div className="grid gap-3">
                  <Label htmlFor="subtitle">Subtitle / Profession</Label>
                  <Input
                    id="subtitle"
                    name="subtitle"
                    placeholder="e.g., Full Stack Developer"
                    value={formData.subtitle}
                    onChange={handleInputChange}
                  />
                  <p className="text-xs text-muted-foreground">
                    Your profession or a brief descriptor that appears below your name
                  </p>
                </div>
                
                <div className="grid gap-3">
                  <Label htmlFor="tagline">Tagline / Bio</Label>
                  <Textarea
                    id="tagline"
                    name="tagline"
                    placeholder="e.g., Building elegant solutions to complex problems"
                    value={formData.tagline}
                    onChange={handleInputChange}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    A short, catchy phrase that describes your work or philosophy
                  </p>
                </div>
                
                <div className="grid gap-3">
                  <Label>
                    Profile Image
                  </Label>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-grow">
                      <div className="flex items-center gap-2">
                        <Input
                          id="photo"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="flex-grow"
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={handleFileUpload}
                          disabled={!selectedFile || uploadMutation.isPending}
                        >
                          {uploadMutation.isPending ? "Uploading..." : "Upload"}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Upload a professional photo for your hero section.
                      </p>
                    </div>
                    {(filePreview || formData.profile_image) && (
                      <div className="flex-shrink-0">
                        <Avatar className="h-20 w-20">
                          <AvatarImage src={filePreview || formData.profile_image} alt="Preview" />
                          <AvatarFallback className="text-lg">
                            {formData.title ? formData.title.charAt(0).toUpperCase() : "?"}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    )}
                  </div>
                  {formData.profile_image && !filePreview && (
                    <div className="text-sm">
                      Current image: <span className="font-medium break-all">{formData.profile_image}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Visual Settings</CardTitle>
              <CardDescription>
                Customize the visual appearance of your hero section
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-3">
                <Label htmlFor="background">Background Style</Label>
                <Select
                  value={formData.background}
                  onValueChange={handleBackgroundChange}
                >
                  <SelectTrigger id="background">
                    <SelectValue placeholder="Select background style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gradient">
                      <div className="flex items-center">
                        <Palette className="h-4 w-4 mr-2" />
                        Gradient
                      </div>
                    </SelectItem>
                    <SelectItem value="color">
                      <div className="flex items-center">
                        <Palette className="h-4 w-4 mr-2" />
                        Solid Color
                      </div>
                    </SelectItem>
                    <SelectItem value="image">
                      <div className="flex items-center">
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Background Image
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Choose how you want the background of your hero section to appear
                </p>
              </div>
              
              {formData.background === 'image' && (
                <div className="p-4 bg-muted rounded-md">
                  <p className="text-sm text-muted-foreground">
                    Background image upload functionality will be implemented in a future update.
                    For now, the hero section will use a default background.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Hero Section Preview</CardTitle>
              <CardDescription>
                This is how your hero section will appear on your portfolio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HeroPreview />
              <p className="text-sm text-muted-foreground mt-4">
                Note: The actual appearance may vary slightly based on your site's theme and layout.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 flex justify-end">
        <Button 
          size="lg" 
          onClick={handleSave}
          disabled={updateMutation.isPending || isSaving}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </AdminSectionLayout>
  );
}