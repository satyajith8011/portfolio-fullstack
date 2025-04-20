import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import { 
  Code, 
  Database, 
  Layers, 
  Cpu, 
  Server, 
  MessageSquare, 
  Lightbulb, 
  Users, 
  Briefcase
} from "lucide-react";

// Skills data organized by categories
const skillsData = {
  frontend: [
    { name: "HTML/CSS", level: 90 },
    { name: "JavaScript", level: 85 },
    { name: "React", level: 80 },
    { name: "TypeScript", level: 75 },
    { name: "UI/UX Design", level: 70 },
  ],
  backend: [
    { name: "Node.js", level: 75 },
    { name: "Express", level: 70 },
    { name: "API Development", level: 80 },
    { name: "Authentication", level: 75 },
  ],
  databases: [
    { name: "SQL", level: 65 },
    { name: "MongoDB", level: 60 },
    { name: "Database Design", level: 70 },
  ],
  tools: [
    { name: "Git", level: 85 },
    { name: "VS Code", level: 90 },
    { name: "Docker", level: 50 },
    { name: "CI/CD", level: 60 },
  ],
  softSkills: [
    { name: "Communication", level: 85 },
    { name: "Problem Solving", level: 90 },
    { name: "Teamwork", level: 85 },
    { name: "Time Management", level: 80 },
  ],
};

// Function to get appropriate icon for each category
const getCategoryIcon = (category: string) => {
  switch (category) {
    case "frontend":
      return <Code className="text-blue-500" />;
    case "backend":
      return <Server className="text-green-500" />;
    case "databases":
      return <Database className="text-purple-500" />;
    case "tools":
      return <Briefcase className="text-orange-500" />;
    case "softSkills":
      return <Users className="text-rose-500" />;
    default:
      return <Lightbulb className="text-yellow-500" />;
  }
};

// Function to format category name for display
const formatCategoryName = (category: string) => {
  switch (category) {
    case "frontend":
      return "Frontend";
    case "backend":
      return "Backend";
    case "databases":
      return "Databases";
    case "tools":
      return "Tools & Platforms";
    case "softSkills":
      return "Soft Skills";
    default:
      return category;
  }
};

const Skills = () => {
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
      id="skills"
      className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900 relative overflow-hidden"
      ref={sectionRef}
    >
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-100 dark:bg-blue-900/20 rounded-full filter blur-3xl opacity-30 transform translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-emerald-500/20 dark:bg-emerald-900/20 rounded-full filter blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative">
        <motion.div
          className="text-center mb-16"
          variants={sectionVariants}
          initial="hidden"
          animate={controls}
        >
          <h2 className="text-3xl md:text-4xl font-bold font-['Space_Grotesk'] text-gray-900 dark:text-gray-100 mb-4">
            My Skills
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            I've developed a diverse set of skills across various technologies and domains. 
            Here's a breakdown of my expertise and capabilities.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(skillsData).map(([category, skills], i) => (
            <motion.div
              key={category}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate={controls}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-4">
                  {getCategoryIcon(category)}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {formatCategoryName(category)}
                </h3>
              </div>

              <div className="space-y-4">
                {skills.map((skill) => (
                  <div key={skill.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 dark:text-gray-300 font-medium">
                        {skill.name}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {skill.level}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-blue-600 dark:bg-blue-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                      ></motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;