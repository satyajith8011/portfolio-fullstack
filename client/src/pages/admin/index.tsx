import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Folder, 
  FileText, 
  Award, 
  Mail,
  Eye, 
  Star, 
  ArrowUp, 
  ArrowDown,
  User,
  Clock,
  Briefcase,
  Phone,
  Share2,
  FileUp,
  MessageSquareQuote,
  Image,
  LayoutGrid
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

export default function AdminDashboard() {
  // Fetch statistics data
  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ["/api/projects"],
    queryFn: async () => {
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("Failed to fetch projects");
      return res.json();
    }
  });
  
  const { data: blogPosts, isLoading: blogLoading } = useQuery({
    queryKey: ["/api/admin/blog"],
    queryFn: async () => {
      const res = await fetch("/api/admin/blog");
      if (!res.ok) throw new Error("Failed to fetch blog posts");
      return res.json();
    }
  });
  
  const { data: achievements, isLoading: achievementsLoading } = useQuery({
    queryKey: ["/api/achievements"],
    queryFn: async () => {
      const res = await fetch("/api/achievements");
      if (!res.ok) throw new Error("Failed to fetch achievements");
      return res.json();
    }
  });
  
  const { data: messages, isLoading: messagesLoading } = useQuery({
    queryKey: ["/api/admin/messages"],
    queryFn: async () => {
      const res = await fetch("/api/admin/messages");
      if (!res.ok) throw new Error("Failed to fetch messages");
      return res.json();
    }
  });
  
  // Calculate counts and stats
  const stats = [
    {
      title: "Total Projects",
      value: projects?.length || 0,
      icon: Folder,
      color: "bg-blue-500",
      link: "/admin/projects",
      loading: projectsLoading
    },
    {
      title: "Blog Posts",
      value: blogPosts?.length || 0,
      icon: FileText,
      color: "bg-purple-500",
      link: "/admin/blog",
      loading: blogLoading
    },
    {
      title: "Achievements",
      value: achievements?.length || 0,
      icon: Award,
      color: "bg-amber-500",
      link: "/admin/achievements",
      loading: achievementsLoading
    },
    {
      title: "Unread Messages",
      value: messages?.filter(m => !m.read)?.length || 0,
      icon: Mail,
      color: "bg-green-500",
      link: "/admin/messages",
      loading: messagesLoading
    },
  ];
  
  const featuredProjects = projects?.filter(p => p.featured) || [];
  const publishedPosts = blogPosts?.filter(p => p.published) || [];
  const unpublishedPosts = blogPosts?.filter(p => !p.published) || [];
  const featuredAchievements = achievements?.filter(a => a.featured) || [];
  
  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Link key={stat.title} href={stat.link} className="block transition hover:scale-[1.02]">
              <Card>
                <CardContent className="p-6 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                    {stat.loading ? (
                      <Skeleton className="h-9 w-16 mt-1" />
                    ) : (
                      <p className="text-3xl font-bold mt-1">{stat.value}</p>
                    )}
                  </div>
                  <div className={`${stat.color} p-3 rounded-full text-white`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        
        {/* Admin sections grid */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Admin Sections</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 1. Projects */}
            <Link href="/admin/projects">
              <Card className="hover:shadow-md transition duration-300 cursor-pointer h-full">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 p-3 rounded-full text-blue-600 mr-4">
                      <Folder className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-medium">Projects</h3>
                  </div>
                  <p className="text-sm text-gray-500">
                    Manage your portfolio projects with tech stacks and GitHub links
                  </p>
                </CardContent>
              </Card>
            </Link>
            
            {/* 2. Blog Posts */}
            <Link href="/admin/blogs">
              <Card className="hover:shadow-md transition duration-300 cursor-pointer h-full">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-purple-100 p-3 rounded-full text-purple-600 mr-4">
                      <FileText className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-medium">Blog Posts</h3>
                  </div>
                  <p className="text-sm text-gray-500">
                    Create, edit and publish blog content with rich text editing
                  </p>
                </CardContent>
              </Card>
            </Link>
            
            {/* 3. Achievements */}
            <Link href="/admin/achievements">
              <Card className="hover:shadow-md transition duration-300 cursor-pointer h-full">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-amber-100 p-3 rounded-full text-amber-600 mr-4">
                      <Award className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-medium">Achievements</h3>
                  </div>
                  <p className="text-sm text-gray-500">
                    Showcase your certifications and awards in timeline format
                  </p>
                </CardContent>
              </Card>
            </Link>
            
            {/* 4. About Me */}
            <Link href="/admin/about">
              <Card className="hover:shadow-md transition duration-300 cursor-pointer h-full">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-green-100 p-3 rounded-full text-green-600 mr-4">
                      <User className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-medium">About Me</h3>
                  </div>
                  <p className="text-sm text-gray-500">
                    Edit your personal bio, headline, and profile details
                  </p>
                </CardContent>
              </Card>
            </Link>
            
            {/* 5. Biography */}
            <Link href="/admin/biography">
              <Card className="hover:shadow-md transition duration-300 cursor-pointer h-full">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-indigo-100 p-3 rounded-full text-indigo-600 mr-4">
                      <Clock className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-medium">Biography</h3>
                  </div>
                  <p className="text-sm text-gray-500">
                    Create a timeline of your educational and personal journey
                  </p>
                </CardContent>
              </Card>
            </Link>
            
            {/* 6. Skills */}
            <Link href="/admin/skills">
              <Card className="hover:shadow-md transition duration-300 cursor-pointer h-full">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-cyan-100 p-3 rounded-full text-cyan-600 mr-4">
                      <Briefcase className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-medium">Skills</h3>
                  </div>
                  <p className="text-sm text-gray-500">
                    Manage technical and soft skills with categorization
                  </p>
                </CardContent>
              </Card>
            </Link>
            
            {/* 7. Current Work */}
            <Link href="/admin/current-work">
              <Card className="hover:shadow-md transition duration-300 cursor-pointer h-full">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-pink-100 p-3 rounded-full text-pink-600 mr-4">
                      <LayoutGrid className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-medium">Current Work</h3>
                  </div>
                  <p className="text-sm text-gray-500">
                    Add ongoing projects and areas of learning focus
                  </p>
                </CardContent>
              </Card>
            </Link>
            
            {/* 8. Contact Details */}
            <Link href="/admin/contact">
              <Card className="hover:shadow-md transition duration-300 cursor-pointer h-full">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-orange-100 p-3 rounded-full text-orange-600 mr-4">
                      <Phone className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-medium">Contact Details</h3>
                  </div>
                  <p className="text-sm text-gray-500">
                    Update your contact information and communication preferences
                  </p>
                </CardContent>
              </Card>
            </Link>
            
            {/* 9. Social Media */}
            <Link href="/admin/social">
              <Card className="hover:shadow-md transition duration-300 cursor-pointer h-full">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-violet-100 p-3 rounded-full text-violet-600 mr-4">
                      <Share2 className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-medium">Social Media</h3>
                  </div>
                  <p className="text-sm text-gray-500">
                    Connect your professional profiles and social accounts
                  </p>
                </CardContent>
              </Card>
            </Link>
            
            {/* 10. Resume */}
            <Link href="/admin/resume">
              <Card className="hover:shadow-md transition duration-300 cursor-pointer h-full">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-rose-100 p-3 rounded-full text-rose-600 mr-4">
                      <FileUp className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-medium">Resume</h3>
                  </div>
                  <p className="text-sm text-gray-500">
                    Upload and manage your latest resume/CV
                  </p>
                </CardContent>
              </Card>
            </Link>
            
            {/* 11. Testimonials */}
            <Link href="/admin/testimonials">
              <Card className="hover:shadow-md transition duration-300 cursor-pointer h-full">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-teal-100 p-3 rounded-full text-teal-600 mr-4">
                      <MessageSquareQuote className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-medium">Testimonials</h3>
                  </div>
                  <p className="text-sm text-gray-500">
                    Add recommendations and feedback from colleagues
                  </p>
                </CardContent>
              </Card>
            </Link>
            
            {/* 12. Hero Section */}
            <Link href="/admin/hero">
              <Card className="hover:shadow-md transition duration-300 cursor-pointer h-full">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-emerald-100 p-3 rounded-full text-emerald-600 mr-4">
                      <Image className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-medium">Hero Section</h3>
                  </div>
                  <p className="text-sm text-gray-500">
                    Customize the main landing section with your profile image and title
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
          
        {/* Content row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Projects */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Featured Projects</span>
                <span className="text-sm font-normal text-blue-600">
                  <Link href="/admin/projects" className="flex items-center hover:underline">
                    View All <Eye className="ml-1 h-4 w-4" />
                  </Link>
                </span>
              </CardTitle>
              <CardDescription>Manage and update your highlighted projects</CardDescription>
            </CardHeader>
            <CardContent>
              {projectsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-md" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-4 w-28" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : featuredProjects.length > 0 ? (
                <div className="space-y-4">
                  {featuredProjects.slice(0, 4).map((project) => (
                    <div key={project.id} className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-md bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Folder className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium line-clamp-1">{project.title}</h3>
                        <p className="text-sm text-gray-500 line-clamp-1">{project.description}</p>
                      </div>
                      <div className="flex items-center ml-auto">
                        <Star className="h-4 w-4 text-amber-400" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No featured projects yet
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Blog Posts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Blog Posts Status</span>
                <span className="text-sm font-normal text-blue-600">
                  <Link href="/admin/blogs" className="flex items-center hover:underline">
                    Manage <Eye className="ml-1 h-4 w-4" />
                  </Link>
                </span>
              </CardTitle>
              <CardDescription>Overview of published and draft posts</CardDescription>
            </CardHeader>
            <CardContent>
              {blogLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-md" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-4 w-28" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : blogPosts?.length > 0 ? (
                <div className="space-y-4">
                  {blogPosts.slice(0, 4).map((post) => (
                    <div key={post.id} className="flex items-start space-x-4">
                      <div className={`w-12 h-12 rounded-md flex items-center justify-center flex-shrink-0 ${post.published ? 'bg-green-100' : 'bg-amber-100'}`}>
                        <FileText className={`h-6 w-6 ${post.published ? 'text-green-600' : 'text-amber-600'}`} />
                      </div>
                      <div>
                        <h3 className="font-medium line-clamp-1">{post.title}</h3>
                        <p className="text-sm text-gray-500 line-clamp-1">
                          {post.published ? (
                            <span className="flex items-center text-green-600">
                              <ArrowUp className="h-3 w-3 mr-1" /> Published
                            </span>
                          ) : (
                            <span className="flex items-center text-amber-600">
                              <ArrowDown className="h-3 w-3 mr-1" /> Draft
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No blog posts yet
                </div>
              )}
              
              {/* Blog stats summary */}
              {!blogLoading && blogPosts?.length > 0 && (
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-green-800">Published</p>
                    <p className="text-2xl font-bold text-green-800">{publishedPosts.length}</p>
                  </div>
                  <div className="bg-amber-50 p-3 rounded-lg">
                    <p className="text-sm text-amber-800">Drafts</p>
                    <p className="text-2xl font-bold text-amber-800">{unpublishedPosts.length}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Messages preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Messages</span>
              <span className="text-sm font-normal text-blue-600">
                <Link href="/admin/messages" className="flex items-center hover:underline">
                  View All <Eye className="ml-1 h-4 w-4" />
                </Link>
              </span>
            </CardTitle>
            <CardDescription>Latest contact form submissions</CardDescription>
          </CardHeader>
          <CardContent>
            {messagesLoading ? (
              <div className="space-y-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-6 w-40" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ))}
              </div>
            ) : messages?.length > 0 ? (
              <div className="space-y-6">
                {messages.slice(0, 3).map((message) => (
                  <div key={message.id} className="border-b pb-6 last:border-0 last:pb-0">
                    <div className="flex justify-between mb-2">
                      <div className="flex items-center">
                        <h3 className="font-medium">{message.name}</h3>
                        {!message.read && (
                          <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                            New
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(message.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm font-medium">{message.subject}</p>
                    <p className="text-sm text-gray-500 line-clamp-2 mt-1">{message.message}</p>
                    <p className="text-xs text-gray-400 mt-2">{message.email}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No messages received yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}