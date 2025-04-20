import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import { contactInfo } from "@/lib/constants";
import { Mail, MapPin, Linkedin, Instagram, Github, Phone, ExternalLink } from "lucide-react";

const Contact = () => {
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

  const contactCardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 * i,
        duration: 0.5,
      },
    }),
  };

  const getSocialIcon = (iconName: string) => {
    switch (iconName) {
      case "Linkedin":
        return <Linkedin size={18} />;
      case "Instagram":
        return <Instagram size={18} />;
      case "Github":
        return <Github size={18} />;
      default:
        return null;
    }
  };

  return (
    <section
      id="contact"
      className="py-16 md:py-24 bg-gray-50 relative overflow-hidden"
      ref={sectionRef}
    >
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-100 rounded-full filter blur-3xl opacity-30 transform translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-emerald-500/20 rounded-full filter blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative">
        <motion.div
          className="text-center mb-16"
          variants={sectionVariants}
          initial="hidden"
          animate={controls}
        >
          <h2 className="text-3xl md:text-4xl font-bold font-['Space_Grotesk'] text-gray-900 mb-4">
            Get In Touch
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Have a question, want to collaborate, or just say hello? I'd love to
            hear from you through any of these channels.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Card - Email */}
            <motion.div
              custom={0}
              variants={contactCardVariants}
              initial="hidden"
              animate={controls}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
                  <Mail size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Email</h3>
              </div>
              <p className="text-gray-500 mb-4">Feel free to email me about anything. I'll respond as soon as I can.</p>
              <a
                href={`mailto:${contactInfo.email}`}
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                {contactInfo.email}
                <ExternalLink size={16} className="ml-2" />
              </a>
            </motion.div>

            {/* Contact Card - Phone */}
            <motion.div
              custom={1}
              variants={contactCardVariants}
              initial="hidden"
              animate={controls}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 mr-4">
                  <Phone size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Phone</h3>
              </div>
              <p className="text-gray-500 mb-4">For urgent matters, you can reach me directly on my phone.</p>
              <a
                href={`tel:${contactInfo.phone}`}
                className="inline-flex items-center text-pink-600 hover:text-pink-800 font-medium"
              >
                {contactInfo.phone}
                <ExternalLink size={16} className="ml-2" />
              </a>
            </motion.div>

            {/* Contact Card - Location */}
            <motion.div
              custom={2}
              variants={contactCardVariants}
              initial="hidden"
              animate={controls}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mr-4">
                  <MapPin size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Location</h3>
              </div>
              <p className="text-gray-500 mb-4">Based in {contactInfo.location}, but available for remote work worldwide.</p>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(contactInfo.location)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-emerald-600 hover:text-emerald-800 font-medium"
              >
                View on map
                <ExternalLink size={16} className="ml-2" />
              </a>
            </motion.div>

            {/* Contact Card - Social */}
            <motion.div
              custom={3}
              variants={contactCardVariants}
              initial="hidden"
              animate={controls}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-4">
                  <Linkedin size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Social Media</h3>
              </div>
              <p className="text-gray-500 mb-4">Connect with me on social platforms to see my latest updates.</p>
              <div className="flex space-x-3">
                {contactInfo.socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-indigo-600 hover:text-white transition-colors"
                    aria-label={link.platform}
                  >
                    {getSocialIcon(link.icon)}
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Call to action */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            animate={controls}
            className="mt-12 text-center"
          >
            <p className="text-gray-600 mb-6">
              Prefer to connect in a more personalized way? I'm always open to meeting for a coffee chat!
            </p>
            <a
              href={`mailto:${contactInfo.email}?subject=Let's%20Connect!`}
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1"
            >
              Let's Connect
              <Mail size={18} className="ml-2" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
