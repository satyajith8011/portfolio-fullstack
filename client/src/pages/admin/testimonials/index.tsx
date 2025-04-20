import { useState } from "react";
import { AdminSectionLayout } from "@/components/admin/AdminSectionLayout";
import { LoadingState } from "@/components/admin/LoadingState";
import { EmptyState } from "@/components/admin/EmptyState";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { FormWrapper } from "@/components/admin/FormWrapper";
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
import {
  Plus,
  Edit,
  Trash2,
  User,
  Building,
  Quote,
  Star,
  Calendar,
  Upload,
  FileImage,
  Briefcase,
  StarHalf,
  Check,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AdminTestimonialsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    company: "",
    photo_url: "",
    content: "",
    featured: false,
  });
  
  // Selected file for upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Fetch testimonials
  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ["/api/admin/testimonials"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/admin/testimonials");
        if (!res.ok) {
          if (res.status === 404) {
            return []; // Return empty array if endpoint not implemented
          }
          throw new Error("Failed to fetch testimonials");
        }
        return res.json();
      } catch (error) {
        console.error("Error fetching testimonials:", error);
        return []; // Return empty array on error
      }
    }
  });
  
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
      setFormData((prev) => ({ ...prev, photo_url: data.url }));
      toast({
        title: "Image uploaded",
        description: "Image has been uploaded successfully.",
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
  
  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await apiRequest("POST", "/api/admin/testimonials", data);
      if (!res.ok) throw new Error("Failed to create testimonial");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Testimonial created",
        description: "The testimonial has been added successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/testimonials"] });
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating testimonial",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: typeof formData }) => {
      const res = await apiRequest("PUT", `/api/admin/testimonials/${id}`, data);
      if (!res.ok) throw new Error("Failed to update testimonial");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Testimonial updated",
        description: "The testimonial has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/testimonials"] });
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating testimonial",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/admin/testimonials/${id}`);
      if (!res.ok) throw new Error("Failed to delete testimonial");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Testimonial deleted",
        description: "The testimonial has been removed successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/testimonials"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting testimonial",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Toggle featured mutation
  const toggleFeaturedMutation = useMutation({
    mutationFn: async ({ id, featured }: { id: number; featured: boolean }) => {
      const res = await apiRequest("PATCH", `/api/admin/testimonials/${id}/featured`, { featured });
      if (!res.ok) throw new Error("Failed to update testimonial");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/testimonials"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating testimonial",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Reset form and state
  const resetForm = () => {
    setFormData({
      name: "",
      role: "",
      company: "",
      photo_url: "",
      content: "",
      featured: false,
    });
    setSelectedFile(null);
    setFilePreview(null);
    setIsAddingNew(false);
    setEditingId(null);
  };
  
  // Handle editing a testimonial
  const handleEditEntry = (entry: any) => {
    setFormData({
      name: entry.name || "",
      role: entry.role || "",
      company: entry.company || "",
      photo_url: entry.photo_url || "",
      content: entry.content || "",
      featured: entry.featured || false,
    });
    if (entry.photo_url) {
      setFilePreview(entry.photo_url);
    }
    setEditingId(entry.id);
    setIsAddingNew(true);
  };
  
  // Handle text input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  // Handle featured switch change
  const handleFeaturedChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, featured: checked }));
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
  
  const handleSubmit = () => {
    // Validate form
    if (!formData.name || !formData.content) {
      toast({
        title: "Validation error",
        description: "Name and testimonial content are required fields.",
        variant: "destructive",
      });
      return;
    }
    
    if (editingId !== null) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };
  
  // Sort testimonials by featured status and creation date
  const sortedTestimonials = [...testimonials].sort((a: any, b: any) => {
    // Sort by featured status first (featured items first)
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    
    // Then sort by creation date (newest first)
    const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
    const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
    return dateB.getTime() - dateA.getTime();
  });
  
  if (isLoading) {
    return (
      <AdminSectionLayout 
        title="Testimonials" 
        description="Manage testimonials from clients and colleagues"
      >
        <LoadingState />
      </AdminSectionLayout>
    );
  }
  
  return (
    <AdminSectionLayout
      title="Testimonials"
      description="Manage testimonials from clients and colleagues"
      headerContent={
        !isAddingNew ? (
          <Button onClick={() => setIsAddingNew(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Add Testimonial
          </Button>
        ) : null
      }
    >
      {isAddingNew ? (
        <FormWrapper
          title={editingId ? "Edit Testimonial" : "Add Testimonial"}
          description={editingId ? "Update testimonial details" : "Add a new testimonial"}
          onSubmit={handleSubmit}
          cancelHref="/admin/testimonials"
          isPending={createMutation.isPending || updateMutation.isPending}
          submitLabel={editingId ? "Save Changes" : "Add Testimonial"}
        >
          <div className="grid gap-5 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="grid gap-3">
                <Label htmlFor="name">Full Name <span className="text-destructive">*</span></Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="grid gap-3">
                <Label htmlFor="role">Job Title</Label>
                <Input
                  id="role"
                  name="role"
                  placeholder="Software Engineer"
                  value={formData.role}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid gap-3">
              <Label htmlFor="company">Company/Organization</Label>
              <Input
                id="company"
                name="company"
                placeholder="Acme Inc."
                value={formData.company}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid gap-3">
              <Label>
                Photo
                <span className="text-xs text-muted-foreground ml-2">(Optional)</span>
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
                    Upload a profile photo of the person giving the testimonial.
                  </p>
                </div>
                {(filePreview || formData.photo_url) && (
                  <div className="flex-shrink-0">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={filePreview || formData.photo_url} alt="Preview" />
                      <AvatarFallback className="text-lg">
                        {formData.name ? formData.name.charAt(0).toUpperCase() : "?"}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                )}
              </div>
              {formData.photo_url && !filePreview && (
                <div className="text-sm">
                  Current image: <span className="font-medium break-all">{formData.photo_url}</span>
                </div>
              )}
            </div>
            
            <div className="grid gap-3">
              <Label htmlFor="content">
                Testimonial Content <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="content"
                name="content"
                placeholder="Enter the testimonial text here..."
                value={formData.content}
                onChange={handleInputChange}
                rows={5}
                required
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={handleFeaturedChange}
              />
              <Label htmlFor="featured">Feature on Homepage</Label>
              <p className="text-xs text-muted-foreground ml-2">
                {formData.featured ? 
                  "This testimonial will be displayed prominently on the homepage" : 
                  "This testimonial will only appear on the testimonials section"}
              </p>
            </div>
          </div>
        </FormWrapper>
      ) : sortedTestimonials.length === 0 ? (
        <EmptyState
          title="No testimonials yet"
          description="Add testimonials from clients and colleagues to showcase on your portfolio."
          icon={<Quote className="h-8 w-8 text-muted-foreground" />}
          action={{
            label: "Add Testimonial",
            onClick: () => setIsAddingNew(true),
          }}
        />
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedTestimonials.map((testimonial: any) => (
              <Card key={testimonial.id} className={`overflow-hidden ${testimonial.featured ? 'border-primary/50' : ''}`}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={testimonial.photo_url} alt={testimonial.name} />
                        <AvatarFallback className="text-lg">
                          {testimonial.name ? testimonial.name.charAt(0).toUpperCase() : "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                        <CardDescription>
                          {testimonial.role}{testimonial.company ? ` at ${testimonial.company}` : ''}
                        </CardDescription>
                      </div>
                    </div>
                    {testimonial.featured && (
                      <Badge variant="outline" className="ml-2 border-primary/50 bg-primary/5">
                        <Star className="h-3 w-3 mr-1 fill-primary text-primary" />
                        Featured
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="text-sm relative pl-6">
                    <Quote className="absolute left-0 top-0 h-4 w-4 text-muted-foreground" />
                    {testimonial.content.length > 150 
                      ? `${testimonial.content.substring(0, 150)}...` 
                      : testimonial.content}
                  </div>
                </CardContent>
                <CardFooter className="pt-3 border-t flex justify-between">
                  <Switch
                    checked={testimonial.featured}
                    onCheckedChange={(checked) => 
                      toggleFeaturedMutation.mutate({
                        id: testimonial.id,
                        featured: checked,
                      })
                    }
                    disabled={toggleFeaturedMutation.isPending}
                  />
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditEntry(testimonial)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <ConfirmDialog
                      title="Delete Testimonial"
                      description={`Are you sure you want to delete the testimonial from ${testimonial.name}? This action cannot be undone.`}
                      onConfirm={() => deleteMutation.mutate(testimonial.id)}
                      isPending={deleteMutation.isPending}
                      variant="destructive"
                    />
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </AdminSectionLayout>
  );
}