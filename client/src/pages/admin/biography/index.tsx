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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  History, 
  Calendar, 
  Edit, 
  Trash2, 
  GripVertical,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormWrapper } from "@/components/admin/FormWrapper";
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

// Generate years for dropdown
const generateYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear; year >= 1990; year--) {
    years.push({ value: year.toString(), label: year.toString() });
  }
  return years;
};

// Helper function to render biography entries
function renderBiographyEntries(
  biographyEntries: any[], 
  biographyTypes: { value: string; label: string }[],
  handleEditEntry: (entry: any) => void,
  deleteMutation: any
) {
  // Group entries by year
  const entriesByYear: Record<string, any[]> = {};
  
  biographyEntries.forEach((entry: any) => {
    const year = entry.year || "Unknown";
    if (!entriesByYear[year]) entriesByYear[year] = [];
    entriesByYear[year].push(entry);
  });
  
  // Sort years in descending order
  const sortedYears = Object.keys(entriesByYear).sort((a, b) => Number(b) - Number(a));
  
  return sortedYears.map(year => (
    <div key={year} className="mb-8">
      <h3 className="text-xl font-semibold mb-3 flex items-center">
        <Calendar className="h-5 w-5 mr-2" />
        {year}
      </h3>
      
      <div className="space-y-3">
        {entriesByYear[year]
          .sort((a: any, b: any) => a.order - b.order)
          .map((entry: any) => (
            <Card key={entry.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">
                      {entry.title}
                    </CardTitle>
                    {entry.type && (
                      <CardDescription className="text-sm">
                        {biographyTypes.find(t => t.value === entry.type)?.label || entry.type}
                      </CardDescription>
                    )}
                  </div>
                  <div className="flex items-center mt-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditEntry(entry)}
                      className="h-8 w-8"
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <ConfirmDialog
                      title="Delete Entry"
                      description={`Are you sure you want to delete "${entry.title}"? This action cannot be undone.`}
                      onConfirm={() => deleteMutation.mutate(entry.id)}
                      isPending={deleteMutation.isPending}
                      trigger={
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      }
                    />
                  </div>
                </div>
              </CardHeader>
              {entry.description && (
                <CardContent className="py-2">
                  <p className="text-sm text-muted-foreground">
                    {entry.description}
                  </p>
                </CardContent>
              )}
              <CardFooter className="pt-2 border-t flex justify-end text-xs text-muted-foreground">
                <div className="flex items-center">
                  <GripVertical className="h-3 w-3 mr-1" />
                  Order: {entry.order || 0}
                </div>
              </CardFooter>
            </Card>
          ))}
      </div>
    </div>
  ));
}

export default function AdminBiographyPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    year: new Date().getFullYear().toString(),
    order: 0,
    type: "education", // Default type
  });
  
  // Types of biography entries
  const biographyTypes = [
    { value: "education", label: "Education" },
    { value: "work", label: "Work Experience" },
    { value: "personal", label: "Personal" },
    { value: "achievement", label: "Achievement" },
    { value: "project", label: "Project" },
  ];
  
  // Fetch biography entries
  const { data: biographyEntries = [], isLoading } = useQuery({
    queryKey: ["/api/admin/biography"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/admin/biography");
        if (!res.ok) {
          if (res.status === 404) {
            return []; // Return empty array if endpoint not implemented
          }
          throw new Error("Failed to fetch biography entries");
        }
        return res.json();
      } catch (error) {
        console.error("Error fetching biography entries:", error);
        return []; // Return empty array on error
      }
    }
  });
  
  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await apiRequest("POST", "/api/admin/biography", data);
      if (!res.ok) throw new Error("Failed to create biography entry");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Biography entry created",
        description: "Your biography entry has been added successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/biography"] });
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating entry",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: typeof formData }) => {
      const res = await apiRequest("PUT", `/api/admin/biography/${id}`, data);
      if (!res.ok) throw new Error("Failed to update biography entry");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Biography entry updated",
        description: "Your biography entry has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/biography"] });
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating entry",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/admin/biography/${id}`);
      if (!res.ok) throw new Error("Failed to delete biography entry");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Biography entry deleted",
        description: "The entry has been removed successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/biography"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting entry",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Reset form and state
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      year: new Date().getFullYear().toString(),
      order: 0,
      type: "education",
    });
    setIsAddingNew(false);
    setEditingId(null);
  };
  
  // Handle editing a biography entry
  const handleEditEntry = (entry: any) => {
    setFormData({
      title: entry.title || "",
      description: entry.description || "",
      year: entry.year?.toString() || new Date().getFullYear().toString(),
      order: entry.order || 0,
      type: entry.type || "education",
    });
    setEditingId(entry.id);
    setIsAddingNew(true);
  };
  
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
  
  const handleSubmit = () => {
    if (editingId !== null) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };
  
  if (isLoading) {
    return (
      <AdminSectionLayout 
        title="Biography" 
        description="Manage your education, work experience, and life milestones"
      >
        <LoadingState />
      </AdminSectionLayout>
    );
  }
  
  return (
    <AdminSectionLayout
      title="Biography"
      description="Manage your education, work experience, and life milestones"
      headerContent={
        !isAddingNew ? (
          <Button onClick={() => setIsAddingNew(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Add Timeline Entry
          </Button>
        ) : null
      }
    >
      {isAddingNew ? (
        <FormWrapper
          title={editingId ? "Edit Timeline Entry" : "Add Timeline Entry"}
          description={editingId ? "Update a timeline entry" : "Create a new timeline entry"}
          onSubmit={handleSubmit}
          cancelHref="/admin/biography"
          isPending={createMutation.isPending || updateMutation.isPending}
          submitLabel={editingId ? "Save Changes" : "Add Entry"}
        >
          <div className="grid gap-5 py-4">
            <div className="grid gap-3">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g. Graduated from University, Started at Company X"
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
                placeholder="Provide details about this milestone"
                value={formData.description}
                onChange={handleInputChange}
                className="min-h-24"
              />
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="grid gap-3">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleSelectChange("type", value)}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {biographyTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-3">
                <Label htmlFor="year">Year</Label>
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
                Lower numbers display first. Entries will be grouped by year.
              </p>
            </div>
          </div>
        </FormWrapper>
      ) : biographyEntries.length === 0 ? (
        <EmptyState
          title="No biography entries yet"
          description="Start adding your education, work experience, and life milestones."
          icon={<History className="h-8 w-8 text-muted-foreground" />}
          action={{
            label: "Add Timeline Entry",
            onClick: () => setIsAddingNew(true),
          }}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium">Timeline Entries</h3>
          </div>
          
          {/* Group entries by year and render */}
          {renderBiographyEntries(biographyEntries, biographyTypes, handleEditEntry, deleteMutation)}
        </div>
      )}
    </AdminSectionLayout>
  );
}