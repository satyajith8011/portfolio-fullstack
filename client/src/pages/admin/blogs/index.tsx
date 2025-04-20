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
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Calendar,
  Edit,
  Eye,
  EyeOff,
  Pencil,
  Trash2,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export default function AdminBlogsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [view, setView] = useState<string>("all");
  
  // Fetch blog posts
  const { data: blogPosts = [], isLoading } = useQuery({
    queryKey: ["/api/admin/blog"],
    queryFn: async () => {
      const res = await fetch("/api/admin/blog");
      if (!res.ok) throw new Error("Failed to fetch blog posts");
      return res.json();
    }
  });
  
  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/admin/blog/${id}`);
      if (!res.ok) throw new Error("Failed to delete blog post");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Blog post deleted",
        description: "The blog post has been removed successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting blog post",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Toggle published mutation
  const togglePublishedMutation = useMutation({
    mutationFn: async ({ id, published }: { id: number; published: boolean }) => {
      const res = await apiRequest("PATCH", `/api/admin/blog/${id}/publish`, { published });
      if (!res.ok) throw new Error("Failed to update blog post");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating blog post",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const filteredBlogPosts = view === "all" 
    ? blogPosts 
    : view === "published" 
      ? blogPosts.filter((post: any) => post.published) 
      : blogPosts.filter((post: any) => !post.published);
  
  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  
  if (isLoading) {
    return (
      <AdminSectionLayout 
        title="Blog Posts" 
        description="Manage your blog content"
        createButton={{ href: "/admin/blogs/new" }}
      >
        <LoadingState type="table" rows={3} />
      </AdminSectionLayout>
    );
  }
  
  return (
    <AdminSectionLayout
      title="Blog Posts"
      description="Manage your blog content"
      createButton={{ href: "/admin/blogs/new" }}
    >
      <Tabs defaultValue="all" value={view} onValueChange={setView} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Posts</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
        </TabsList>
      </Tabs>

      {blogPosts.length === 0 ? (
        <EmptyState
          title="No blog posts yet"
          description="Start adding blog posts to share your knowledge and experiences."
          icon={<FileText className="h-8 w-8 text-muted-foreground" />}
          action={{
            href: "/admin/blogs/new",
            label: "Create Post",
          }}
        />
      ) : filteredBlogPosts.length === 0 ? (
        <div className="text-center py-8">
          <h3 className="text-lg font-medium">No posts found</h3>
          <p className="text-muted-foreground mt-1">Try changing your filter or add new posts.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBlogPosts.map((post: any) => (
            <Card key={post.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl mb-1">{post.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {post.publishedAt 
                        ? formatDate(post.publishedAt)
                        : "Not published yet"
                      }
                      {post.published ? (
                        <Badge className="bg-green-500 ml-2">Published</Badge>
                      ) : (
                        <Badge variant="outline" className="ml-2">Draft</Badge>
                      )}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => 
                      togglePublishedMutation.mutate({
                        id: post.id,
                        published: !post.published,
                      })
                    }
                    disabled={togglePublishedMutation.isPending}
                  >
                    {post.published ? (
                      <EyeOff className="h-4 w-4 mr-1" />
                    ) : (
                      <Eye className="h-4 w-4 mr-1" />
                    )}
                    {post.published ? "Unpublish" : "Publish"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {post.summary || post.content?.substring(0, 150) || "No description provided"}
                </p>
                {post.image && (
                  <div className="mt-3 aspect-video w-full max-h-32 overflow-hidden rounded-md border">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-wrap gap-1 mt-3">
                  {post.tags?.split(',').map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag.trim()}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-3 flex justify-end items-center border-t gap-2">
                <Link href={`/admin/blogs/${post.id}`}>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </Link>
                <ConfirmDialog
                  title="Delete Blog Post"
                  description={`Are you sure you want to delete "${post.title}"? This action cannot be undone.`}
                  onConfirm={() => deleteMutation.mutate(post.id)}
                  isPending={deleteMutation.isPending}
                />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </AdminSectionLayout>
  );
}