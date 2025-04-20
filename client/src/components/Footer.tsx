import { contactInfo } from "@/lib/constants";
import { Github, Instagram, Linkedin, Code, ExternalLink, Mail, MapPin, Cpu, MousePointer } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Footer = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  
  // Track the position for the interactive gradient
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const footerElement = document.getElementById('creative-footer');
      if (footerElement) {
        const rect = footerElement.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setMousePosition({ x, y });
      }
    };

    const footerElement = document.getElementById('creative-footer');
    if (footerElement) {
      footerElement.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (footerElement) {
        footerElement.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  // Rotate through quotes with fade transition
  useEffect(() => {
    const quoteInterval = setInterval(() => {
      // Start fade out
      setFadeIn(false);
      
      // Wait for fade out then change quote
      setTimeout(() => {
        setCurrentQuoteIndex(prevIndex => 
          prevIndex === footerQuotes.length - 1 ? 0 : prevIndex + 1
        );
        // Trigger fade in
        setFadeIn(true);
      }, 1000); // Time to fade out
      
    }, 6000); // Time between quote changes (includes fade time)
    
    return () => clearInterval(quoteInterval);
  }, []);

  const getSocialIcon = (iconName: string) => {
    switch (iconName) {
      case "Linkedin":
        return <Linkedin size={20} />;
      case "Instagram":
        return <Instagram size={20} />;
      case "Github":
        return <Github size={20} />;
      default:
        return null;
    }
  };

  const footerQuotes = [
    "Code is poetry in motion.",
    "Creating digital experiences that inspire.",
    "Turning caffeine into code since 2015.",
    "Not a born genius — just someone who refused to stop learning."
  ];

  const currentQuote = footerQuotes[currentQuoteIndex];

  // Animation for the footer wave
  const waveVariants = {
    animate: {
      x: [0, -1000],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 20,
          ease: "linear",
        },
      },
    },
  };

  return (
    <footer 
      id="creative-footer"
      className="relative pt-16 pb-10 text-white overflow-hidden"
      style={{
        background: "linear-gradient(to bottom, #0f172a, #1e293b)",
      }}
    >
      {/* Decorative elements */}
      <div 
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.8) 0%, rgba(16, 185, 129, 0) 50%)`,
          pointerEvents: 'none'
        }}
      />
      
      <div className="absolute top-0 left-0 right-0 z-0">
        <motion.div
          className="w-[2000px] h-24"
          variants={waveVariants}
          animate="animate"
        >
          <svg viewBox="0 0 1000 100" className="w-full h-full fill-blue-500/10">
            <path d="M0,90 C150,50 350,150 500,80 C650,10 850,100 1000,60 L1000,0 L0,0 Z"></path>
          </svg>
        </motion.div>
      </div>

      <div className="absolute -bottom-8 opacity-40">
        <svg width="100%" height="100" viewBox="0 0 1000 100" preserveAspectRatio="none">
          <path 
            d="M0,0 C300,100 600,0 1000,80 L1000,100 L0,100 Z" 
            className="fill-blue-500/20"
          ></path>
        </svg>
      </div>

      {/* Binary code floating effect */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i} 
            className="absolute text-sm font-mono text-blue-400/50 binary-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${5 + Math.random() * 10}s`,
              animationDelay: `${Math.random() * 5}s`
            }}
          >
            {Math.random() > 0.5 ? '1' : '0'}
          </div>
        ))}
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6 lg:px-8">
        {/* Quote section */}
        <div className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="bg-gradient-to-r from-blue-500 to-purple-500 p-[1px] rounded-lg max-w-3xl mx-auto"
          >
            <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg p-6 min-h-[80px] flex items-center justify-center">
              <p 
                className={`text-lg md:text-xl italic text-gray-100 font-light transition-opacity duration-1000 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}
              >
                "{currentQuote}"
              </p>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo and tagline */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col"
          >
            <a href="#home" className="font-['Space_Grotesk'] text-2xl font-bold flex items-center">
              <Code className="mr-2 text-blue-400" />
              <span className="text-white">Satya</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">jit</span>
            </a>
            <p className="text-gray-400 mt-3 mb-5">Building the digital future, one line of code at a time.</p>
            
            {/* Contact info */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center text-gray-300">
                <Mail className="w-4 h-4 mr-2 text-blue-400" />
                <span>{contactInfo.email}</span>
              </div>
              <div className="flex items-center text-gray-300">
                <MapPin className="w-4 h-4 mr-2 text-blue-400" />
                <span>{contactInfo.location}</span>
              </div>
            </div>
          </motion.div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-2"
          >
            <h3 className="text-lg font-semibold mb-4 text-gray-100 border-b border-gray-700 pb-2">Navigation</h3>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4">
              <a href="#home" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center hover:translate-x-1 transform duration-200">
                <MousePointer className="w-3 h-3 mr-2 opacity-60" /> Home
              </a>
              <a href="#bio" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center hover:translate-x-1 transform duration-200">
                <MousePointer className="w-3 h-3 mr-2 opacity-60" /> Biography
              </a>
              <a href="#about" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center hover:translate-x-1 transform duration-200">
                <MousePointer className="w-3 h-3 mr-2 opacity-60" /> About Me
              </a>
              <a href="#skills" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center hover:translate-x-1 transform duration-200">
                <MousePointer className="w-3 h-3 mr-2 opacity-60" /> Skills
              </a>
              <a href="#projects" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center hover:translate-x-1 transform duration-200">
                <MousePointer className="w-3 h-3 mr-2 opacity-60" /> Projects
              </a>
              <a href="#blog" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center hover:translate-x-1 transform duration-200">
                <MousePointer className="w-3 h-3 mr-2 opacity-60" /> Blog
              </a>
              <a href="#achievements" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center hover:translate-x-1 transform duration-200">
                <MousePointer className="w-3 h-3 mr-2 opacity-60" /> Achievements
              </a>
              <a href="#contact" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center hover:translate-x-1 transform duration-200">
                <MousePointer className="w-3 h-3 mr-2 opacity-60" /> Contact
              </a>
            </div>
          </motion.div>

          {/* External pages and social links */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-4 text-gray-100 border-b border-gray-700 pb-2">All Pages</h3>
            <div className="grid grid-cols-1 gap-y-2 mb-6">
              <a href="/projects" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center group">
                <ExternalLink className="w-4 h-4 mr-2 opacity-60 group-hover:rotate-45 transform transition-transform duration-300" /> 
                All Projects
              </a>
              <a href="/blog" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center group">
                <ExternalLink className="w-4 h-4 mr-2 opacity-60 group-hover:rotate-45 transform transition-transform duration-300" /> 
                All Blog Posts
              </a>
              <a href="/achievements" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center group">
                <ExternalLink className="w-4 h-4 mr-2 opacity-60 group-hover:rotate-45 transform transition-transform duration-300" /> 
                All Achievements
              </a>
            </div>

            <h3 className="text-lg font-semibold mb-3 text-gray-100 border-b border-gray-700 pb-2">Connect</h3>
            <div className="flex flex-wrap gap-3">
              {contactInfo.socialLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.url}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={link.platform}
                  className="bg-gray-800 hover:bg-gray-700 p-2.5 rounded-full group transition-colors"
                >
                  <div className="text-gray-400 group-hover:text-blue-400 transition-colors">
                    {getSocialIcon(link.icon)}
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Tech stack icons */}
        <div className="border-t border-gray-800 pt-8 mt-12 text-center">
          <p className="text-gray-400 text-sm mb-4 flex items-center justify-center">
            <Cpu className="w-4 h-4 mr-2" />
            Built with modern technologies
          </p>
          <div className="flex justify-center flex-wrap gap-4 mb-8">
            <span className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-300">React</span>
            <span className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-300">TypeScript</span>
            <span className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-300">Tailwind CSS</span>
            <span className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-300">Framer Motion</span>
            <span className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-300">Vite</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-6 mt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} <span className="text-blue-400">Satyajit Halder</span>. All Rights Reserved.
          </p>
          <p className="text-gray-500 text-xs">
            Last updated: April 2025
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
