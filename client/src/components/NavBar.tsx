import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

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
          ? "bg-white/90 backdrop-blur-sm shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <a href="#home" className="font-['Space_Grotesk'] text-xl font-bold text-primary-600">
            <span className="text-gray-900">Satyajit</span> Halder
          </a>

          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#home"
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              Home
            </a>
            <a
              href="#bio"
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              Biography
            </a>
            <a
              href="#about"
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              About Me
            </a>
            <a
              href="#projects"
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              Projects
            </a>
            <a
              href="#blog"
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              Blog
            </a>
            <a
              href="#contact"
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              Contact
            </a>
          </div>

          <button
            className="md:hidden focus:outline-none"
            onClick={toggleMobileMenu}
            aria-label="Menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-900" />
            ) : (
              <Menu className="h-6 w-6 text-gray-900" />
            )}
          </button>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white mt-4 py-2 rounded-lg shadow-md overflow-hidden"
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col space-y-3 px-4 py-2">
                <a
                  href="#home"
                  className="py-2 text-gray-600 hover:text-primary-600 transition-colors"
                  onClick={closeMobileMenu}
                >
                  Home
                </a>
                <a
                  href="#bio"
                  className="py-2 text-gray-600 hover:text-primary-600 transition-colors"
                  onClick={closeMobileMenu}
                >
                  Biography
                </a>
                <a
                  href="#about"
                  className="py-2 text-gray-600 hover:text-primary-600 transition-colors"
                  onClick={closeMobileMenu}
                >
                  About Me
                </a>
                <a
                  href="#projects"
                  className="py-2 text-gray-600 hover:text-primary-600 transition-colors"
                  onClick={closeMobileMenu}
                >
                  Projects
                </a>
                <a
                  href="#blog"
                  className="py-2 text-gray-600 hover:text-primary-600 transition-colors"
                  onClick={closeMobileMenu}
                >
                  Blog
                </a>
                <a
                  href="#contact"
                  className="py-2 text-gray-600 hover:text-primary-600 transition-colors"
                  onClick={closeMobileMenu}
                >
                  Contact
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
