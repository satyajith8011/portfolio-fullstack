import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import { Code, Cpu, Lock, Radio, BarChart3, ArrowUpRight } from "lucide-react";

// Current projects data
const currentProjects = [
  {
    title: "AI-Powered Personal Assistant",
    description: "Developing a smart personal assistant with machine learning capabilities to help automate daily tasks and provide intelligent recommendations.",
    progress: 65,
    tags: ["AI", "Python", "Machine Learning", "NLP"],
    icon: <Cpu className="h-6 w-6 text-purple-500" />,
  },
  {
    title: "Blockchain Wallet Application",
    description: "Building a secure cryptocurrency wallet with enhanced security features and multi-chain support for decentralized applications.",
    progress: 40,
    tags: ["Blockchain", "React", "Solidity", "Web3"],
    icon: <Lock className="h-6 w-6 text-blue-500" />,
  },
  {
    title: "IoT Home Automation System",
    description: "Creating a comprehensive smart home solution that integrates various IoT devices for seamless home automation and energy efficiency.",
    progress: 25,
    tags: ["IoT", "Arduino", "Raspberry Pi", "MQTT"],
    icon: <Radio className="h-6 w-6 text-green-500" />,
  },
];

const CurrentProjects = () => {
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

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 * i,
        duration: 0.5,
      },
    }),
  };

  return (
    <section
      id="current-projects"
      className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900 relative overflow-hidden"
      ref={sectionRef}
    >
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-green-100 dark:bg-green-900/20 rounded-full filter blur-3xl opacity-30 transform translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-purple-100 dark:bg-purple-900/20 rounded-full filter blur-3xl opacity-30 transform -translate-x-1/4 translate-y-1/4"></div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative">
        <motion.div
          className="text-center mb-16"
          variants={sectionVariants}
          initial="hidden"
          animate={controls}
        >
          <h2 className="text-3xl md:text-4xl font-bold font-['Space_Grotesk'] text-gray-900 dark:text-gray-100 mb-4">
            Currently Working On
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Take a glimpse at the exciting projects I'm currently building. These represent my ongoing journey of exploration and creation.
          </p>
        </motion.div>

        <div className="space-y-12">
          {currentProjects.map((project, i) => (
            <motion.div
              key={project.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate={controls}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="md:flex gap-8">
                <div className="md:w-2/3">
                  <div className="flex items-center mb-4">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-3 mr-4">
                      {project.icon}
                    </div>
                    <h3 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-100">
                      {project.title}
                    </h3>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="md:w-1/3 mt-6 md:mt-0 flex flex-col justify-center">
                  <div className="w-full flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Progress
                    </span>
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      {project.progress}%
                    </span>
                  </div>
                  <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-blue-600 dark:bg-blue-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${project.progress}%` }}
                      transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                    ></motion.div>
                  </div>

                  <motion.button
                    className="mt-8 flex items-center justify-center w-full py-3 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg font-medium transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Project Details
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CurrentProjects;