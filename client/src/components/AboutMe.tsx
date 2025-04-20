import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import { skillTags, interestCards } from "@/lib/constants";
import {
  Code,
  Lock,
  Monitor,
  Paintbrush,
  Zap,
  Gamepad2,
  Laptop,
  Utensils,
} from "lucide-react";

const AboutMe = () => {
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

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Code":
        return <Code className="h-4 w-4 mr-2" />;
      case "Lock":
        return <Lock className="h-4 w-4 mr-2" />;
      case "Monitor":
        return <Monitor className="h-4 w-4 mr-2" />;
      case "Paintbrush":
        return <Paintbrush className="h-4 w-4 mr-2" />;
      case "Zap":
        return <Zap className="h-4 w-4 mr-2" />;
      case "Gamepad2":
        return <Gamepad2 className="h-4 w-4 mr-2" />;
      case "Laptop":
        return <Laptop className="h-12 w-12 mb-4 mx-auto" />;
      case "Utensils":
        return <Utensils className="h-12 w-12 mb-4 mx-auto" />;
      default:
        return <Code className="h-4 w-4 mr-2" />;
    }
  };

  const getCardIcon = (iconName: string, colorClass: string) => {
    switch (iconName) {
      case "Laptop":
        return <Laptop className={`h-12 w-12 mb-4 mx-auto ${colorClass}`} />;
      case "Gamepad2":
        return <Gamepad2 className={`h-12 w-12 mb-4 mx-auto ${colorClass}`} />;
      case "Paintbrush":
        return <Paintbrush className={`h-12 w-12 mb-4 mx-auto ${colorClass}`} />;
      case "Utensils":
        return <Utensils className={`h-12 w-12 mb-4 mx-auto ${colorClass}`} />;
      default:
        return <Laptop className={`h-12 w-12 mb-4 mx-auto ${colorClass}`} />;
    }
  };

  return (
    <section id="about" className="py-16 md:py-24" ref={sectionRef}>
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            animate={controls}
            className="space-y-4"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-['Space_Grotesk'] text-gray-900 mb-6">
              About Me
            </h2>
            <p className="text-gray-600 mb-4">
              I'm Satyajit Halder — a passionate tech enthusiast, web developer, and lifelong learner with a background 
              that blends the precision of electronics with the innovation of code.
            </p>
            <p className="text-gray-600 mb-4">
              I began my journey with a Diploma in Electronics & Communication Engineering (ECE), 
              where I developed a solid understanding of circuits, systems, and signal processing. 
              That foundation sparked my curiosity for how hardware and software intertwine — and 
              soon led me deeper into the world of Information Technology, where I'm currently pursuing my degree.
            </p>
            <p className="text-gray-600 mb-4">
              Today, I specialize in full-stack web development with a strong focus on the MEAN stack, 
              while exploring advanced technologies like blockchain, cryptography, and decentralized applications. 
              My projects reflect a desire to make tech meaningful — from building a Blockchain-Based Identity 
              Verification System to working on a smart safety device for women that uses secure, real-time evidence capture.
            </p>
            <p className="text-gray-600 mb-8">
              Beyond development, I see tech as an artistic tool — one that blends logic with creativity. 
              I love designing intuitive user interfaces, exploring gamified learning, and turning everyday 
              ideas into digital experiences. When I'm not coding, you'll likely find me gaming, discovering 
              new food spots, or imagining my next big build.
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              {skillTags.map((skill, index) => (
                <div
                  key={index}
                  className={`skill-tag px-4 py-2 ${
                    skill.color === "primary"
                      ? "bg-blue-50 text-blue-700"
                      : skill.color === "secondary"
                      ? "bg-emerald-500/10 text-emerald-500"
                      : "bg-pink-500/10 text-pink-500"
                  } rounded-lg font-medium`}
                >
                  <span className="flex items-center">
                    {getIcon(skill.icon)}
                    {skill.name}
                  </span>
                </div>
              ))}
            </div>
            
            <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600">
              "Coffee-powered. Code-driven. Curiosity-led. Let's build something unforgettable."
            </blockquote>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 gap-6"
            variants={sectionVariants}
            initial="hidden"
            animate={controls}
          >
            {interestCards.map((card, index) => (
              <div
                key={index}
                className={`aspect-square ${
                  card.color === "primary"
                    ? "bg-gradient-to-br from-blue-100 to-blue-200"
                    : card.color === "secondary"
                    ? "bg-gradient-to-br from-emerald-500/10 to-emerald-500/30"
                    : "bg-gradient-to-br from-pink-500/10 to-pink-500/30"
                } rounded-2xl p-6 flex flex-col justify-end shadow-md hover:shadow-lg transition-shadow`}
              >
                <div className="text-center">
                  {getCardIcon(
                    card.icon,
                    card.color === "primary"
                      ? "text-blue-600"
                      : card.color === "secondary"
                      ? "text-emerald-500"
                      : "text-pink-500"
                  )}
                  <h3 className="font-semibold text-lg text-gray-900">
                    {card.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{card.description}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
