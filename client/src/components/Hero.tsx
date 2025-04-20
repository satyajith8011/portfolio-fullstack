import { motion, useMotionValue, useTransform, useScroll, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import ProfileSVG from "../assets/profile.svg";
import ProfileBgSVG from "../assets/profile-bg.svg";
import { ArrowDown, Code, Coffee, Mouse } from "lucide-react";

const Hero = () => {
  const { scrollY } = useScroll();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLElement>(null);
  
  // Parallax effect for text and image based on scroll
  const y = useMotionValue(0);
  const backgroundY = useTransform(scrollY, [0, 500], [0, 150]);
  const backgroundOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  
  // Mouse follower effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setMousePosition({ x, y });
      }
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);
  
  // Variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.7, 
        ease: [0.6, 0.05, -0.01, 0.9],
      },
    },
  };
  
  // Floating elements animation
  const floatingVariants = {
    animate: {
      y: [0, -15, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        repeatType: "loop" as const,
      },
    },
  };

  // Code snippets for background animation
  const codeSnippets = [
    'function solve() {',
    '  return "Hello World";',
    '}',
    'const ideas = [];',
    'ideas.push("Innovation");',
    'while(true) {',
    '  createMagic();',
    '}',
  ];

  return (
    <section
      id="home"
      ref={heroRef}
      className="min-h-screen pt-24 relative overflow-hidden flex items-center hero-gradient-bg code-rain"
    >
      {/* Animated tech-inspired background */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <motion.div
          className="absolute inset-0 flex flex-wrap content-start justify-start gap-4 p-4 text-xs font-mono overflow-hidden opacity-70"
          style={{ y: backgroundY }}
        >
          {codeSnippets.map((snippet, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 0.7, x: 0 }}
              transition={{ delay: index * 0.2, duration: 1 }}
              className="text-gray-600 whitespace-nowrap"
            >
              {snippet}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Mouse position follower bubbles */}
      <motion.div
        className="absolute w-40 h-40 rounded-full bg-blue-200/30 filter blur-xl pointer-events-none"
        animate={{
          x: mousePosition.x - 80,
          y: mousePosition.y - 80,
        }}
        transition={{ type: "spring", mass: 0.5, damping: 20 }}
      />
      <motion.div
        className="absolute w-24 h-24 rounded-full bg-emerald-300/20 filter blur-xl pointer-events-none"
        animate={{
          x: mousePosition.x - 40,
          y: mousePosition.y - 40,
        }}
        transition={{ type: "spring", mass: 1, damping: 15, delay: 0.1 }}
      />

      {/* Main Content Container */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 z-10 pt-16 md:pt-0">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 items-center">
          {/* Text Content */}
          <motion.div
            className="md:col-span-3 space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.p
              variants={itemVariants}
              className="text-blue-600 font-medium mb-2 flex items-center"
            >
              <Coffee className="inline-block mr-2 h-5 w-5" />
              Hello, I'm
            </motion.p>
            
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 font-['Space_Grotesk'] leading-tight"
            >
              Satyajit Halder
            </motion.h1>
            
            <motion.div
              variants={itemVariants}
              className="relative"
            >
              <p className="text-xl md:text-2xl text-gray-600 font-['Space_Grotesk'] relative z-10">
                Turning Coffee into Code, and Ideas into Reality
              </p>
              <motion.div 
                className="absolute bottom-0 left-0 h-3 bg-yellow-200/70 w-full -z-0 rounded"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 1.2, duration: 0.8 }}
              />
            </motion.div>
            
            <motion.p
              variants={itemVariants}
              className="text-gray-500 max-w-xl"
            >
              IT student and tech enthusiast with a passion for coding, gaming,
              and creative exploration. I bring imagination to life through
              technology.
            </motion.p>
            
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-4"
            >
              <a
                href="#projects"
                className="group px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center"
              >
                View My Projects
                <motion.span 
                  className="inline-block ml-2"
                  initial={{ x: 0 }}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  →
                </motion.span>
              </a>
              <a
                href="#contact"
                className="relative overflow-hidden px-6 py-3 bg-white border border-gray-200 hover:border-blue-600 text-gray-800 hover:text-blue-600 rounded-lg shadow-sm hover:shadow-md transition-all"
              >
                <motion.span 
                  className="absolute inset-0 bg-blue-50"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ type: "tween", duration: 0.3 }}
                />
                <span className="relative z-10">Get In Touch</span>
              </a>
            </motion.div>
          </motion.div>

          {/* Profile Image + Floating Elements */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="md:col-span-2 flex justify-center md:justify-end relative"
          >
            <motion.div 
              className="relative w-64 h-64 md:w-80 md:h-80"
              style={{ y: useTransform(scrollY, [0, 300], [0, -50]) }}
            >
              {/* Profile background with animation */}
              <motion.div
                animate={{ 
                  rotate: [0, 5, 0, -5, 0], 
                  scale: [1, 1.05, 1, 1.05, 1] 
                }}
                transition={{ 
                  duration: 20, 
                  repeat: Infinity,
                  repeatType: "loop" 
                }}
              >
                <img src={ProfileBgSVG} alt="" className="w-full h-full" />
              </motion.div>
              
              {/* Profile image */}
              <img 
                src={ProfileSVG} 
                alt="Satyajit Halder" 
                className="absolute inset-0 w-full h-full"
              />
              
              {/* Floating technology symbols */}
              <motion.div
                variants={floatingVariants}
                animate="animate"
                className="absolute -top-2 -right-2 w-14 h-14 bg-pink-500 rounded-full flex items-center justify-center text-white shadow-lg"
              >
                <Code className="h-7 w-7" />
              </motion.div>
              
              <motion.div
                variants={floatingVariants}
                animate="animate"
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "loop",
                  delay: 1,
                }}
                className="absolute -bottom-2 -left-2 w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg z-20"
              >
                <Coffee className="h-6 w-6" />
              </motion.div>
              
              <motion.div
                variants={floatingVariants}
                animate="animate"
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  repeatType: "loop",
                  delay: 2,
                }}
                className="absolute top-1/4 -left-6 w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center text-white shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Scroll down indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.7 }}
        >
          <p className="text-sm text-gray-500 mb-2">Scroll to explore</p>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              repeatType: "loop" 
            }}
          >
            <Mouse className="h-6 w-6 text-blue-600" />
          </motion.div>
        </motion.div>
      </div>

      {/* Background animated elements */}
      <div className="absolute top-1/3 left-10 w-40 h-40 bg-blue-200/30 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-1/4 right-10 w-60 h-60 bg-emerald-500/20 rounded-full filter blur-3xl"></div>
      <div className="absolute top-2/3 left-1/4 w-32 h-32 bg-pink-200/30 rounded-full filter blur-2xl"></div>
      
      {/* Angled gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/40 via-transparent to-emerald-50/30 pointer-events-none"></div>
    </section>
  );
};

export default Hero;
