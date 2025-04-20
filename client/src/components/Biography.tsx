import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useRef } from "react";
import { timelineItems } from "@/lib/constants";
import ScrollReveal from "@/components/ui/scroll-reveal";
import { CalendarDays, GraduationCap, Code, Award, Briefcase } from "lucide-react";

const Biography = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeItem, setActiveItem] = useState<number | null>(null);
  
  // Parallax effect for background elements
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  
  // Function to get item icon based on title
  const getItemIcon = (title: string) => {
    if (title.includes("School") || title.includes("Education")) return <GraduationCap className="w-6 h-6" />;
    if (title.includes("Coding") || title.includes("Project")) return <Code className="w-6 h-6" />;
    if (title.includes("Graduation")) return <Award className="w-6 h-6" />;
    if (title.includes("Tech") || title.includes("Start")) return <Briefcase className="w-6 h-6" />;
    return <CalendarDays className="w-6 h-6" />;
  };

  return (
    <section 
      id="bio" 
      className="py-16 md:py-24 bg-gray-50 relative overflow-hidden" 
      ref={sectionRef}
    >
      {/* Abstract background elements with parallax */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        style={{ y: backgroundY }}
      >
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-blue-200/20 filter blur-3xl" />
        <div className="absolute bottom-40 left-10 w-72 h-72 rounded-full bg-emerald-200/20 filter blur-3xl" />
      </motion.div>
      
      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <ScrollReveal className="text-center mb-16" threshold={0.1}>
          <h2 className="text-3xl md:text-4xl font-bold font-['Space_Grotesk'] text-gray-900 mb-4">
            My Journey
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            From Average Beginnings to Ambitious Dreams — Follow the path that has shaped my story.
          </p>
          <div className="mt-4 mx-auto max-w-2xl italic text-gray-600 text-sm">
            "Not a born genius — just someone who refused to stop learning." 🌱
          </div>
        </ScrollReveal>

        <div className="relative max-w-3xl mx-auto">
          {/* Timeline vertical line */}
          <div className="absolute left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-200 via-emerald-200 to-pink-200 rounded-full"></div>

          {timelineItems.map((item, index) => (
            <ScrollReveal 
              key={index}
              delay={index * 0.15}
              direction="left"
              distance={50}
              className="mb-12 last:mb-0"
              threshold={0.2}
            >
              <div 
                className="timeline-item relative pl-16"
                onMouseEnter={() => setActiveItem(index)}
                onMouseLeave={() => setActiveItem(null)}
              >
                {/* Timeline dot that pulses on hover */}
                <motion.div 
                  className={`absolute left-4 w-8 h-8 rounded-full z-10 flex items-center justify-center shadow-md
                    ${item.badgeColor === "primary"
                      ? "bg-blue-500 text-white" 
                      : item.badgeColor === "secondary"
                      ? "bg-emerald-500 text-white"
                      : "bg-pink-500 text-white"
                    }`}
                  style={{ 
                    translateX: "-50%", 
                    translateY: "0%"
                  }}
                  animate={activeItem === index ? {
                    scale: [1, 1.1, 1],
                    boxShadow: [
                      "0 0 0 0 rgba(59, 130, 246, 0.7)",
                      "0 0 0 10px rgba(59, 130, 246, 0)",
                    ],
                  } : {}}
                  transition={{
                    duration: 1.5,
                    repeat: activeItem === index ? Infinity : 0,
                    repeatType: "loop"
                  }}
                >
                  {getItemIcon(item.title)}
                </motion.div>
                
                {/* Content card */}
                <motion.div 
                  className="bg-white rounded-xl p-6 shadow-md transition-all duration-300 border border-gray-100 relative z-0"
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  }}
                  layout
                >
                  <div className="flex flex-col md:flex-row gap-3 md:items-center mb-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-center
                        ${item.badgeColor === "primary"
                          ? "bg-blue-100 text-blue-800"
                          : item.badgeColor === "secondary"
                          ? "bg-emerald-500/20 text-emerald-500"
                          : "bg-pink-500/20 text-pink-500"
                        } text-sm font-medium`}
                    >
                      {item.year}
                    </span>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {item.title}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600">
                    {item.description}
                  </p>
                  
                  {/* Decorative corner accent */}
                  <div 
                    className={`absolute -top-1 -right-1 w-8 h-8
                      ${item.badgeColor === "primary"
                        ? "bg-blue-100" 
                        : item.badgeColor === "secondary"
                        ? "bg-emerald-100"
                        : "bg-pink-100"
                      } opacity-60 rounded-bl-xl rounded-tr-xl z-[-1]`}
                  />
                </motion.div>
              </div>
            </ScrollReveal>
          ))}
        </div>
        
        {/* Timeline end marker */}
        <motion.div 
          className="mx-auto mt-8 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      </div>
    </section>
  );
};

export default Biography;
