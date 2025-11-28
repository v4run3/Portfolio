import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaExternalLinkAlt } from 'react-icons/fa';

const About = () => {
  const education = [
    {
      school: "K. J. Somaiya College of Engineering",
      degree: "Master's degree in Computer Engineering",
      year: "2025 - 2027"
    },
    {
      school: "Shah & Anchor Kutchhi Engineering College",
      degree: "Bachelor's degree in Electronics and Computer Science",
      year: "2021 - 2024"
    },
    {
      school: "Babasaheb Gawde Institute of Technology",
      degree: "Diploma in Computer Technology",
      year: "2018 - 2021"
    },   
    {
      school: "Army Public School",
      degree: "High School",
      year: "2007 - 2017"
    }
  ];

  const tags = ["Mumbai", "Web Development", "Python", "Artificial Intelligence", "Machine Learning", "Data Science","Natural Language Processing","Large Language Models"];

  return (
    <section id="about" className="min-h-screen flex items-center justify-center px-8 py-20 bg-[#191919]">
      <div className="max-w-6xl w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center mb-16"
        >
          <h2 className="text-5xl font-bold mr-8">About</h2>
          <div className="h-px bg-gray-700 flex-grow"></div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Image */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="rounded-3xl overflow-hidden aspect-[3/4] bg-gray-800">
              {/* Placeholder for user image - using a gray div for now or a placeholder image */}
              <img 
                src="https://placehold.co/400x500/333/999?text=Varun+Bhonslay" 
                alt="Varun Bhonslay" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </motion.div>

          {/* Right Column: Content */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2 space-y-8"
          >
            <div>
              <h3 className="text-2xl text-gray-400 font-light">Varun</h3>
              <h1 className="text-6xl font-bold mb-6">Bhonslay</h1>
              
              <div className="flex flex-wrap gap-3 mb-8">
                {tags.map((tag, index) => (
                  <span key={index} className="px-4 py-2 bg-[#222] rounded-full text-sm font-medium text-gray-300 flex items-center gap-2 border border-gray-800">
                    {index === 0 && <FaMapMarkerAlt size={12} />}
                    {tag}
                  </span>
                ))}
              </div>

              <p className="text-gray-400 leading-relaxed text-lg mb-8">
                First-year student of Masters in Computer Engineering at K. J. Somaiya College of Engineering. Passionate about Python and Artificial Intelligence, I create innovative applications and websites.
              </p>
            </div>

            <div>
              <h3 className="text-3xl font-bold mb-8">My Education</h3>
              <div className="space-y-8 relative border-l-2 border-gray-700 ml-3 pl-8 pb-4">
                {education.map((edu, index) => (
                  <div key={index} className="relative">
                    <span className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-white border-4 border-[#191919]"></span>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                      <h4 className="text-xl font-bold uppercase">{edu.school}</h4>
                      <span className="text-gray-500 text-sm italic mt-1 md:mt-0">{edu.year}</span>
                    </div>
                    <p className="text-gray-400">{edu.degree}</p>
                  </div>
                ))}
              </div>
            </div>

            <a 
              href="#" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors mt-4"
            >
              View my CV <FaExternalLinkAlt size={14} />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
