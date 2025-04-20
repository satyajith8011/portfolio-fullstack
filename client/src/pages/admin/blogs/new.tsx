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
import { 
  FileText, 
  Image as ImageIcon, 
  Tag, 
  Calendar, 
  Link as LinkIcon,
  Type
} from "lucide-react";
import { useLocation } from "wouter";
import { format } from "date-fns";

export default function NewBlogPostPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    summary: "",
    content: "",
    image: "",
    tags: "",
    published: false,
    publishedAt: format(new Date(), "yyyy-MM-dd"),
  });
  
  // Create blog post mutation
  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await apiRequest("POST", "/api/admin/blog", data);
      if (!res.ok) throw new Error("Failed to create blog post");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Blog post created",
        description: "Your new blog post has been added successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog"] });
      navigate("/admin/blogs");
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating blog post",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-");
  };
  
  // Handle form changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Auto-generate slug when title changes
    if (name === "title") {
      setFormData((prev) => ({ 
        ...prev, 
        slug: generateSlug(value) 
      }));
    }
  };
  
  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, published: checked }));
  };
  
  const handleSubmit = () => {
    createMutation.mutate(formData);
  };
  
  // Preview of the blog image
  const ImagePreview = () => {
    if (!formData.image) return null;
    
    return (
      <div className="rounded-md overflow-hidden border mt-2">
        <img
          src={formData.image}
          alt="Blog post preview"
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
      title="Create Blog Post"
      description="Add a new blog post to your portfolio"
      backButton={{ href: "/admin/blogs" }}
    >
      <FormWrapper
        title="Blog Post Information"
        description="Enter the details of your blog post"
        onSubmit={handleSubmit}
        cancelHref="/admin/blogs"
        isPending={createMutation.isPending}
        submitLabel="Create Post"
      >
        <div className="grid gap-5 py-4">
          <div className="grid gap-3">
            <Label htmlFor="title" className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              <span>Title</span>
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g. How to Build a React Application"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="grid gap-3">
            <Label htmlFor="slug" className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              <span>URL Slug</span>
            </Label>
            <Input
              id="slug"
              name="slug"
              placeholder="e.g. how-to-build-a-react-application"
              value={formData.slug}
              onChange={handleInputChange}
              required
            />
            <p className="text-xs text-muted-foreground">
              This will be used as the URL for your blog post (auto-generated from title)
            </p>
          </div>
          
          <div className="grid gap-3">
            <Label htmlFor="summary">Summary</Label>
            <Textarea
              id="summary"
              name="summary"
              placeholder="A brief summary of your blog post"
              value={formData.summary}
              onChange={handleInputChange}
              className="min-h-20"
            />
            <p className="text-xs text-muted-foreground">
              This appears as a preview on the blog listing page
            </p>
          </div>
          
          <div className="grid gap-3">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              name="content"
              placeholder="Full content of your blog post"
              value={formData.content}
              onChange={handleInputChange}
              className="min-h-64"
              required
            />
            <p className="text-xs text-muted-foreground">
              Rich text editor coming soon. For now, you can use markdown formatting.
            </p>
          </div>
          
          <div className="grid gap-3">
            <Label htmlFor="image" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              <span>Cover Image URL</span>
            </Label>
            <Input
              id="image"
              name="image"
              placeholder="https://example.com/blog-image.jpg"
              value={formData.image}
              onChange={handleInputChange}
            />
            <ImagePreview />
          </div>
          
          <div className="grid gap-3">
            <Label htmlFor="tags" className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              <span>Tags</span>
            </Label>
            <Input
              id="tags"
              name="tags"
              placeholder="React, Web Development, Tutorial"
              value={formData.tags}
              onChange={handleInputChange}
            />
            <p className="text-xs text-muted-foreground">
              Separate tags with commas
            </p>
          </div>
          
          <div className="grid gap-3">
            <Label htmlFor="publishedAt" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Publication Date</span>
            </Label>
            <Input
              id="publishedAt"
              name="publishedAt"
              type="date"
              value={formData.publishedAt}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Switch
              id="published"
              checked={formData.published}
              onCheckedChange={handleSwitchChange}
            />
            <Label htmlFor="published">Publish Immediately</Label>
            <p className="text-xs text-muted-foreground ml-2">
              If unchecked, the post will be saved as a draft
            </p>
          </div>
        </div>
      </FormWrapper>
    </AdminSectionLayout>
  );
}