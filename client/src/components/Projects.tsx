import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import { projects } from "@/lib/constants";
import { ArrowRight } from "lucide-react";

const Projects = () => {
  const controls = useAnimation();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
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
        delay: custom * 0.2,
      },
    }),
  };

  return (
    <section id="projects" className="py-16 md:py-24 bg-gray-50" ref={sectionRef}>
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          variants={sectionVariants}
          initial="hidden"
          animate={controls}
        >
          <h2 className="text-3xl md:text-4xl font-bold font-['Space_Grotesk'] text-gray-900 mb-4">
            Projects & Achievements
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Explore some of the projects I've worked on, showcasing my skills and
            passion for innovation.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              className="project-card group relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              variants={itemVariants}
              initial="hidden"
              animate={controls}
              custom={index}
            >
              <div className="aspect-video bg-gray-200 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-r from-gray-100 to-gray-300"></div>
              </div>
              <div className="p-6 bg-white">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {project.shortTitle}
                  </h3>
                  <span
                    className={`text-xs font-medium px-2 py-1 ${
                      project.badgeColor === "primary"
                        ? "bg-blue-100 text-blue-700"
                        : project.badgeColor === "secondary"
                        ? "bg-emerald-500/20 text-emerald-500"
                        : "bg-pink-500/20 text-pink-500"
                    } rounded-full`}
                  >
                    {project.badgeText}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <a
                  href={project.link}
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
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

        <motion.div
          className="mt-12 text-center"
          variants={sectionVariants}
          initial="hidden"
          animate={controls}
        >
          <a
            href="/projects"
            className="inline-flex items-center px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            View All Projects
            <ArrowRight className="h-5 w-5 ml-2" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
