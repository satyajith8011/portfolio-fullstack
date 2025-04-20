import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { timelineItems } from "@/lib/constants";

const Biography = () => {
  const controls = useAnimation();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

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
    <section id="bio" className="py-16 md:py-24 bg-gray-50" ref={sectionRef}>
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          variants={sectionVariants}
          initial="hidden"
          animate={controls}
        >
          <h2 className="text-3xl md:text-4xl font-bold font-['Space_Grotesk'] text-gray-900 mb-4">
            My Journey
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Follow the path that has shaped who I am today - from student to tech
            enthusiast.
          </p>
        </motion.div>

        <div className="relative max-w-3xl mx-auto">
          <div className="timeline-line"></div>

          {timelineItems.map((item, index) => (
            <motion.div
              key={index}
              className="timeline-item relative pl-10 pb-12"
              variants={itemVariants}
              initial="hidden"
              animate={controls}
              custom={index}
            >
              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                <span
                  className={`inline-block px-3 py-1 rounded-full ${
                    item.badgeColor === "primary"
                      ? "bg-blue-100 text-blue-800"
                      : item.badgeColor === "secondary"
                      ? "bg-emerald-500/20 text-emerald-500"
                      : "bg-pink-500/20 text-pink-500"
                  } text-sm font-medium mb-3`}
                >
                  {item.year}
                </span>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Biography;
