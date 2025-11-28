import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';

import Navbar from './components/Navbar';

function App() {
  return (
    <div className="bg-primary text-secondary min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Projects />
      <Contact />
      
      <footer className="py-8 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Varun Bhonslay Portfolio. Built with MERN.
      </footer>
    </div>
  );
}

export default App;
