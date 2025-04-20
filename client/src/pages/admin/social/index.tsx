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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Plus, 
  Edit, 
  Trash2,
  Globe,
  Twitter,
  Github,
  Linkedin,
  Instagram,
  Facebook,
  Youtube,
  Twitch,
  Link as LinkIcon,
  ShieldCheck,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Box,
  AlignJustify
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Social media platforms
const platforms = [
  { value: "website", label: "Website", icon: <Globe className="h-5 w-5" /> },
  { value: "linkedin", label: "LinkedIn", icon: <Linkedin className="h-5 w-5" /> },
  { value: "github", label: "GitHub", icon: <Github className="h-5 w-5" /> },
  { value: "twitter", label: "Twitter / X", icon: <Twitter className="h-5 w-5" /> },
  { value: "instagram", label: "Instagram", icon: <Instagram className="h-5 w-5" /> },
  { value: "facebook", label: "Facebook", icon: <Facebook className="h-5 w-5" /> },
  { value: "youtube", label: "YouTube", icon: <Youtube className="h-5 w-5" /> },
  { value: "twitch", label: "Twitch", icon: <Twitch className="h-5 w-5" /> },
  { value: "other", label: "Other", icon: <LinkIcon className="h-5 w-5" /> },
];

export default function AdminSocialPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    platform: "website",
    url: "",
    icon: "",
    display_order: 0,
  });
  
  // Fetch social links
  const { data: socialLinks = [], isLoading } = useQuery({
    queryKey: ["/api/admin/social"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/admin/social");
        if (!res.ok) {
          if (res.status === 404) {
            return []; // Return empty array if endpoint not implemented
          }
          throw new Error("Failed to fetch social links");
        }
        return res.json();
      } catch (error) {
        console.error("Error fetching social links:", error);
        return []; // Return empty array on error
      }
    }
  });
  
  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await apiRequest("POST", "/api/admin/social", data);
      if (!res.ok) throw new Error("Failed to create social link");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Social link created",
        description: "Your social profile link has been added successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/social"] });
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating social link",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: typeof formData }) => {
      const res = await apiRequest("PUT", `/api/admin/social/${id}`, data);
      if (!res.ok) throw new Error("Failed to update social link");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Social link updated",
        description: "Your social profile link has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/social"] });
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating social link",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/admin/social/${id}`);
      if (!res.ok) throw new Error("Failed to delete social link");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Social link deleted",
        description: "The social profile link has been removed successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/social"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting social link",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Update display order mutation
  const updateOrderMutation = useMutation({
    mutationFn: async ({ id, direction }: { id: number; direction: 'up' | 'down' }) => {
      const res = await apiRequest("PATCH", `/api/admin/social/${id}/order`, { direction });
      if (!res.ok) throw new Error("Failed to update display order");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/social"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating order",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Reset form and state
  const resetForm = () => {
    setFormData({
      platform: "website",
      url: "",
      icon: "",
      display_order: 0,
    });
    setIsAddingNew(false);
    setEditingId(null);
  };
  
  // Handle editing a social link
  const handleEditEntry = (entry: any) => {
    setFormData({
      platform: entry.platform || "website",
      url: entry.url || "",
      icon: entry.icon || "",
      display_order: entry.display_order || 0,
    });
    setEditingId(entry.id);
    setIsAddingNew(true);
  };
  
  // Handle form changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handlePlatformChange = (value: string) => {
    setFormData((prev) => ({ ...prev, platform: value }));
  };
  
  const handleSubmit = () => {
    // Automatically set display_order to the end if it's 0
    const newFormData = {...formData};
    if (newFormData.display_order === 0) {
      const maxOrder = socialLinks.length > 0 
        ? Math.max(...(socialLinks as any[]).map((link: any) => link.display_order || 0)) 
        : 0;
      newFormData.display_order = maxOrder + 1;
    }
    
    if (editingId !== null) {
      updateMutation.mutate({ id: editingId, data: newFormData });
    } else {
      createMutation.mutate(newFormData);
    }
  };
  
  // Get icon for platform
  const getPlatformIcon = (platform: string) => {
    const socialPlatform = platforms.find(p => p.value === platform);
    return socialPlatform ? socialPlatform.icon : <LinkIcon className="h-5 w-5" />;
  };
  
  // Get label for platform
  const getPlatformLabel = (platform: string) => {
    const socialPlatform = platforms.find(p => p.value === platform);
    return socialPlatform ? socialPlatform.label : platform;
  };
  
  // Handle move up/down
  const handleMoveUp = (id: number) => {
    updateOrderMutation.mutate({ id, direction: 'up' });
  };
  
  const handleMoveDown = (id: number) => {
    updateOrderMutation.mutate({ id, direction: 'down' });
  };
  
  // Sort social links by display order
  const sortedSocialLinks = [...socialLinks].sort((a: any, b: any) => 
    (a.display_order || 0) - (b.display_order || 0)
  );
  
  if (isLoading) {
    return (
      <AdminSectionLayout 
        title="Social Media" 
        description="Manage your social media profiles and links"
      >
        <LoadingState />
      </AdminSectionLayout>
    );
  }
  
  return (
    <AdminSectionLayout
      title="Social Media"
      description="Manage your social media profiles and links"
      headerContent={
        !isAddingNew ? (
          <Button onClick={() => setIsAddingNew(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Add Social Link
          </Button>
        ) : null
      }
    >
      {isAddingNew ? (
        <FormWrapper
          title={editingId ? "Edit Social Link" : "Add Social Link"}
          description={editingId ? "Update social media profile" : "Add new social media profile"}
          onSubmit={handleSubmit}
          cancelHref="/admin/social"
          isPending={createMutation.isPending || updateMutation.isPending}
          submitLabel={editingId ? "Save Changes" : "Add Link"}
        >
          <div className="grid gap-5 py-4">
            <div className="grid gap-3">
              <Label htmlFor="platform">Platform</Label>
              <Select
                value={formData.platform}
                onValueChange={handlePlatformChange}
              >
                <SelectTrigger id="platform">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map((platform) => (
                    <SelectItem key={platform.value} value={platform.value}>
                      <div className="flex items-center">
                        <span className="mr-2">{platform.icon}</span>
                        {platform.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-3">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                name="url"
                placeholder={`Enter your ${getPlatformLabel(formData.platform)} profile URL`}
                value={formData.url}
                onChange={handleInputChange}
                required
              />
              <p className="text-xs text-muted-foreground">
                Enter the full URL including https://
              </p>
            </div>
            
            <div className="grid gap-3">
              <Label htmlFor="icon" className="flex items-center">
                Icon <span className="text-xs text-muted-foreground ml-2">(Optional)</span>
              </Label>
              <Input
                id="icon"
                name="icon"
                placeholder="Custom icon name or class (optional)"
                value={formData.icon}
                onChange={handleInputChange}
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to use default platform icon
              </p>
            </div>
            
            <div className="grid gap-3">
              <Label htmlFor="display_order">Display Order</Label>
              <Input
                id="display_order"
                name="display_order"
                type="number"
                min="0"
                placeholder="0 (auto-assign)"
                value={formData.display_order.toString()}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    display_order: parseInt(e.target.value) || 0,
                  }));
                }}
              />
              <p className="text-xs text-muted-foreground">
                Lower numbers display first. Leave at 0 to add to the end.
              </p>
            </div>
          </div>
        </FormWrapper>
      ) : sortedSocialLinks.length === 0 ? (
        <EmptyState
          title="No social media links yet"
          description="Add your social media profiles to connect with visitors."
          icon={<ShieldCheck className="h-8 w-8 text-muted-foreground" />}
          action={{
            label: "Add Social Link",
            onClick: () => setIsAddingNew(true),
          }}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col">
            {sortedSocialLinks.map((link: any, index: number) => (
              <Card key={link.id} className="overflow-hidden mb-3">
                <div className="flex items-center">
                  <div className="p-4 flex-shrink-0 flex items-center justify-center w-16 border-r">
                    {getPlatformIcon(link.platform)}
                  </div>
                  <CardHeader className="py-3 flex-grow">
                    <CardTitle className="text-lg">
                      {getPlatformLabel(link.platform)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="py-3 pr-4 flex items-center flex-grow-0">
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline flex items-center"
                    >
                      {link.url.length > 30 ? link.url.substring(0, 30) + "..." : link.url}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </CardContent>
                  <CardFooter className="py-3 pr-4 flex-shrink-0 flex items-center gap-1">
                    <div className="flex flex-col mr-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleMoveUp(link.id)}
                        disabled={index === 0 || updateOrderMutation.isPending}
                      >
                        <ArrowUp className="h-4 w-4" />
                        <span className="sr-only">Move Up</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleMoveDown(link.id)}
                        disabled={index === sortedSocialLinks.length - 1 || updateOrderMutation.isPending}
                      >
                        <ArrowDown className="h-4 w-4" />
                        <span className="sr-only">Move Down</span>
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditEntry(link)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <ConfirmDialog
                      title="Delete Social Link"
                      description={`Are you sure you want to delete your ${getPlatformLabel(link.platform)} link? This action cannot be undone.`}
                      onConfirm={() => deleteMutation.mutate(link.id)}
                      isPending={deleteMutation.isPending}
                      variant="destructive"
                    />
                  </CardFooter>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </AdminSectionLayout>
  );
}