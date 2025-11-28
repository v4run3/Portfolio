import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section id="hero" className="h-screen flex flex-col justify-center items-center text-center px-4">
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-6xl md:text-8xl font-bold mb-4"
      >
        Varun Bhonslay
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-xl md:text-2xl text-gray-400"
      >
        Freelance Developer
      </motion.p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-10 animate-bounce"
      >
        <span className="text-sm text-gray-500">Scroll Down</span>
      </motion.div>
    </section>
  );
};

export default Hero;
