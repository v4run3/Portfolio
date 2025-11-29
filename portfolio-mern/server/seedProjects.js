require('dotenv').config();
const mongoose = require('mongoose');
const Project = require('./models/Project');

// Sample projects to add
const sampleProjects = [
  {
    title: "Portfolio Website",
    description: "A modern MERN stack portfolio website with dark theme",
    image: "https://ik.imagekit.io/ytnwsw1tm/Screenshot%202025-11-29%20155453.png",
    link: "https://github.com/v4run3/Portfolio",
    tags: ["React", "Node.js", "MongoDB", "Express"]
  },
  {
    title: "Taskify - Task Management App",
    description: "A collaborative task management tool with real-time updates",
    image: "https://ik.imagekit.io/ytnwsw1tm/Pi7_Tool_Screenshot%202025-11-29%20150234(1).jpg",
    link: "https://github.com/v4run3/Taskify",
    tags: ["React", "Node.js", "MongoDB", "Express"]
  }
];

// Connect to MongoDB and seed projects
async function seedProjects() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Optional: Clear existing projects first
    // await Project.deleteMany({});
    // console.log('Existing projects cleared');

    // Add sample projects
    const projects = await Project.insertMany(sampleProjects);
    console.log(`${projects.length} projects added successfully!`);
    console.log(projects);

    process.exit(0);
  } catch (err) {
    console.error('Error seeding projects:', err);
    process.exit(1);
  }
}

seedProjects();
