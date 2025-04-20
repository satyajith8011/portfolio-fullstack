import { contactInfo } from "@/lib/constants";
import { Github, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  const getSocialIcon = (iconName: string) => {
    switch (iconName) {
      case "Linkedin":
        return <Linkedin size={18} />;
      case "Instagram":
        return <Instagram size={18} />;
      case "Github":
        return <Github size={18} />;
      default:
        return null;
    }
  };

  return (
    <footer className="py-12 bg-gray-900 text-white">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <a href="#home" className="font-['Space_Grotesk'] text-xl font-bold">
              <span className="text-white">Satyajit</span>
              <span className="text-blue-400">Halder</span>
            </a>
            <p className="text-gray-400 mt-2">
              Turning ideas into reality through code.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            <a
              href="#home"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Home
            </a>
            <a
              href="#bio"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Biography
            </a>
            <a
              href="#about"
              className="text-gray-400 hover:text-white transition-colors"
            >
              About Me
            </a>
            <a
              href="#projects"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Projects
            </a>
            <a
              href="#blog"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Blog
            </a>
            <a
              href="#contact"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Contact
            </a>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Satyajit Halder. All Rights Reserved.
          </p>

          <div className="flex space-x-4">
            {contactInfo.socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label={link.platform}
              >
                {getSocialIcon(link.icon)}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
