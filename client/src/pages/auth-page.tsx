import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [, setLocation] = useLocation();
  
  // Form states with default admin credentials for this portfolio
  const [loginData, setLoginData] = useState({
    username: "admin",
    password: "bootstrapsatya2025",
  });
  
  const [registerData, setRegisterData] = useState({
    username: "",
    password: "",
    email: "",
    fullName: "",
  });
  
  // If already logged in, redirect to admin dashboard
  if (user) {
    setLocation("/admin");
    return null;
  }
  
  // Handle login form submit
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(loginData);
  };
  
  // Handle register form submit
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(registerData);
  };
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side: Auth forms */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-gray-950">
        <div className="w-full max-w-md">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            {/* Login Tab */}
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Login to Dashboard</CardTitle>
                  <CardDescription>
                    Enter your credentials to access the admin dashboard
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-username">Username</Label>
                      <Input 
                        id="login-username" 
                        type="text"
                        value={loginData.username}
                        onChange={(e) => 
                          setLoginData({ ...loginData, username: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <Input 
                        id="login-password" 
                        type="password"
                        value={loginData.password}
                        onChange={(e) => 
                          setLoginData({ ...loginData, password: e.target.value })
                        }
                        required
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Logging in...
                        </>
                      ) : (
                        "Login"
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            {/* Register Tab */}
            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Create Account</CardTitle>
                  <CardDescription>
                    Create a new admin account (requires approval)
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleRegister}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-username">Username</Label>
                      <Input 
                        id="register-username" 
                        type="text"
                        value={registerData.username}
                        onChange={(e) => 
                          setRegisterData({ ...registerData, username: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-fullname">Full Name</Label>
                      <Input 
                        id="register-fullname" 
                        type="text"
                        value={registerData.fullName}
                        onChange={(e) => 
                          setRegisterData({ ...registerData, fullName: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input 
                        id="register-email" 
                        type="email"
                        value={registerData.email}
                        onChange={(e) => 
                          setRegisterData({ ...registerData, email: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Password</Label>
                      <Input 
                        id="register-password" 
                        type="password"
                        value={registerData.password}
                        onChange={(e) => 
                          setRegisterData({ ...registerData, password: e.target.value })
                        }
                        required
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Right side: Hero section */}
      <div className="flex-1 bg-gradient-to-br from-blue-600 to-purple-700 p-12 flex flex-col justify-center relative overflow-hidden text-white">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-6">Portfolio Admin Dashboard</h1>
          <p className="text-xl mb-8 opacity-90">
            Manage your portfolio content, blog posts, projects, and more from one central location.
          </p>
          <ul className="space-y-3">
            <li className="flex items-center">
              <span className="mr-2 text-lg">✓</span>
              Content Management
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-lg">✓</span>
              Blog Post Editor
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-lg">✓</span>
              Project Showcase Controls
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-lg">✓</span>
              Statistics & Analytics
            </li>
          </ul>
        </div>
        
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-blue-300 blur-3xl"></div>
        </div>
      </div>
    </div>
  );
}