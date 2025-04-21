import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ArrowRight, Code, Coffee } from "lucide-react";
import ProfilePhoto from "../assets/img/profile-photo.jpg";

const NewHero = () => {
  // Animation variants
  const textVariants = {
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: (i: number) => ({ 
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 * i,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };
  
  const buttonVariants = {
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.6,
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.05,
      backgroundColor: "#3b82f6",
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };
  
  const imageVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.95
    },
    visible: { 
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.4,
        duration: 0.7,
        ease: "easeOut"
      }
    }
  };
  
  // Content arrays for cycling text
  const taglines = [
    "Transforming ideas into digital experiences",
    "Building solutions with heart and precision",
    "Crafting the future, one line of code at a time",
    "Where creativity meets technical excellence",
    "Turning complex problems into elegant solutions"
  ];
  
  const creativeTitles = [
    "Full Stack Developer",
    "Software Engineer",
    "Web Application Architect",
    "UI/UX Enthusiast",
    "Problem Solver"
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

  // Cursor blink animation
  const [cursorVisible, setCursorVisible] = useState(true);
  
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 530);
    
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <section className="w-full min-h-screen bg-slate-900 flex items-center relative overflow-hidden">
      {/* Content wrapper */}
      <div className="container mx-auto max-w-7xl flex flex-col lg:flex-row items-center justify-between relative z-10 px-4 md:px-8">
        
        {/* Text Column */}
        <div className="w-full lg:w-1/2 lg:pr-10 py-16 lg:py-20">
          {/* Greeting */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-4"
          >
            <motion.h3 
              custom={1}
              variants={textVariants}
              className="inline-block text-red-400 font-bold text-lg mb-3"
            >
              HELLO!
            </motion.h3>
          </motion.div>
          
          {/* Name and title */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-4"
          >
            <motion.h1 
              custom={2}
              variants={textVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight flex items-center"
            >
              I Am Satyajit Halder
              <span className={`h-12 w-0.5 bg-red-400 ml-1 inline-block ${cursorVisible ? 'opacity-100' : 'opacity-0'}`}></span>
            </motion.h1>
          </motion.div>
          
          {/* Description */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-8 max-w-lg"
          >
            <motion.p 
              custom={3}
              variants={textVariants}
              className="text-gray-300 text-base md:text-lg"
            >
              I'm a Web Developer with extensive experience for over 5 years. My expertise is to create and Websites design, graphic design and many more...
            </motion.p>
          </motion.div>
          
          {/* CTA Buttons */}
          <motion.div
            className="flex flex-wrap gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={buttonVariants}
          >
            <motion.a
              href="#projects"
              className="bg-red-400 hover:bg-red-500 text-white px-8 py-3 rounded-full font-medium inline-flex items-center gap-2 text-sm md:text-base transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              View Work
            </motion.a>
            
            <motion.a
              href="#contact"
              className="bg-red-400 hover:bg-red-500 text-white px-8 py-3 rounded-full font-medium inline-flex items-center gap-2 text-sm md:text-base transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              Hire Me
            </motion.a>
          </motion.div>
        </div>
        
        {/* Image Column - Taking full height of the right side */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={imageVariants}
          className="relative w-full lg:w-1/2 h-[500px] lg:h-screen flex items-center justify-center lg:justify-end overflow-hidden"
        >
          <img 
            src={ProfilePhoto} 
            alt="Satyajit Halder" 
            className="h-full w-full object-cover md:object-right-top"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default NewHero;