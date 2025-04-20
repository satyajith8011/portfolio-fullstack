import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import { blogPosts } from "@/lib/constants";
import { ArrowRight, ArrowLeft, Search } from "lucide-react";
import { Link } from "wouter";

const AllBlogPosts = () => {
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

  // Create expanded blog posts list (for demonstration - in a real app this would be fetched from an API)
  const allBlogPosts = [...blogPosts, ...blogPosts, ...blogPosts].map((post, index) => {
    // Adjust titles to make them appear as different posts for the demo
    const suffix = index >= blogPosts.length * 2 ? " (Part 3)" : 
                   index >= blogPosts.length ? " (Part 2)" : "";
    return {
      ...post,
      id: index + 1,
      title: post.title + suffix,
      date: index % 3 === 0 ? "May 15, 2025" : 
            index % 3 === 1 ? "Apr 30, 2025" : "Apr 12, 2025"
    };
  });

  // Get unique categories for the filter
  const categoriesSet = new Set(allBlogPosts.map(post => post.category));
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
            Blog
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Thoughts, tutorials, and insights on technology, gaming, and creative pursuits.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          className="mb-10"
          variants={sectionVariants}
          initial="hidden"
          animate={controls}
        >
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
            <div className="relative flex-grow max-w-md">
              <input 
                type="text" 
                placeholder="Search blog posts..." 
                className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <div className="flex flex-wrap gap-2">
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
            </div>
          </div>
        </motion.div>

        {/* Featured post */}
        <motion.div
          className="mb-12"
          variants={sectionVariants}
          initial="hidden"
          animate={controls}
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="bg-gray-200 dark:bg-gray-700 min-h-[300px]">
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-300 dark:from-blue-900/40 dark:to-blue-700/40"></div>
              </div>
              <div className="p-8 flex flex-col justify-center">
                <div className="flex items-center mb-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Featured Post • April 20, 2025</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  The Future of Web Development: AI-Assisted Coding
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Exploring how artificial intelligence is transforming the way we build websites and applications, making development more accessible and efficient than ever before.
                </p>
                <a
                  href="#"
                  className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                >
                  Read Full Article
                  <ArrowRight className="h-4 w-4 ml-1" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Blog post grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allBlogPosts.map((post, index) => (
            <motion.div
              key={post.id}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              variants={itemVariants}
              initial="hidden"
              animate={controls}
              custom={index % 6} // Stagger effect in groups of 6
            >
              <div className="aspect-video bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-r from-gray-100 to-gray-300 dark:from-gray-600 dark:to-gray-800"></div>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{post.date}</span>
                  <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
                  <span
                    className={`text-xs px-2 py-1 ${
                      post.categoryColor === "primary"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                        : post.categoryColor === "secondary"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                        : "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300"
                    } rounded-full`}
                  >
                    {post.category}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  {post.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{post.description}</p>
                <a
                  href={post.link}
                  className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm"
                >
                  Read More
                  <ArrowRight className="h-4 w-4 ml-1" />
                </a>
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
            <button className="px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">5</button>
            <button className="p-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400">
              <ArrowRight className="h-5 w-5" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default AllBlogPosts;