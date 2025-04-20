import { useState } from "react";
import { AdminSectionLayout } from "@/components/admin/AdminSectionLayout";
import { LoadingState } from "@/components/admin/LoadingState";
import { FormWrapper } from "@/components/admin/FormWrapper";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Quote, FileText } from "lucide-react";

export default function AdminAboutPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Get the user profile data
  const { data: profile, isLoading } = useQuery({
    queryKey: ["/api/admin/profile"],
    queryFn: async () => {
      const res = await fetch("/api/admin/profile");
      if (!res.ok) throw new Error("Failed to fetch profile");
      return res.json();
    }
  });
  
  // State for form
  const [formData, setFormData] = useState({
    fullName: "",
    headline: "",
    bio: "",
    profilePhoto: "",
    quote: "",
  });
  
  // Update state when profile data loads
  useState(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || "",
        headline: profile.headline || "",
        bio: profile.bio || "",
        profilePhoto: profile.profilePhoto || "",
        quote: profile.quote || "",
      });
    }
  });
  
  // Mutation for updating profile
  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await apiRequest("PATCH", "/api/admin/profile", data);
      if (!res.ok) throw new Error("Failed to update profile");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/profile"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Handler for form submission
  const handleSubmit = () => {
    updateMutation.mutate(formData);
  };
  
  // Handler for input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  if (isLoading) {
    return (
      <AdminSectionLayout 
        title="About Me" 
        description="Manage your personal information and bio"
      >
        <LoadingState />
      </AdminSectionLayout>
    );
  }
  
  return (
    <AdminSectionLayout
      title="About Me"
      description="Manage your personal information and bio"
    >
      <div className="grid gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="mb-6 flex items-start gap-4">
              <Avatar className="h-20 w-20 rounded-md border">
                {profile?.profilePhoto ? (
                  <AvatarImage src={profile.profilePhoto} alt={profile.fullName || "Profile"} />
                ) : (
                  <AvatarFallback className="rounded-md bg-primary/10">
                    <User className="h-10 w-10 text-primary" />
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <h3 className="text-lg font-medium">{profile?.fullName || user?.username}</h3>
                <p className="text-sm text-muted-foreground">{profile?.headline || "Add a headline to appear on your portfolio"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <FormWrapper
          title="Edit Profile Information"
          description="Update your personal details and bio"
          onSubmit={handleSubmit}
          isPending={updateMutation.isPending}
          cancelHref="/admin"
          submitLabel="Save Changes"
        >
          <div className="grid gap-5 py-4">
            <div className="grid gap-3">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                placeholder="Your full name"
                value={formData.fullName}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid gap-3">
              <Label htmlFor="headline">
                <div className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  <span>Headline / Tagline</span>
                </div>
              </Label>
              <Input
                id="headline"
                name="headline"
                placeholder="e.g. Full Stack Developer | AI Enthusiast"
                value={formData.headline}
                onChange={handleInputChange}
              />
              <p className="text-xs text-muted-foreground">
                A short tagline that appears below your name in the hero section
              </p>
            </div>
            
            <div className="grid gap-3">
              <Label htmlFor="bio">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>Biography</span>
                </div>
              </Label>
              <Textarea
                id="bio"
                name="bio"
                placeholder="Share a bit about yourself, your background, and your interests"
                className="min-h-32"
                value={formData.bio}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid gap-3">
              <Label htmlFor="profilePhoto">Profile Photo URL</Label>
              <Input
                id="profilePhoto"
                name="profilePhoto"
                placeholder="https://example.com/your-photo.jpg"
                value={formData.profilePhoto}
                onChange={handleInputChange}
              />
              <p className="text-xs text-muted-foreground">
                Enter a URL to your profile photo (upload functionality coming soon)
              </p>
            </div>
            
            <div className="grid gap-3">
              <Label htmlFor="quote">
                <div className="flex items-center gap-1">
                  <Quote className="h-4 w-4" />
                  <span>Personal Quote</span>
                </div>
              </Label>
              <Textarea
                id="quote"
                name="quote"
                placeholder="A quote that inspires you or describes your philosophy"
                value={formData.quote}
                onChange={handleInputChange}
              />
              <p className="text-xs text-muted-foreground">
                This quote will appear in the about section of your portfolio
              </p>
            </div>
          </div>
        </FormWrapper>
      </div>
    </AdminSectionLayout>
  );
}