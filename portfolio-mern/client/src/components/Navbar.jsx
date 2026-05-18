import { useState, useEffect } from 'react';
import { Link } from 'react-scroll';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';

const links = [
  { num: '01', name: 'profile', to: 'profile' },
  { num: '02', name: 'stack', to: 'stack' },
  { num: '03', name: 'projects', to: 'projects' },
  { num: '04', name: 'contact', to: 'contact' },
];

const Navbar = ({ onOpenPalette }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-bg/80 backdrop-blur-md border-b border-border py-3'
          : 'bg-transparent py-5 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link
          to="profile"
          smooth={true}
          duration={500}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <span className="w-2 h-2 rounded-full bg-accent pulse-dot" />
          <span className="text-sm tracking-wider text-white/90 group-hover:text-accent transition-colors">
            varun.bhonslay<span className="text-accent">.dev</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-7">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.to}
              smooth={true}
              duration={500}
              spy={true}
              offset={-80}
              activeClass="text-accent"
              className="group flex items-baseline gap-1.5 cursor-pointer text-[13px] text-white/70 hover:text-white transition-colors"
            >
              <span className="text-white/30 group-hover:text-accent transition-colors">
                {link.num}/
              </span>
              <span>{link.name}</span>
            </Link>
          ))}
          <button
            type="button"
            onClick={onOpenPalette}
            className="ml-2 group inline-flex items-center gap-2 px-3 py-1.5 text-[12px] tracking-wider border border-accent text-accent hover:bg-accent hover:text-bg transition-colors cursor-pointer"
            aria-label="open command palette"
          >
            ./connect
            <kbd className="px-1 py-px text-[10px] border border-accent/40 group-hover:border-bg/40 text-accent/70 group-hover:text-bg/70 transition-colors">
              ⌃K
            </kbd>
          </button>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white/80 focus:outline-none"
          aria-label="toggle menu"
        >
          {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="absolute top-full left-0 w-full bg-bg border-t border-border md:hidden"
          >
            <div className="flex flex-col py-4 px-6 gap-3">
              {links.map((link) => (
                <Link
                  key={link.name}
                  to={link.to}
                  smooth={true}
                  duration={500}
                  onClick={() => setIsOpen(false)}
                  className="flex items-baseline gap-2 cursor-pointer text-base text-white/80"
                >
                  <span className="text-white/30">{link.num}/</span>
                  <span>{link.name}</span>
                </Link>
              ))}
              <button
                type="button"
                onClick={() => { setIsOpen(false); onOpenPalette?.(); }}
                className="self-start mt-2 px-3 py-1.5 text-sm border border-accent text-accent"
              >
                ./connect
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
