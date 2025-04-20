import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import { ArrowRight, ArrowLeft, Award, Calendar, Download } from "lucide-react";
import { Link } from "wouter";

const AllAchievements = () => {
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

  // Sample achievements data
  const achievements = [
    {
      id: 1,
      title: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      date: "April 2023",
      category: "Cloud Computing",
      description: "Validated expertise in designing distributed systems on AWS, including deployment of applications and implementation of security controls.",
      credentialLink: "#",
      image: "aws-certified",
      badgeType: "professional"
    },
    {
      id: 2,
      title: "Google Associate Android Developer",
      issuer: "Google",
      date: "October 2022",
      category: "Mobile Development",
      description: "Demonstrated proficiency in fundamental components of Android development, including UI design, data storage, and testing.",
      credentialLink: "#",
      image: "google-certified",
      badgeType: "professional"
    },
    {
      id: 3,
      title: "1st Place - Hackathon for Social Good",
      issuer: "TechForChange Foundation",
      date: "March 2024",
      category: "Competition",
      description: "Led a team that developed an AI-powered application to help people with visual impairments navigate public transportation systems.",
      credentialLink: "#",
      image: "hackathon-winner",
      badgeType: "competition"
    },
    {
      id: 4,
      title: "Microsoft Certified: Azure Developer Associate",
      issuer: "Microsoft",
      date: "January 2023",
      category: "Cloud Computing",
      description: "Validated ability to design, build, test, and maintain cloud applications and services on Microsoft Azure.",
      credentialLink: "#",
      image: "azure-certified",
      badgeType: "professional"
    },
    {
      id: 5,
      title: "Full Stack Development Nanodegree",
      issuer: "Udacity",
      date: "July 2021",
      category: "Web Development",
      description: "Comprehensive program covering modern full stack development including SQL, API development, authentication, and deployment.",
      credentialLink: "#",
      image: "udacity-certified",
      badgeType: "education"
    },
    {
      id: 6,
      title: "Runner-up - National Coding Championship",
      issuer: "CodeNation",
      date: "November 2022",
      category: "Competition",
      description: "Achieved second place among 250+ contestants in a competitive programming contest focusing on algorithms and data structures.",
      credentialLink: "#",
      image: "coding-championship",
      badgeType: "competition"
    },
    {
      id: 7,
      title: "React Advanced Certification",
      issuer: "Frontend Masters",
      date: "February 2023",
      category: "Web Development",
      description: "Advanced certification covering React patterns, performance optimization, and state management implementations.",
      credentialLink: "#",
      image: "react-certification",
      badgeType: "professional"
    },
    {
      id: 8,
      title: "MongoDB Database Administrator",
      issuer: "MongoDB University",
      date: "May 2022",
      category: "Database",
      description: "Proven ability to administer MongoDB databases, including security, backup, performance tuning, and sharding.",
      credentialLink: "#",
      image: "mongodb-dba",
      badgeType: "professional"
    },
    {
      id: 9,
      title: "Best Technical Article Award",
      issuer: "Dev.to Community",
      date: "September 2023",
      category: "Technical Writing",
      description: "Recognized for outstanding technical content explaining complex microservice architecture patterns in an accessible way.",
      credentialLink: "#",
      image: "technical-writing",
      badgeType: "recognition"
    },
    {
      id: 10,
      title: "Certified Kubernetes Administrator",
      issuer: "Cloud Native Computing Foundation",
      date: "December 2023",
      category: "DevOps",
      description: "Validated expertise in Kubernetes installation, configuration, and management of production-grade clusters.",
      credentialLink: "#",
      image: "kubernetes-admin",
      badgeType: "professional"
    },
    {
      id: 11,
      title: "TensorFlow Developer Certificate",
      issuer: "Google",
      date: "April 2024",
      category: "AI & Machine Learning",
      description: "Demonstrated proficiency in using TensorFlow to solve deep learning and ML problems with real-world applications.",
      credentialLink: "#",
      image: "tensorflow-certified",
      badgeType: "professional"
    },
    {
      id: 12,
      title: "Open Source Contributor Recognition",
      issuer: "GitHub",
      date: "2023",
      category: "Open Source",
      description: "Recognized as a top contributor to open source projects, with significant contributions to popular JavaScript libraries.",
      credentialLink: "#",
      image: "github-recognition",
      badgeType: "recognition"
    }
  ];

  // Get unique categories for the filter
  const categoriesSet = new Set(achievements.map(item => item.category));
  const categories = Array.from(categoriesSet);

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50 dark:bg-gray-900" ref={sectionRef}>
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <Link href="/">
            <a className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium dark:text-blue-400 dark:hover:text-blue-300">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </a>
          </Link>
        </div>

        <motion.div
          className="text-center mb-10"
          variants={sectionVariants}
          initial="hidden"
          animate={controls}
        >
          <h1 className="text-4xl md:text-5xl font-bold font-['Space_Grotesk'] text-gray-900 dark:text-gray-100 mb-4">
            Achievements & Certifications
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            A collection of professional accomplishments, certificates, and recognitions throughout my career.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="mb-10 flex flex-wrap gap-3 justify-center"
          variants={sectionVariants}
          initial="hidden"
          animate={controls}
        >
          <button className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium">
            All
          </button>
          {categories.map(category => (
            <button 
              key={category}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm font-medium"
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Featured achievement */}
        <motion.div
          className="mb-12"
          variants={sectionVariants}
          initial="hidden"
          animate={controls}
        >
          <div className="bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl p-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 rounded-full p-6 h-28 w-28 flex items-center justify-center">
                  <Award className="h-16 w-16 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-grow text-center md:text-left">
                  <div className="inline-block px-3 py-1 mb-4 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                    Featured Achievement
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    TensorFlow Developer Certificate
                  </h2>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-4">
                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      April 2024
                    </div>
                    <div className="text-gray-500 dark:text-gray-400 text-sm">
                      Issued by: Google
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    This certification validates my ability to develop deep learning models using TensorFlow, demonstrating proficiency in building, training, and deploying machine learning solutions for complex problems.
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    <a
                      href="#"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      View Certificate
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </a>
                    <a
                      href="#"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 hover:border-blue-600 dark:hover:border-blue-500 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Achievement grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700"
              variants={itemVariants}
              initial="hidden"
              animate={controls}
              custom={index % 6} // Stagger effect in groups of 6
            >
              <div className={`h-2 ${
                achievement.badgeType === "professional" ? "bg-blue-500" :
                achievement.badgeType === "education" ? "bg-emerald-500" :
                achievement.badgeType === "competition" ? "bg-purple-500" :
                "bg-amber-500"
              }`}></div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    achievement.badgeType === "professional" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" :
                    achievement.badgeType === "education" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" :
                    achievement.badgeType === "competition" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300" :
                    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                  }`}>
                    {achievement.category}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {achievement.date}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {achievement.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">
                  Issued by: {achievement.issuer}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  {achievement.description}
                </p>
                <div className="flex gap-3">
                  <a
                    href={achievement.credentialLink}
                    className={`inline-flex items-center text-sm font-medium ${
                      achievement.badgeType === "professional" ? "text-blue-600 dark:text-blue-400" :
                      achievement.badgeType === "education" ? "text-emerald-600 dark:text-emerald-400" :
                      achievement.badgeType === "competition" ? "text-purple-600 dark:text-purple-400" :
                      "text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    View Credential
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </a>
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
            <span className="px-2 text-gray-500 dark:text-gray-400">...</span>
            <button className="p-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400">
              <ArrowRight className="h-5 w-5" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default AllAchievements;