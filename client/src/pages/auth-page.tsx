import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Loader2, User, Lock, Mail, UserPlus, Briefcase, Code, ImageIcon, Award } from "lucide-react";
import { motion } from "framer-motion";

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [, setLocation] = useLocation();
  const [particles, setParticles] = useState<Array<{x: number, y: number, size: number, speed: number, color: string}>>([]);

  // Create animated particles on component mount
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      const colors = ['#4F46E5', '#8B5CF6', '#EC4899', '#F43F5E', '#FB7185'];
      
      for (let i = 0; i < 30; i++) {
        newParticles.push({
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 10 + 2,
          speed: Math.random() * 1 + 0.5,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
      
      setParticles(newParticles);
    };
    
    generateParticles();
  }, []);
  
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
  
  // Framer Motion animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };
  
  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.98 }
  };
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side: Auth forms */}
      <motion.div 
        className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-gray-950 overflow-hidden relative"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {particles.map((particle, index) => (
            <motion.div
              key={index}
              className="absolute rounded-full opacity-30 dark:opacity-10"
              style={{ 
                backgroundColor: particle.color,
                width: particle.size,
                height: particle.size,
                left: `${particle.x}%`,
                top: `${particle.y}%`,
              }}
              animate={{
                y: [0, particle.speed * 100, 0],
                x: [0, particle.speed * 30, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 4 + particle.speed * 5,
                repeat: Infinity,
                ease: "easeInOut",
                repeatType: "reverse",
              }}
            />
          ))}
        </div>
        
        <motion.div 
          className="w-full max-w-md z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              {/* Login Tab */}
              <TabsContent value="login">
                <Card className="border border-slate-200 dark:border-slate-800 shadow-lg">
                  <CardHeader>
                    <motion.div variants={itemVariants}>
                      <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Login to Dashboard
                      </CardTitle>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <CardDescription>
                        Enter your credentials to access the admin dashboard
                      </CardDescription>
                    </motion.div>
                  </CardHeader>
                  <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4">
                      <motion.div variants={itemVariants} className="space-y-2">
                        <Label htmlFor="login-username" className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Username
                        </Label>
                        <div className="relative">
                          <Input 
                            id="login-username" 
                            type="text"
                            value={loginData.username}
                            onChange={(e) => 
                              setLoginData({ ...loginData, username: e.target.value })
                            }
                            required
                            className="pl-8 transition-all duration-300 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </motion.div>
                      <motion.div variants={itemVariants} className="space-y-2">
                        <Label htmlFor="login-password" className="flex items-center gap-2">
                          <Lock className="h-4 w-4" />
                          Password
                        </Label>
                        <div className="relative">
                          <Input 
                            id="login-password" 
                            type="password"
                            value={loginData.password}
                            onChange={(e) => 
                              setLoginData({ ...loginData, password: e.target.value })
                            }
                            required
                            className="pl-8 transition-all duration-300 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </motion.div>
                    </CardContent>
                    <CardFooter>
                      <motion.div 
                        variants={itemVariants}
                        className="w-full"
                      >
                        <motion.div
                          variants={buttonVariants}
                          initial="rest"
                          whileHover="hover"
                          whileTap="tap"
                        >
                          <Button 
                            type="submit" 
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
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
                        </motion.div>
                      </motion.div>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
              
              {/* Register Tab */}
              <TabsContent value="register">
                <Card className="border border-slate-200 dark:border-slate-800 shadow-lg">
                  <CardHeader>
                    <motion.div variants={itemVariants}>
                      <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Create Account
                      </CardTitle>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <CardDescription>
                        Create a new admin account (requires approval)
                      </CardDescription>
                    </motion.div>
                  </CardHeader>
                  <form onSubmit={handleRegister}>
                    <CardContent className="space-y-4">
                      <motion.div variants={itemVariants} className="space-y-2">
                        <Label htmlFor="register-username" className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Username
                        </Label>
                        <Input 
                          id="register-username" 
                          type="text"
                          value={registerData.username}
                          onChange={(e) => 
                            setRegisterData({ ...registerData, username: e.target.value })
                          }
                          required
                          className="transition-all duration-300 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
                        />
                      </motion.div>
                      <motion.div variants={itemVariants} className="space-y-2">
                        <Label htmlFor="register-fullname" className="flex items-center gap-2">
                          <UserPlus className="h-4 w-4" />
                          Full Name
                        </Label>
                        <Input 
                          id="register-fullname" 
                          type="text"
                          value={registerData.fullName}
                          onChange={(e) => 
                            setRegisterData({ ...registerData, fullName: e.target.value })
                          }
                          className="transition-all duration-300 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
                        />
                      </motion.div>
                      <motion.div variants={itemVariants} className="space-y-2">
                        <Label htmlFor="register-email" className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email
                        </Label>
                        <Input 
                          id="register-email" 
                          type="email"
                          value={registerData.email}
                          onChange={(e) => 
                            setRegisterData({ ...registerData, email: e.target.value })
                          }
                          className="transition-all duration-300 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
                        />
                      </motion.div>
                      <motion.div variants={itemVariants} className="space-y-2">
                        <Label htmlFor="register-password" className="flex items-center gap-2">
                          <Lock className="h-4 w-4" />
                          Password
                        </Label>
                        <Input 
                          id="register-password" 
                          type="password"
                          value={registerData.password}
                          onChange={(e) => 
                            setRegisterData({ ...registerData, password: e.target.value })
                          }
                          required
                          className="transition-all duration-300 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
                        />
                      </motion.div>
                    </CardContent>
                    <CardFooter>
                      <motion.div 
                        variants={itemVariants}
                        className="w-full"
                      >
                        <motion.div
                          variants={buttonVariants}
                          initial="rest"
                          whileHover="hover"
                          whileTap="tap"
                        >
                          <Button 
                            type="submit" 
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
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
                        </motion.div>
                      </motion.div>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      </motion.div>
      
      {/* Right side: Hero section */}
      <motion.div 
        className="flex-1 bg-gradient-to-br from-blue-600 to-indigo-700 p-12 flex flex-col justify-center relative overflow-hidden text-white"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.div 
          className="relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 
            className="text-5xl font-bold mb-6"
            variants={itemVariants}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
              Portfolio Admin
            </span>
          </motion.h1>
          <motion.p 
            className="text-xl mb-10 opacity-90"
            variants={itemVariants}
          >
            Manage your portfolio content, blog posts, projects, and more from one central location.
          </motion.p>
          
          <motion.div 
            className="grid grid-cols-2 gap-6"
            variants={itemVariants}
          >
            <motion.div 
              className="flex flex-col items-center p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Briefcase className="h-10 w-10 mb-3" />
              <h3 className="font-semibold">Projects</h3>
              <p className="text-sm opacity-75 text-center">Showcase your best work</p>
            </motion.div>
            
            <motion.div 
              className="flex flex-col items-center p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Code className="h-10 w-10 mb-3" />
              <h3 className="font-semibold">Blog Posts</h3>
              <p className="text-sm opacity-75 text-center">Share your knowledge</p>
            </motion.div>
            
            <motion.div 
              className="flex flex-col items-center p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <ImageIcon className="h-10 w-10 mb-3" />
              <h3 className="font-semibold">Biography</h3>
              <p className="text-sm opacity-75 text-center">Tell your story</p>
            </motion.div>
            
            <motion.div 
              className="flex flex-col items-center p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Award className="h-10 w-10 mb-3" />
              <h3 className="font-semibold">Achievements</h3>
              <p className="text-sm opacity-75 text-center">Display your awards</p>
            </motion.div>
          </motion.div>
        </motion.div>
        
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          {particles.map((particle, index) => (
            <motion.div
              key={`hero-${index}`}
              className="absolute rounded-full bg-white opacity-20"
              style={{ 
                width: particle.size * 1.5,
                height: particle.size * 1.5,
                left: `${particle.x}%`,
                top: `${particle.y}%`,
              }}
              animate={{
                y: [0, particle.speed * -80, 0],
                x: [0, particle.speed * 40, 0],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 5 + particle.speed * 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
          
          {/* Large gradient orbs */}
          <motion.div 
            className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] rounded-full opacity-30 bg-gradient-to-r from-purple-500 to-pink-500 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
          
          <motion.div 
            className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] rounded-full opacity-20 bg-gradient-to-r from-blue-400 to-cyan-300 blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}