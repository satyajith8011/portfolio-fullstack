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
          >
            <h2 className="text-3xl md:text-4xl font-bold font-['Space_Grotesk'] text-gray-900 mb-6">
              About Me
            </h2>
            <p className="text-gray-600 mb-6">
              I'm a passionate IT student with a love for turning complex
              problems into elegant solutions. When I'm not coding, you'll find
              me gaming, exploring new technologies, or expressing my creativity
              through painting.
            </p>
            <p className="text-gray-600 mb-8">
              My approach combines technical expertise with creativity, allowing
              me to develop innovative solutions that are both functional and
              visually appealing. I believe in continuous learning and pushing
              boundaries to create meaningful experiences.
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
