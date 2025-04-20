import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import { blogPosts } from "@/lib/constants";
import { ArrowRight } from "lucide-react";

const Blog = () => {
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
    <section id="blog" className="py-16 md:py-24" ref={sectionRef}>
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          variants={sectionVariants}
          initial="hidden"
          animate={controls}
        >
          <h2 className="text-3xl md:text-4xl font-bold font-['Space_Grotesk'] text-gray-900 mb-4">
            Blog
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Thoughts, tutorials, and insights on technology, gaming, and creative
            pursuits.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              variants={itemVariants}
              initial="hidden"
              animate={controls}
              custom={index}
            >
              <div className="aspect-video bg-gray-200 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-r from-gray-100 to-gray-300"></div>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <span className="text-xs text-gray-500">{post.date}</span>
                  <span className="mx-2 text-gray-300">•</span>
                  <span
                    className={`text-xs px-2 py-1 ${
                      post.categoryColor === "primary"
                        ? "bg-blue-100 text-blue-700"
                        : post.categoryColor === "secondary"
                        ? "bg-emerald-500/20 text-emerald-500"
                        : "bg-pink-500/20 text-pink-500"
                    } rounded-full`}
                  >
                    {post.category}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{post.description}</p>
                <a
                  href={post.link}
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  Read More
                  <ArrowRight className="h-4 w-4 ml-1" />
                </a>
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
            href="/blog"
            className="inline-flex items-center px-6 py-3 border border-gray-300 hover:border-blue-600 text-gray-800 hover:text-blue-600 rounded-lg transition-colors"
          >
            View All Posts
            <ArrowRight className="h-5 w-5 ml-2" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Blog;
