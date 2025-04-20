import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import { projects } from "@/lib/constants";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

const AllProjects = () => {
  const controls = useAnimation();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
    // Scroll to the top of the page on component mount
    window.scrollTo(0, 0);
  }, [controls, isInView]);

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: custom * 0.1,
      },
    }),
  };

  // Create expanded projects list (for demonstration - in real app this would be fetched from an API)
  const allProjects = [...projects, ...projects].map((project, index) => ({
    ...project,
    id: index + 1,
    // Adjust titles to make them unique for the demo
    title: index >= projects.length ? `${project.title} (Extended)` : project.title,
    shortTitle: index >= projects.length ? `${project.shortTitle} (Extended)` : project.shortTitle,
  }));

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50 dark:bg-gray-900" ref={sectionRef}>
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <Link href="/">
            <a className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </a>
          </Link>
        </div>

        <motion.div
          className="text-center mb-16"
          variants={sectionVariants}
          initial="hidden"
          animate={controls}
        >
          <h1 className="text-4xl md:text-5xl font-bold font-['Space_Grotesk'] text-gray-900 dark:text-gray-100 mb-4">
            All Projects
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            A comprehensive collection of my work, showcasing various skills, technologies, and problem-solving approaches.
          </p>
        </motion.div>

        {/* Filters (could be implemented in a real app) */}
        <motion.div
          className="mb-10 flex flex-wrap gap-3 justify-center"
          variants={sectionVariants}
          initial="hidden"
          animate={controls}
        >
          <button className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium">
            All
          </button>
          <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm font-medium">
            Web Development
          </button>
          <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm font-medium">
            Blockchain
          </button>
          <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm font-medium">
            IoT
          </button>
          <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm font-medium">
            UI/UX
          </button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allProjects.map((project, index) => (
            <motion.div
              key={project.id}
              className="project-card group relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              variants={itemVariants}
              initial="hidden"
              animate={controls}
              custom={index % 6} // Stagger effect in groups of 6
            >
              <div className="aspect-video bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-r from-gray-100 to-gray-300 dark:from-gray-600 dark:to-gray-800"></div>
              </div>
              <div className="p-6 bg-white dark:bg-gray-800">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {project.shortTitle}
                  </h3>
                  <span
                    className={`text-xs font-medium px-2 py-1 ${
                      project.badgeColor === "primary"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                        : project.badgeColor === "secondary"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                        : "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300"
                    } rounded-full`}
                  >
                    {project.badgeText}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <a
                  href={project.link}
                  className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm"
                >
                  View Project
                  <ArrowRight className="h-4 w-4 ml-1" />
                </a>
              </div>
              <div className="project-overlay absolute inset-0 bg-gradient-to-t from-gray-900/80 to-gray-900/20 opacity-0 transition-opacity duration-300 flex items-end">
                <div className="p-6 text-white">
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-white/80 mb-4">
                    {project.overlayDescription}
                  </p>
                  <button
                    className={`px-4 py-2 bg-white text-gray-900 rounded-lg ${
                      project.buttonColor === "primary"
                        ? "hover:bg-blue-500"
                        : project.buttonColor === "secondary"
                        ? "hover:bg-emerald-500"
                        : "hover:bg-pink-500"
                    } hover:text-white transition-colors`}
                  >
                    {project.buttonText}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-12">
          <nav className="flex items-center space-x-2">
            <button className="p-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button className="px-4 py-2 rounded-md bg-blue-600 text-white font-medium">1</button>
            <button className="px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">2</button>
            <button className="px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">3</button>
            <span className="px-2 text-gray-500 dark:text-gray-400">...</span>
            <button className="px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">8</button>
            <button className="p-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400">
              <ArrowRight className="h-5 w-5" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default AllProjects;