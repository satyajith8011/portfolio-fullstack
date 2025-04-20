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
import { Badge } from "@/components/ui/badge";
import {
  AtSign,
  Edit,
  Eye,
  EyeOff,
  Globe,
  Mail,
  MapPin,
  Phone,
  Plus,
  Trash2,
  Twitter,
  Github,
  Linkedin,
  Instagram,
  Facebook,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Contact info types
const contactTypes = [
  { value: "email", label: "Email", icon: <Mail className="h-4 w-4 mr-2" /> },
  { value: "phone", label: "Phone", icon: <Phone className="h-4 w-4 mr-2" /> },
  { value: "address", label: "Address", icon: <MapPin className="h-4 w-4 mr-2" /> },
  { value: "website", label: "Website", icon: <Globe className="h-4 w-4 mr-2" /> },
  { value: "twitter", label: "Twitter", icon: <Twitter className="h-4 w-4 mr-2" /> },
  { value: "github", label: "GitHub", icon: <Github className="h-4 w-4 mr-2" /> },
  { value: "linkedin", label: "LinkedIn", icon: <Linkedin className="h-4 w-4 mr-2" /> },
  { value: "instagram", label: "Instagram", icon: <Instagram className="h-4 w-4 mr-2" /> },
  { value: "facebook", label: "Facebook", icon: <Facebook className="h-4 w-4 mr-2" /> },
  { value: "other", label: "Other", icon: <AtSign className="h-4 w-4 mr-2" /> },
];

export default function AdminContactPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    type: "email",
    value: "",
    public: true,
  });
  
  // Fetch contact information
  const { data: contactInfo = [], isLoading } = useQuery({
    queryKey: ["/api/admin/contact"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/admin/contact");
        if (!res.ok) {
          if (res.status === 404) {
            return []; // Return empty array if endpoint not implemented
          }
          throw new Error("Failed to fetch contact information");
        }
        return res.json();
      } catch (error) {
        console.error("Error fetching contact info:", error);
        return []; // Return empty array on error
      }
    }
  });
  
  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await apiRequest("POST", "/api/admin/contact", data);
      if (!res.ok) throw new Error("Failed to create contact info");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Contact info created",
        description: "Your contact information has been added successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contact"] });
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating contact info",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: typeof formData }) => {
      const res = await apiRequest("PUT", `/api/admin/contact/${id}`, data);
      if (!res.ok) throw new Error("Failed to update contact info");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Contact info updated",
        description: "Your contact information has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contact"] });
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating contact info",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/admin/contact/${id}`);
      if (!res.ok) throw new Error("Failed to delete contact info");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Contact info deleted",
        description: "The contact information has been removed successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contact"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting contact info",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Toggle public mutation
  const togglePublicMutation = useMutation({
    mutationFn: async ({ id, isPublic }: { id: number; isPublic: boolean }) => {
      const res = await apiRequest("PATCH", `/api/admin/contact/${id}/public`, { public: isPublic });
      if (!res.ok) throw new Error("Failed to update contact info");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contact"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating visibility",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Reset form and state
  const resetForm = () => {
    setFormData({
      type: "email",
      value: "",
      public: true,
    });
    setIsAddingNew(false);
    setEditingId(null);
  };
  
  // Handle editing a contact info
  const handleEditEntry = (entry: any) => {
    setFormData({
      type: entry.type || "email",
      value: entry.value || "",
      public: entry.public !== undefined ? entry.public : true,
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
  
  const handleTypeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, type: value }));
  };
  
  const handlePublicChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, public: checked }));
  };
  
  const handleSubmit = () => {
    if (editingId !== null) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };
  
  // Get icon for contact type
  const getContactIcon = (type: string) => {
    const contactType = contactTypes.find(t => t.value === type);
    return contactType ? contactType.icon : <AtSign className="h-4 w-4 mr-2" />;
  };
  
  // Get label for contact type
  const getContactLabel = (type: string) => {
    const contactType = contactTypes.find(t => t.value === type);
    return contactType ? contactType.label : type;
  };
  
  if (isLoading) {
    return (
      <AdminSectionLayout 
        title="Contact Information" 
        description="Manage your contact details and social media profiles"
      >
        <LoadingState />
      </AdminSectionLayout>
    );
  }
  
  return (
    <AdminSectionLayout
      title="Contact Information"
      description="Manage your contact details and social media profiles"
      headerContent={
        !isAddingNew ? (
          <Button onClick={() => setIsAddingNew(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Add Contact Info
          </Button>
        ) : null
      }
    >
      {isAddingNew ? (
        <FormWrapper
          title={editingId ? "Edit Contact Info" : "Add Contact Info"}
          description={editingId ? "Update contact details" : "Add new contact information"}
          onSubmit={handleSubmit}
          cancelHref="/admin/contact"
          isPending={createMutation.isPending || updateMutation.isPending}
          submitLabel={editingId ? "Save Changes" : "Add Contact"}
        >
          <div className="grid gap-5 py-4">
            <div className="grid gap-3">
              <Label htmlFor="type">Contact Type</Label>
              <Select
                value={formData.type}
                onValueChange={handleTypeChange}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {contactTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center">
                        {type.icon}
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-3">
              <Label htmlFor="value">Value</Label>
              <Input
                id="value"
                name="value"
                placeholder={`Enter your ${getContactLabel(formData.type).toLowerCase()}`}
                value={formData.value}
                onChange={handleInputChange}
                required
              />
              <p className="text-xs text-muted-foreground">
                {formData.type === "email" && "Your email address for contact purposes"}
                {formData.type === "phone" && "Your phone number including country code"}
                {formData.type === "address" && "Your physical address or location"}
                {formData.type === "website" && "Full URL including https://"}
                {(formData.type === "twitter" || formData.type === "github" || 
                  formData.type === "linkedin" || formData.type === "instagram" || 
                  formData.type === "facebook") && 
                  "Full profile URL including https://"}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Switch
                id="public"
                checked={formData.public}
                onCheckedChange={handlePublicChange}
              />
              <Label htmlFor="public">Show Publicly</Label>
              <p className="text-xs text-muted-foreground ml-2">
                {formData.public ? 
                  "This contact information will be visible on your portfolio" : 
                  "This contact information will be hidden from public view"}
              </p>
            </div>
          </div>
        </FormWrapper>
      ) : contactInfo.length === 0 ? (
        <EmptyState
          title="No contact information yet"
          description="Add your contact details and social media profiles for visitors to reach you."
          icon={<User className="h-8 w-8 text-muted-foreground" />}
          action={{
            label: "Add Contact Info",
            onClick: () => setIsAddingNew(true),
          }}
        />
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {contactInfo.map((info: any) => (
              <Card key={info.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    {getContactIcon(info.type)}
                    {getContactLabel(info.type)}
                    {!info.public && (
                      <Badge variant="outline" className="ml-2">Private</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="font-medium break-all">
                    {info.value}
                  </p>
                </CardContent>
                <CardFooter className="pt-2 border-t flex justify-between">
                  <Switch
                    checked={info.public}
                    onCheckedChange={(checked) => 
                      togglePublicMutation.mutate({
                        id: info.id,
                        isPublic: checked,
                      })
                    }
                    disabled={togglePublicMutation.isPending}
                  />
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditEntry(info)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <ConfirmDialog
                      title="Delete Contact Info"
                      description="Are you sure you want to delete this contact information? This action cannot be undone."
                      onConfirm={() => deleteMutation.mutate(info.id)}
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