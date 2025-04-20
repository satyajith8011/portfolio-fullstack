import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Download } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-sm"
          : "bg-transparent dark:bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <a href="#home" className="font-['Space_Grotesk'] text-xl font-bold text-primary-600 dark:text-primary-400">
            <span className="text-gray-900 dark:text-gray-100">Satyajit</span> <span className="dark:text-gray-300">Halder</span>
          </a>

          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#home"
              className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              Home
            </a>
            <a
              href="#bio"
              className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              Biography
            </a>
            <a
              href="#about"
              className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              About Me
            </a>
            <a
              href="#projects"
              className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              Projects
            </a>
            <a
              href="#blog"
              className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              Blog
            </a>
            <a
              href="#contact"
              className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              Contact
            </a>
          </div>

          <div className="flex items-center space-x-4">
            {/* Resume Download Button */}
            <motion.a
              href="/resume.pdf"
              download="Satyajit_Halder_Resume.pdf"
              className="hidden md:flex items-center text-sm px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download size={16} className="mr-2" />
              Resume
            </motion.a>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Mobile Menu Button */}
            <button
              className="md:hidden focus:outline-none"
              onClick={toggleMobileMenu}
              aria-label="Menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-900 dark:text-gray-100" />
              ) : (
                <Menu className="h-6 w-6 text-gray-900 dark:text-gray-100" />
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white dark:bg-gray-800 mt-4 py-2 rounded-lg shadow-md overflow-hidden"
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col space-y-3 px-4 py-2">
                <a
                  href="#home"
                  className="py-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  onClick={closeMobileMenu}
                >
                  Home
                </a>
                <a
                  href="#bio"
                  className="py-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  onClick={closeMobileMenu}
                >
                  Biography
                </a>
                <a
                  href="#about"
                  className="py-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  onClick={closeMobileMenu}
                >
                  About Me
                </a>
                <a
                  href="#projects"
                  className="py-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  onClick={closeMobileMenu}
                >
                  Projects
                </a>
                <a
                  href="#blog"
                  className="py-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  onClick={closeMobileMenu}
                >
                  Blog
                </a>
                <a
                  href="#contact"
                  className="py-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  onClick={closeMobileMenu}
                >
                  Contact
                </a>
                <a
                  href="/resume.pdf"
                  download="Satyajit_Halder_Resume.pdf"
                  className="flex items-center py-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                  onClick={closeMobileMenu}
                >
                  <Download size={16} className="mr-2" />
                  Download Resume
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default NavBar;
