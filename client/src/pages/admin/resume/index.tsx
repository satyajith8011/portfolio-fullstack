import { useState, useEffect } from "react";
import { AdminSectionLayout } from "@/components/admin/AdminSectionLayout";
import { LoadingState } from "@/components/admin/LoadingState";
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
  AlertCircle,
  FileText,
  Upload,
  Download,
  Trash2,
  Link as LinkIcon,
  ExternalLink,
  FileUp,
  CheckCircle,
  Eye,
  FilePdf,
  FileX,
  File
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

export default function AdminResumePage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);
  const [resumeUrl, setResumeUrl] = useState("");
  const [displayOption, setDisplayOption] = useState<"file" | "link">("file");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [publiclyAccessible, setPubliclyAccessible] = useState(true);
  
  // Fetch resume settings
  const { data: resumeSettings, isLoading } = useQuery({
    queryKey: ["/api/admin/resume"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/admin/resume");
        if (!res.ok) {
          if (res.status === 404) {
            return { url: "", is_public: true, type: "file" }; // Default values
          }
          throw new Error("Failed to fetch resume settings");
        }
        return res.json();
      } catch (error) {
        console.error("Error fetching resume settings:", error);
        return { url: "", is_public: true, type: "file" }; // Default values on error
      }
    }
  });
  
  // Update effect when resumeSettings changes
  useEffect(() => {
    if (resumeSettings) {
      setResumeUrl(resumeSettings.url || "");
      setPubliclyAccessible(resumeSettings.is_public !== false);
      setDisplayOption(resumeSettings.type === "link" ? "link" : "file");
    }
  }, [resumeSettings]);
  
  // File upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      
      const res = await fetch("/api/admin/upload/resume", {
        method: "POST",
        body: formData,
      });
      
      if (!res.ok) throw new Error("Failed to upload resume");
      return res.json();
    },
    onSuccess: (data) => {
      setResumeUrl(data.url);
      toast({
        title: "Resume uploaded",
        description: "Your resume has been uploaded successfully.",
      });
      
      // Save settings after successful upload
      updateSettings({
        url: data.url,
        is_public: publiclyAccessible,
        type: "file"
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error uploading resume",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Update settings mutation
  const updateMutation = useMutation({
    mutationFn: async (data: { url: string; is_public: boolean; type: string }) => {
      const res = await apiRequest("PUT", "/api/admin/resume", data);
      if (!res.ok) throw new Error("Failed to update resume settings");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Resume settings updated",
        description: "Your resume settings have been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/resume"] });
      setIsSaving(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating resume settings",
        description: error.message,
        variant: "destructive",
      });
      setIsSaving(false);
    },
  });
  
  // Delete resume mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("DELETE", "/api/admin/resume");
      if (!res.ok) throw new Error("Failed to delete resume");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Resume deleted",
        description: "Your resume has been deleted successfully.",
      });
      setResumeUrl("");
      queryClient.invalidateQueries({ queryKey: ["/api/admin/resume"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting resume",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Check if file is PDF
      if (file.type !== "application/pdf") {
        toast({
          title: "Invalid file type",
          description: "Please select a PDF file for your resume.",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };
  
  // Handle file upload
  const handleUpload = () => {
    if (selectedFile) {
      uploadMutation.mutate(selectedFile);
    }
  };
  
  // Handle saving external link
  const handleSaveLink = () => {
    setIsSaving(true);
    updateSettings({
      url: resumeUrl,
      is_public: publiclyAccessible,
      type: "link"
    });
  };
  
  // Handle delete resume
  const handleDeleteResume = () => {
    deleteMutation.mutate();
  };
  
  // Helper function to update settings
  const updateSettings = (settings: { url: string; is_public: boolean; type: string }) => {
    updateMutation.mutate(settings);
  };
  
  // Toggle public access
  const handleTogglePublic = (checked: boolean) => {
    setPubliclyAccessible(checked);
    
    // If we already have a resume URL, update the setting immediately
    if (resumeUrl) {
      updateSettings({
        url: resumeUrl,
        is_public: checked,
        type: displayOption
      });
    }
  };
  
  // Get file name from URL
  const getFileName = (url: string) => {
    if (!url) return '';
    const parts = url.split('/');
    return parts[parts.length - 1];
  };
  
  if (isLoading) {
    return (
      <AdminSectionLayout 
        title="Resume / CV" 
        description="Upload and manage your professional resume/CV"
      >
        <LoadingState />
      </AdminSectionLayout>
    );
  }
  
  return (
    <AdminSectionLayout
      title="Resume / CV"
      description="Upload and manage your professional resume/CV"
    >
      <Tabs defaultValue={displayOption} onValueChange={(v) => setDisplayOption(v as "file" | "link")}>
        <TabsList className="mb-6">
          <TabsTrigger value="file">Upload File</TabsTrigger>
          <TabsTrigger value="link">External Link</TabsTrigger>
        </TabsList>
        
        <TabsContent value="file" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Upload Resume</CardTitle>
              <CardDescription>
                Upload your CV or resume as a PDF file
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {resumeUrl && displayOption === "file" ? (
                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-muted rounded-lg">
                    <FilePdf className="h-10 w-10 text-primary mr-4" />
                    <div className="flex-grow">
                      <h3 className="font-medium mb-1">
                        {getFileName(resumeUrl)}
                      </h3>
                      <p className="text-sm text-muted-foreground break-all">
                        {resumeUrl}
                      </p>
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </a>
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={handleDeleteResume}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="public-access"
                      checked={publiclyAccessible}
                      onCheckedChange={handleTogglePublic}
                    />
                    <Label htmlFor="public-access">Make publicly accessible</Label>
                  </div>
                  
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Resume Visibility</AlertTitle>
                    <AlertDescription>
                      {publiclyAccessible 
                        ? "Your resume is currently set to be publicly accessible on your portfolio."
                        : "Your resume is currently set to be hidden from public view."}
                    </AlertDescription>
                  </Alert>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid gap-3">
                    <Label htmlFor="resume">Resume/CV File (PDF)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="resume"
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="flex-grow"
                      />
                      <Button 
                        onClick={handleUpload}
                        disabled={!selectedFile || uploadMutation.isPending}
                      >
                        {uploadMutation.isPending ? "Uploading..." : "Upload"}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Upload your resume as a PDF file. This will be available for download on your portfolio.
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-4">
                    <Switch
                      id="public-access"
                      checked={publiclyAccessible}
                      onCheckedChange={handleTogglePublic}
                    />
                    <Label htmlFor="public-access">Make publicly accessible</Label>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="link" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Resume External Link</CardTitle>
              <CardDescription>
                Provide a link to your resume hosted elsewhere (e.g., Google Drive, Dropbox)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                <Label htmlFor="resumeLink">Resume URL</Label>
                <Input
                  id="resumeLink"
                  placeholder="https://example.com/my-resume.pdf"
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Provide a direct link to your resume. Make sure the URL is publicly accessible.
                </p>
              </div>
              
              <div className="flex items-center space-x-2 mt-4">
                <Switch
                  id="public-access-link"
                  checked={publiclyAccessible}
                  onCheckedChange={handleTogglePublic}
                />
                <Label htmlFor="public-access-link">Display resume link on portfolio</Label>
              </div>
              
              {resumeUrl && (
                <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    <LinkIcon className="h-3 w-3 mr-1" />
                    Preview
                  </Badge>
                  <a 
                    href={resumeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline flex items-center text-sm"
                  >
                    {resumeUrl}
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>
              )}
            </CardContent>
            <CardFooter className="justify-between border-t pt-4">
              {resumeSettings?.url && resumeSettings?.type === "link" && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteResume}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Remove Link
                </Button>
              )}
              <Button 
                onClick={handleSaveLink}
                disabled={!resumeUrl || isSaving || updateMutation.isPending}
              >
                Save Link
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminSectionLayout>
  );
}