const fetch = require('node-fetch');

// Your project data
const project = {
  title: "My Portfolio Project",
  description: "A cool MERN stack portfolio website with dark theme",
  image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
  link: "https://github.com/user/project",
  tags: ["React", "Node", "MongoDB", "Express"]
};

// Function to add project via API
async function addProject() {
  try {
    const response = await fetch('http://localhost:5000/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(project)
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Project added successfully!');
      console.log(data);
    } else {
      const error = await response.text();
      console.error('❌ Error adding project:', error);
    }
  } catch (err) {
    console.error('❌ Connection error:', err.message);
    console.log('\n⚠️  Make sure your server is running first!');
    console.log('Run: cd server && npm start');
  }
}

addProject();
