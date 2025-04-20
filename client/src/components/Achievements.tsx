import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import { Award, BookOpen, Trophy, Star } from "lucide-react";

// Achievement data
const achievements = [
  {
    icon: <Trophy className="h-6 w-6 text-yellow-600 dark:text-yellow-500" />,
    title: "Blockchain-Based Identity Verification System",
    description: "Developed an innovative blockchain solution for secure identity verification, reducing fraud by 30%.",
    year: "2023",
    type: "award",
  },
  {
    icon: <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-500" />,
    title: "Full-Stack Web Development",
    description: "Earned certification in modern web development technologies and best practices.",
    year: "2022",
    type: "certification",
  },
  {
    icon: <Award className="h-6 w-6 text-purple-600 dark:text-purple-500" />,
    title: "Smart Safety Device",
    description: "Designed and developed a personal safety device with integrated GPS tracking and emergency alert system.",
    year: "2021",
    type: "project",
  },
  {
    icon: <Star className="h-6 w-6 text-orange-600 dark:text-orange-500" />,
    title: "Technical Problem-Solving Championship",
    description: "Placed in the top 5% in a regional competition for innovative technical solutions.",
    year: "2020",
    type: "award",
  },
];

const Achievements = () => {
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
      id="achievements"
      className="py-16 md:py-24 bg-white dark:bg-gray-800 relative overflow-hidden"
      ref={sectionRef}
    >
      <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-indigo-100 dark:bg-indigo-900/20 rounded-full filter blur-3xl opacity-30 transform -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-1/4 h-1/4 bg-emerald-100 dark:bg-emerald-900/20 rounded-full filter blur-3xl opacity-30 transform translate-x-1/3 translate-y-1/3"></div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative">
        <motion.div
          className="text-center mb-16"
          variants={sectionVariants}
          initial="hidden"
          animate={controls}
        >
          <h2 className="text-3xl md:text-4xl font-bold font-['Space_Grotesk'] text-gray-900 dark:text-gray-100 mb-4">
            Achievements & Certifications
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            A collection of my notable achievements, awards, and certifications from my professional journey.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {achievements.map((achievement, i) => (
            <motion.div
              key={achievement.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate={controls}
              className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border-l-4 border-blue-500"
            >
              <div className="flex items-start">
                <div className="bg-white dark:bg-gray-800 rounded-full p-3 shadow-md mr-4">
                  {achievement.icon}
                </div>
                <div>
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {achievement.title}
                    </h3>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded-full">
                      {achievement.year}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    {achievement.description}
                  </p>
                  <div className="mt-3">
                    <span className="inline-block text-xs font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full capitalize">
                      {achievement.type}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Achievements;