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
  FileCode,
  BookOpen,
  Briefcase,
  ArrowUp,
  ArrowDown,
  Code,
  Lightbulb,
  BookOpenCheck,
  Blocks,
  CheckCircle2,
  ChefHat
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Focus area types
const focusTypes = [
  { value: "learning", label: "Learning", icon: <BookOpen className="h-4 w-4 mr-2" /> },
  { value: "working", label: "Working On", icon: <Briefcase className="h-4 w-4 mr-2" /> },
  { value: "researching", label: "Researching", icon: <Lightbulb className="h-4 w-4 mr-2" /> },
  { value: "building", label: "Building", icon: <Blocks className="h-4 w-4 mr-2" /> },
  { value: "mastering", label: "Mastering", icon: <ChefHat className="h-4 w-4 mr-2" /> },
  { value: "other", label: "Other", icon: <FileCode className="h-4 w-4 mr-2" /> },
];

export default function AdminCurrentWorkPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    type: "learning",
    description: "",
    display_order: 0,
  });
  
  // Fetch current focus areas
  const { data: focusAreas = [], isLoading } = useQuery({
    queryKey: ["/api/admin/focus"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/admin/focus");
        if (!res.ok) {
          if (res.status === 404) {
            return []; // Return empty array if endpoint not implemented
          }
          throw new Error("Failed to fetch current focus areas");
        }
        return res.json();
      } catch (error) {
        console.error("Error fetching focus areas:", error);
        return []; // Return empty array on error
      }
    }
  });
  
  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await apiRequest("POST", "/api/admin/focus", data);
      if (!res.ok) throw new Error("Failed to create focus area");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Focus area created",
        description: "Your current focus area has been added successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/focus"] });
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating focus area",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: typeof formData }) => {
      const res = await apiRequest("PUT", `/api/admin/focus/${id}`, data);
      if (!res.ok) throw new Error("Failed to update focus area");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Focus area updated",
        description: "Your current focus area has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/focus"] });
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating focus area",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/admin/focus/${id}`);
      if (!res.ok) throw new Error("Failed to delete focus area");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Focus area deleted",
        description: "The focus area has been removed successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/focus"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting focus area",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Update display order mutation
  const updateOrderMutation = useMutation({
    mutationFn: async ({ id, direction }: { id: number; direction: 'up' | 'down' }) => {
      const res = await apiRequest("PATCH", `/api/admin/focus/${id}/order`, { direction });
      if (!res.ok) throw new Error("Failed to update display order");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/focus"] });
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
      name: "",
      type: "learning",
      description: "",
      display_order: 0,
    });
    setIsAddingNew(false);
    setEditingId(null);
  };
  
  // Handle editing a focus area
  const handleEditEntry = (entry: any) => {
    setFormData({
      name: entry.name || "",
      type: entry.type || "learning",
      description: entry.description || "",
      display_order: entry.display_order || 0,
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
  
  const handleTypeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, type: value }));
  };
  
  const handleSubmit = () => {
    // Automatically set display_order to the end if it's 0
    const newFormData = {...formData};
    if (newFormData.display_order === 0) {
      const maxOrder = focusAreas.length > 0 
        ? Math.max(...(focusAreas as any[]).map((area: any) => area.display_order || 0)) 
        : 0;
      newFormData.display_order = maxOrder + 1;
    }
    
    if (editingId !== null) {
      updateMutation.mutate({ id: editingId, data: newFormData });
    } else {
      createMutation.mutate(newFormData);
    }
  };
  
  // Get icon for focus type
  const getFocusIcon = (type: string) => {
    const focusType = focusTypes.find(t => t.value === type);
    return focusType ? focusType.icon : <FileCode className="h-4 w-4 mr-2" />;
  };
  
  // Get label for focus type
  const getFocusLabel = (type: string) => {
    const focusType = focusTypes.find(t => t.value === type);
    return focusType ? focusType.label : type;
  };
  
  // Handle move up/down
  const handleMoveUp = (id: number) => {
    updateOrderMutation.mutate({ id, direction: 'up' });
  };
  
  const handleMoveDown = (id: number) => {
    updateOrderMutation.mutate({ id, direction: 'down' });
  };
  
  // Sort focus areas by display order
  const sortedFocusAreas = [...focusAreas].sort((a: any, b: any) => 
    (a.display_order || 0) - (b.display_order || 0)
  );
  
  // Get tag color based on type
  const getTagColor = (type: string) => {
    switch (type) {
      case 'learning':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'working':
        return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20';
      case 'researching':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
      case 'building':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'mastering':
        return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20';
    }
  };
  
  if (isLoading) {
    return (
      <AdminSectionLayout 
        title="Current Work & Focus" 
        description="Manage what you're currently learning, building, or interested in"
      >
        <LoadingState />
      </AdminSectionLayout>
    );
  }
  
  return (
    <AdminSectionLayout
      title="Current Work & Focus"
      description="Manage what you're currently learning, building, or interested in"
      headerContent={
        !isAddingNew ? (
          <Button onClick={() => setIsAddingNew(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Add Focus Area
          </Button>
        ) : null
      }
    >
      {isAddingNew ? (
        <FormWrapper
          title={editingId ? "Edit Focus Area" : "Add Focus Area"}
          description={editingId ? "Update what you're currently focused on" : "Add a new area of focus or interest"}
          onSubmit={handleSubmit}
          cancelHref="/admin/current-work"
          isPending={createMutation.isPending || updateMutation.isPending}
          submitLabel={editingId ? "Save Changes" : "Add Focus Area"}
        >
          <div className="grid gap-5 py-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Name/Technology <span className="text-destructive">*</span></Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., React.js, Machine Learning, UX Design"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <p className="text-xs text-muted-foreground">
                The name of the technology, skill, or area you're currently focused on
              </p>
            </div>
            
            <div className="grid gap-3">
              <Label htmlFor="type">Focus Type</Label>
              <Select
                value={formData.type}
                onValueChange={handleTypeChange}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select focus type" />
                </SelectTrigger>
                <SelectContent>
                  {focusTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center">
                        {type.icon}
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                How you're engaging with this area (learning, working on it, etc.)
              </p>
            </div>
            
            <div className="grid gap-3">
              <Label htmlFor="description">
                Brief Description <span className="text-xs text-muted-foreground ml-1">(Optional)</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="e.g., Diving deep into advanced animation techniques"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                A short description of what you're doing with this technology
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
      ) : sortedFocusAreas.length === 0 ? (
        <EmptyState
          title="No focus areas yet"
          description="Add technologies, topics, or areas you're currently learning or working on."
          icon={<Code className="h-8 w-8 text-muted-foreground" />}
          action={{
            label: "Add Focus Area",
            onClick: () => setIsAddingNew(true),
          }}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3 mb-6">
            {sortedFocusAreas.map((area: any) => (
              <Badge
                key={area.id}
                variant="outline"
                className={`text-sm py-2 px-3 ${getTagColor(area.type)}`}
              >
                {getFocusIcon(area.type)}
                {area.name}
              </Badge>
            ))}
          </div>
          
          <div className="flex flex-col space-y-3">
            {sortedFocusAreas.map((area: any, index: number) => (
              <Card key={area.id} className="overflow-hidden">
                <div className="flex items-center">
                  <div 
                    className={`p-4 flex-shrink-0 flex items-center justify-center w-16 border-r
                      ${area.type === 'learning' ? 'bg-blue-50 dark:bg-blue-950/30' : 
                      area.type === 'working' ? 'bg-green-50 dark:bg-green-950/30' : 
                      area.type === 'researching' ? 'bg-purple-50 dark:bg-purple-950/30' : 
                      area.type === 'building' ? 'bg-amber-50 dark:bg-amber-950/30' : 
                      area.type === 'mastering' ? 'bg-red-50 dark:bg-red-950/30' : 
                      'bg-gray-50 dark:bg-gray-800/50'}`}
                  >
                    {getFocusIcon(area.type)}
                  </div>
                  <CardHeader className="py-3 flex-grow">
                    <div className="flex items-center">
                      <CardTitle className="text-lg mr-2">
                        {area.name}
                      </CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {getFocusLabel(area.type)}
                      </Badge>
                    </div>
                    {area.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {area.description}
                      </p>
                    )}
                  </CardHeader>
                  <CardFooter className="py-3 pr-4 flex-shrink-0 flex items-center gap-1">
                    <div className="flex flex-col mr-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleMoveUp(area.id)}
                        disabled={index === 0 || updateOrderMutation.isPending}
                      >
                        <ArrowUp className="h-4 w-4" />
                        <span className="sr-only">Move Up</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleMoveDown(area.id)}
                        disabled={index === sortedFocusAreas.length - 1 || updateOrderMutation.isPending}
                      >
                        <ArrowDown className="h-4 w-4" />
                        <span className="sr-only">Move Down</span>
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditEntry(area)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <ConfirmDialog
                      title="Delete Focus Area"
                      description={`Are you sure you want to delete "${area.name}" from your focus areas? This action cannot be undone.`}
                      onConfirm={() => deleteMutation.mutate(area.id)}
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