import { motion } from "framer-motion";
import ProfileSVG from "../assets/profile.svg";
import ProfileBgSVG from "../assets/profile-bg.svg";

const Hero = () => {
  return (
    <section
      id="home"
      className="pt-32 pb-20 md:pt-44 md:pb-32 gradient-bg overflow-hidden relative"
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 items-center">
          <div className="md:col-span-3 space-y-6">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-primary-600 font-medium mb-2"
            >
              Hello, I'm
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 font-['Space_Grotesk'] leading-tight"
            >
              Satyajit Halder
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-600 font-['Space_Grotesk']"
            >
              Turning Coffee into Code, and Ideas into Reality
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-gray-500 max-w-xl"
            >
              IT student and tech enthusiast with a passion for coding, gaming,
              and creative exploration. I bring imagination to life through
              technology.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <a
                href="#projects"
                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                View My Projects
              </a>
              <a
                href="#contact"
                className="px-6 py-3 bg-white border border-gray-200 hover:border-primary-600 text-gray-800 hover:text-primary-600 rounded-lg shadow-sm hover:shadow-md transition-all"
              >
                Get In Touch
              </a>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="md:col-span-2 flex justify-center md:justify-end"
          >
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              <img src={ProfileBgSVG} alt="" className="w-full h-full" />
              <img 
                src={ProfileSVG} 
                alt="Satyajit Halder" 
                className="absolute inset-0 w-full h-full"
              />
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
                className="absolute -top-2 -right-2 w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </motion.div>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "loop",
                  delay: 0.5,
                }}
                className="absolute -bottom-2 -left-2 w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background elements */}
      <div className="absolute top-1/3 left-10 w-20 h-20 bg-blue-200/30 rounded-full filter blur-xl"></div>
      <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-emerald-500/20 rounded-full filter blur-xl"></div>
    </section>
  );
};

export default Hero;
