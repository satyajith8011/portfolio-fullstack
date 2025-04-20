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
  
  // State to manage the current tagline and animation state
  const [currentTaglineIndex, setCurrentTaglineIndex] = useState(0);
  const [isTaglineAnimating, setIsTaglineAnimating] = useState(false);
  
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
                {/* Rainbow colored particles */}
                <div className="particles">
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="particle"
                      style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        backgroundColor: 
                          i % 5 === 0 ? "#3b82f6" : 
                          i % 5 === 1 ? "#8b5cf6" : 
                          i % 5 === 2 ? "#ec4899" : 
                          i % 5 === 3 ? "#f59e0b" : 
                          "#10b981",
                        animationDelay: `${Math.random() * 2}s`,
                        animationDuration: `${5 + Math.random() * 5}s`
                      }}
                    />
                  ))}
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
                  
                  {/* Overlay glow effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 via-transparent to-purple-500/20 rounded-full"
                    animate={{
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  />
                </motion.div>
              </motion.div>
              
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
