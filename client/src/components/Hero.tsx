import { motion, useMotionValue, useTransform, useScroll, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import ProfileSVG from "../assets/profile.svg";
import ProfileBgSVG from "../assets/profile-bg.svg";
import ProfilePhoto from "../assets/img/profile-photo.jpg";
import { ArrowDown, Code, Coffee } from "lucide-react";

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
        ease: [0.6, 0.05, 0.01, 0.9],
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
  
  // Creative taglines that will rotate with animation
  const taglines = [
    "Turning Coffee into Code, and Ideas into Reality",
    "Crafting Digital Experiences That Matter",
    "Building the Future, One Line of Code at a Time",
    "Where Creativity Meets Technical Excellence",
    "Transforming Challenges into Opportunities"
  ];
  
  // Creative titles/roles that will rotate with name
  const creativeTitles = [
    "Full Stack Developer",
    "UI/UX Enthusiast",
    "Problem Solver",
    "Digital Craftsman",
    "Tech Explorer",
    "Code Artisan"
  ];
  
  // State to manage animation states
  const [currentTaglineIndex, setCurrentTaglineIndex] = useState(0);
  const [isTaglineAnimating, setIsTaglineAnimating] = useState(false);
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
  const [isTitleAnimating, setIsTitleAnimating] = useState(false);
  
  // Cycle through taglines with animation
  useEffect(() => {
    const taglineInterval = setInterval(() => {
      setIsTaglineAnimating(true);
      
      // Wait for exit animation, then change tagline
      setTimeout(() => {
        setCurrentTaglineIndex((prevIndex) => 
          prevIndex === taglines.length - 1 ? 0 : prevIndex + 1
        );
        
        // Start entrance animation
        setTimeout(() => {
          setIsTaglineAnimating(false);
        }, 300);
      }, 500);
      
    }, 5000); // Change every 5 seconds
    
    return () => clearInterval(taglineInterval);
  }, []);
  
  // Cycle through creative titles
  useEffect(() => {
    const titleInterval = setInterval(() => {
      setIsTitleAnimating(true);
      
      // Wait for exit animation, then change title
      setTimeout(() => {
        setCurrentTitleIndex((prevIndex) => 
          prevIndex === creativeTitles.length - 1 ? 0 : prevIndex + 1
        );
        
        // Start entrance animation
        setTimeout(() => {
          setIsTitleAnimating(false);
        }, 300);
      }, 500);
      
    }, 4000); // Change every 4 seconds (different from taglines for better visual effect)
    
    return () => clearInterval(titleInterval);
  }, []);

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
            
            <motion.div className="relative overflow-hidden">
              <motion.h1
                variants={itemVariants}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 font-['Space_Grotesk'] leading-tight"
              >
                <span className="inline-block">Satyajit</span>{" "}
                <span className="inline-block relative">
                  <span className="relative z-10 inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">Halder</span>
                  <motion.span 
                    className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 1, duration: 0.8 }}
                  />
                </span>
              </motion.h1>
              
              <div className="h-8 mt-2 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTitleIndex}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ 
                      y: isTitleAnimating ? -30 : 0, 
                      opacity: isTitleAnimating ? 0 : 1 
                    }}
                    exit={{ y: -30, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="text-lg md:text-xl text-blue-600 font-medium flex items-center"
                  >
                    <span className="text-blue-600 mr-2">〈</span>
                    {creativeTitles[currentTitleIndex].split('').map((letter, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 + 0.3 }}
                        className="inline-block relative"
                      >
                        {letter}
                      </motion.span>
                    ))}
                    <span className="text-blue-600 ml-2">〉</span>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
            
            <motion.p
              variants={itemVariants}
              className="text-sm italic text-gray-500 mt-1"
            >
              "Not a born genius — just someone who refused to stop learning." 🌱
            </motion.p>
            
            <motion.div
              variants={itemVariants}
              className="relative"
              style={{ minHeight: "2.5rem" }} // Keep height consistent during transitions
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTaglineIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: isTaglineAnimating ? 0 : 1, 
                    y: isTaglineAnimating ? -20 : 0,
                    transition: { 
                      duration: 0.5,
                      ease: "easeInOut"
                    }
                  }}
                  exit={{ opacity: 0, y: -20 }}
                  className="relative z-10"
                >
                  <p className="text-xl md:text-2xl text-gray-600 font-['Space_Grotesk'] tagline-highlight">
                    {taglines[currentTaglineIndex].split(' ').map((word, i) => (
                      <span 
                        key={i} 
                        className={i % 3 === 1 ? "shimmer-text text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500" : ""}
                        style={{ 
                          animationDelay: `${i * 0.1}s`,
                          display: 'inline-block',
                          marginRight: '0.3rem'
                        }}
                      >
                        {word}
                      </span>
                    ))}
                  </p>
                </motion.div>
              </AnimatePresence>
              
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
              and creative exploration. From average beginnings to ambitious dreams —
              I bring imagination to life through technology.
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
              {/* Creative photo container with advanced effects */}
              <motion.div
                animate={{ 
                  rotate: [0, 2, 0, -2, 0], 
                  scale: [1, 1.02, 1, 1.02, 1] 
                }}
                transition={{ 
                  duration: 8, 
                  repeat: Infinity,
                  repeatType: "loop" 
                }}
                className="photo-frame-outer w-full h-full relative"
              >
                {/* Modern code matrix background */}
                <div className="absolute inset-0 overflow-hidden opacity-10">
                  <svg
                    className="w-full h-full"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <pattern
                        id="tech-pattern"
                        patternUnits="userSpaceOnUse"
                        width="50"
                        height="50"
                        patternTransform="scale(0.75) rotate(0)"
                      >
                        <rect width="100%" height="100%" fill="transparent" />
                        <text x="10" y="10" fill="#3b82f6" fontSize="5">0 1</text>
                        <text x="25" y="15" fill="#8b5cf6" fontSize="4">{ }</text>
                        <text x="5" y="25" fill="#ec4899" fontSize="4">&lt;/&gt;</text>
                        <text x="35" y="30" fill="#3b82f6" fontSize="5">=&gt;</text>
                        <text x="20" y="40" fill="#8b5cf6" fontSize="4">$ _</text>
                        <text x="40" y="45" fill="#ec4899" fontSize="5">2 5</text>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#tech-pattern)" />
                  </svg>
                </div>
                
                {/* Main photo frame with shine effect */}
                <motion.div 
                  className="photo-frame-inner w-full h-full rounded-full border-4 border-white shadow-xl overflow-hidden bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500"
                  style={{ 
                    backgroundSize: "200% 200%",
                    animation: "gradient-animation 5s ease infinite"
                  }}
                >
                  {/* Profile image with mask filter */}
                  <img 
                    src={ProfilePhoto} 
                    alt="Satyajit Halder" 
                    className="w-full h-full object-cover rounded-full"
                    style={{ 
                      objectPosition: "center top",
                      filter: "saturate(1.15) contrast(1.1)"
                    }}
                  />
                  
                  {/* Modern digital scan effect */}
                  <motion.div 
                    className="absolute inset-0 rounded-full pointer-events-none overflow-hidden"
                  >
                    {/* Scanning line effect */}
                    <motion.div
                      className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400/0 via-blue-400/70 to-blue-400/0"
                      initial={{ y: -10 }}
                      animate={{ y: 200 }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "linear",
                        repeatType: "loop"
                      }}
                    />
                    
                    {/* Modern digital frame */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                      {/* Top left corner */}
                      <motion.path 
                        d="M 0,15 L 0,0 L 15,0" 
                        stroke="#3b82f6" 
                        strokeWidth="1.5"
                        fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1, delay: 0, repeat: Infinity, repeatDelay: 5 }}
                      />
                      
                      {/* Top right corner */}
                      <motion.path 
                        d="M 85,0 L 100,0 L 100,15" 
                        stroke="#8b5cf6" 
                        strokeWidth="1.5"
                        fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1, delay: 0.25, repeat: Infinity, repeatDelay: 5 }}
                      />
                      
                      {/* Bottom right corner */}
                      <motion.path 
                        d="M 100,85 L 100,100 L 85,100" 
                        stroke="#ec4899" 
                        strokeWidth="1.5"
                        fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1, delay: 0.5, repeat: Infinity, repeatDelay: 5 }}
                      />
                      
                      {/* Bottom left corner */}
                      <motion.path 
                        d="M 15,100 L 0,100 L 0,85" 
                        stroke="#3b82f6" 
                        strokeWidth="1.5"
                        fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1, delay: 0.75, repeat: Infinity, repeatDelay: 5 }}
                      />
                    </svg>
                    
                    {/* Subtle radial gradient */}
                    <div 
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(59,130,246,0.05) 70%, rgba(147,51,234,0.1) 100%)"
                      }}
                    />
                  </motion.div>
                </motion.div>
              </motion.div>
              
              {/* Modern tech skill badges */}
              <motion.div 
                className="absolute -top-2 -right-2 flex items-center justify-center"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg">
                    <Code className="h-7 w-7" />
                  </div>
                  <motion.div 
                    className="absolute inset-0 rounded-full border-2 border-white/30"
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                  />
                </div>
              </motion.div>
              
              <motion.div
                className="absolute -bottom-2 -left-2 flex items-center justify-center z-20"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white shadow-lg">
                    <Coffee className="h-6 w-6" />
                  </div>
                  <motion.div 
                    className="absolute inset-0 rounded-full border-2 border-white/30"
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ 
                      duration: 3.5, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      delay: 0.5
                    }}
                  />
                </div>
              </motion.div>
              
              <motion.div
                className="absolute top-1/4 -left-4 flex items-center justify-center"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </div>
                  <motion.div 
                    className="absolute inset-0 rounded-full border-2 border-white/30"
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      delay: 1
                    }}
                  />
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
        

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
