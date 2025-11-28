import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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

  return (
    <section id="projects" className="min-h-screen px-8 py-20">
      <div className="max-w-6xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold mb-12 border-b border-gray-700 pb-4"
        >
          Selected Works
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.length > 0 ? projects.map((project) => (
            <motion.div 
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-[#222] p-4 rounded-lg hover:bg-[#2a2a2a] transition-colors"
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
