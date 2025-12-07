import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import axios from 'axios';

const Projects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Fetch projects from backend
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    axios.get(`${apiUrl}/api/projects`)
      .then(res => setProjects(res.data))
      .catch(err => console.error(err));
  }, []);

  const scrollRef = useRef(null);
  
  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === 'left' ? -400 : 400;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="projects" className="min-h-screen px-8 py-20 relative">
      <div className="max-w-6xl mx-auto relative group">
        <motion.h2 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold mb-12 border-b border-gray-700 pb-4"
        >
          Selected Works
        </motion.h2>
        
        {/* Left Button */}
        <button 
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-black/50 p-2 rounded-full text-white hover:bg-black/80 transition-all hidden md:block cursor-pointer"
          aria-label="Scroll left"
        >
          <FaChevronLeft size={24} />
        </button>

        {/* Right Button */}
        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-black/50 p-2 rounded-full text-white hover:bg-black/80 transition-all hidden md:block cursor-pointer"
          aria-label="Scroll right"
        >
          <FaChevronRight size={24} />
        </button>

        <div 
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory gap-8 pb-8 scrollbar-hide"
        >
          {projects.length > 0 ? projects.map((project) => (
            <motion.div 
              key={project._id}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="min-w-[85vw] md:min-w-[450px] bg-[#222] p-4 rounded-lg hover:bg-[#2a2a2a] transition-colors snap-center flex-shrink-0"
            >
              <img src={project.image} alt={project.title} className="w-full h-64 object-cover rounded-md mb-4" />
              <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
              <p className="text-gray-400 mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map(tag => (
                  <span key={tag} className="text-xs bg-gray-800 px-2 py-1 rounded">{tag}</span>
                ))}
              </div>
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-white underline hover:text-gray-300">View Project</a>
            </motion.div>
          )) : (
            <p className="text-gray-500">No projects found. (Make sure backend is running and DB is connected)</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Projects;
