import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NavBar from "@/components/NavBar";
import NewHero from "@/components/NewHero";
import Biography from "@/components/Biography";
import AboutMe from "@/components/AboutMe";
import Projects from "@/components/Projects";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Skills from "@/components/Skills";
import Achievements from "@/components/Achievements";
import CurrentProjects from "@/components/CurrentProjects";
import Testimonials from "@/components/Testimonials";

const HomePage = () => {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Cursor follow effect
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener("mousemove", updateMousePosition);
    
    // Handle initial page load animation
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    
    // Intersection Observer for section animations
    const sections = document.querySelectorAll(".section-fade");
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, {
      threshold: 0.1
    });
    
    sections.forEach(section => {
      observer.observe(section);
    });
    
    // Scroll progress indicator
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setScrollProgress(scrollPercent);
    };
    
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("scroll", handleScroll);
      sections.forEach(section => {
        observer.unobserve(section);
      });
      clearTimeout(timer);
    };
  }, []);

  // Initial page load animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    enter: { 
      opacity: 1,
      transition: { 
        duration: 0.6, 
        ease: "easeInOut" 
      }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        className="min-h-screen relative"
        initial="initial"
        animate="enter"
        exit="exit"
        variants={pageVariants}
      >
        {/* Cursor follower */}
        <motion.div
          className="cursor-follow"
          animate={{
            x: mousePosition.x,
            y: mousePosition.y,
            scale: 1,
          }}
          transition={{
            type: "spring",
            damping: 20,
            mass: 0.2
          }}
        />
        
        {/* Scroll progress indicator */}
        <motion.div 
          className="fixed top-0 left-0 right-0 h-1 bg-blue-500 z-50"
          style={{ 
            scaleX: scrollProgress / 100,
            transformOrigin: "0% 50%"
          }}
        />
        
        <NavBar />
        <main>
          <NewHero />
          <Biography />
          <AboutMe />
          <Skills />
          <Projects />
          <CurrentProjects />
          <Achievements />
          <Testimonials />
          <Blog />
          <Contact />
        </main>
        <Footer />
      </motion.div>
    </AnimatePresence>
  );
};

export default HomePage;
