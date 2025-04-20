import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";

// Testimonial data
const testimonials = [
  {
    id: 1,
    content:
      "Satyajit's technical expertise and problem-solving abilities are exceptional. He tackled our most complex challenges with creative solutions that exceeded our expectations.",
    author: "Priya Sharma",
    position: "Senior Project Manager",
    company: "TechInnovate Solutions",
    avatar: "PS", // Using initials instead of avatar images
  },
  {
    id: 2,
    content:
      "Working with Satyajit was a game-changer for our blockchain project. His in-depth knowledge and dedication helped us deliver a robust solution on time and within budget.",
    author: "Rahul Kumar",
    position: "CTO",
    company: "BlockTech Enterprises",
    avatar: "RK",
  },
  {
    id: 3,
    content:
      "Satyajit has a rare combination of technical brilliance and excellent communication skills. He was able to translate complex technical concepts into ideas our entire team could understand.",
    author: "Meera Patel",
    position: "Product Owner",
    company: "Innov8 Digital",
    avatar: "MP",
  },
  {
    id: 4,
    content:
      "I've worked with many developers, but Satyajit stands out for his attention to detail and commitment to quality. He doesn't just write code; he crafts solutions with the end user in mind.",
    author: "Vikram Singh",
    position: "Lead Developer",
    company: "FutureTech Solutions",
    avatar: "VS",
  },
];

const Testimonials = () => {
  const controls = useAnimation();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const testimonialVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
      },
    },
    exit: {
      opacity: 0,
      x: -50,
      transition: {
        duration: 0.3,
      },
    },
  };

  const goPrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Generate random pastel color for avatar backgrounds
  const getAvatarColor = (initials: string) => {
    const colors = [
      "bg-blue-200 text-blue-700",
      "bg-green-200 text-green-700",
      "bg-purple-200 text-purple-700",
      "bg-yellow-200 text-yellow-700",
      "bg-pink-200 text-pink-700",
      "bg-indigo-200 text-indigo-700",
    ];
    
    // Use character code of the first letter to select a color
    const index = initials.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section
      id="testimonials"
      className="py-16 md:py-24 bg-white dark:bg-gray-800 relative overflow-hidden"
      ref={sectionRef}
    >
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-orange-100 dark:bg-orange-900/20 rounded-full filter blur-3xl opacity-30 transform translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-blue-100 dark:bg-blue-900/20 rounded-full filter blur-3xl opacity-30 transform -translate-x-1/3 translate-y-1/3"></div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative">
        <motion.div
          className="text-center mb-16"
          variants={sectionVariants}
          initial="hidden"
          animate={controls}
        >
          <h2 className="text-3xl md:text-4xl font-bold font-['Space_Grotesk'] text-gray-900 dark:text-gray-100 mb-4">
            What People Say
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Testimonials from colleagues and clients who have worked with me on various projects.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            key={currentTestimonial.id}
            variants={testimonialVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-8 md:p-10 shadow-lg relative"
          >
            <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-blue-500 dark:bg-blue-600 rounded-full p-3 shadow-md">
              <Quote className="h-6 w-6 text-white" />
            </div>
            
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-200 italic mb-8 leading-relaxed">
              "{currentTestimonial.content}"
            </p>
            
            <div className="flex items-center">
              <div className={`h-12 w-12 rounded-full ${getAvatarColor(currentTestimonial.avatar)} flex items-center justify-center text-lg font-semibold mr-4`}>
                {currentTestimonial.avatar}
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {currentTestimonial.author}
                </h4>
                <p className="text-gray-500 dark:text-gray-400">
                  {currentTestimonial.position}, {currentTestimonial.company}
                </p>
              </div>
            </div>
          </motion.div>

          <div className="flex justify-center mt-10 space-x-4">
            <motion.button
              onClick={goPrev}
              className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </motion.button>
            
            <div className="flex items-center space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2.5 rounded-full transition-all ${
                    currentIndex === index 
                      ? "w-8 bg-blue-500 dark:bg-blue-400" 
                      : "w-2.5 bg-gray-300 dark:bg-gray-600"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            
            <motion.button
              onClick={goNext}
              className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;