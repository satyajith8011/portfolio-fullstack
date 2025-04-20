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
  Mail,
  Calendar,
  Eye,
  EyeOff,
  User,
  MessageSquare,
  Trash2,
  AtSign,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export default function AdminMessagesPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [view, setView] = useState<string>("all");
  
  // Fetch contact messages
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["/api/admin/messages"],
    queryFn: async () => {
      const res = await fetch("/api/admin/messages");
      if (!res.ok) throw new Error("Failed to fetch messages");
      return res.json();
    }
  });
  
  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/admin/messages/${id}`);
      if (!res.ok) throw new Error("Failed to delete message");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Message deleted",
        description: "The message has been removed successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/messages"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting message",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async ({ id, read }: { id: number; read: boolean }) => {
      const res = await apiRequest("PATCH", `/api/admin/messages/${id}/read`, { read });
      if (!res.ok) throw new Error("Failed to update message");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/messages"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating message",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const filteredMessages = view === "all" 
    ? messages 
    : view === "unread" 
      ? messages.filter((message: any) => !message.read) 
      : messages.filter((message: any) => message.read);
  
  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  
  if (isLoading) {
    return (
      <AdminSectionLayout 
        title="Contact Messages" 
        description="Manage messages from your contact form"
      >
        <LoadingState type="table" rows={4} />
      </AdminSectionLayout>
    );
  }
  
  return (
    <AdminSectionLayout
      title="Contact Messages"
      description="Manage messages from your contact form"
    >
      <Tabs defaultValue="all" value={view} onValueChange={setView} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Messages</TabsTrigger>
          <TabsTrigger value="unread">
            Unread
            {messages.filter((m: any) => !m.read).length > 0 && (
              <Badge className="ml-2 bg-blue-500">{messages.filter((m: any) => !m.read).length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="read">Read</TabsTrigger>
        </TabsList>
      </Tabs>

      {messages.length === 0 ? (
        <EmptyState
          title="No messages yet"
          description="Messages from your contact form will appear here."
          icon={<Mail className="h-8 w-8 text-muted-foreground" />}
        />
      ) : filteredMessages.length === 0 ? (
        <div className="text-center py-8">
          <h3 className="text-lg font-medium">No messages found</h3>
          <p className="text-muted-foreground mt-1">Try changing your filter or check back later.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMessages.map((message: any) => (
            <Card 
              key={message.id} 
              className={`overflow-hidden ${!message.read ? 'border-blue-500 dark:border-blue-400' : ''}`}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {message.name}
                      {!message.read && (
                        <Badge className="bg-blue-500 ml-2">New</Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <AtSign className="h-4 w-4" />
                      <a 
                        href={`mailto:${message.email}`}
                        className="text-blue-500 hover:underline flex items-center"
                      >
                        {message.email}
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </CardDescription>
                  </div>
                  <div className="text-sm text-gray-500 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(message.createdAt)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="py-2">
                <div className="font-medium mb-2">{message.subject}</div>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{message.message}</p>
              </CardContent>
              <CardFooter className="pt-2 flex justify-between items-center border-t">
                <div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => 
                      markAsReadMutation.mutate({
                        id: message.id,
                        read: !message.read,
                      })
                    }
                    disabled={markAsReadMutation.isPending}
                  >
                    {message.read ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-1" />
                        Mark as unread
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-1" />
                        Mark as read
                      </>
                    )}
                  </Button>
                </div>
                <ConfirmDialog
                  title="Delete Message"
                  description="Are you sure you want to delete this message? This action cannot be undone."
                  onConfirm={() => deleteMutation.mutate(message.id)}
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