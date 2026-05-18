import { motion } from 'framer-motion';
import { FaReact, FaBrain, FaServer, FaArrowDown } from 'react-icons/fa';

const specialties = [
  { icon: FaReact, label: 'full_stack', sub: 'MERN · TypeScript' },
  { icon: FaBrain, label: 'ai_ml', sub: 'Python · LLMs · NLP' },
  { icon: FaServer, label: 'system_design', sub: 'Cloudflare · D1 · Edge' },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
});

const Hero = () => {
  return (
    <section
      id="profile"
      className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 pt-28 pb-20 overflow-hidden"
    >
      {/* dotted grid backdrop with radial fade */}
      <div
        className="absolute inset-0 bg-grid opacity-50 pointer-events-none"
        style={{
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
        }}
      />

      <div className="relative max-w-6xl mx-auto w-full">
        <motion.div {...fadeUp(0)} className="text-[12px] text-white/40 mb-6 flex items-center gap-2">
          <span className="text-accent">~/varun</span>
          <span className="text-white/30">$</span>
          <span>whoami</span>
        </motion.div>

        <motion.div
          {...fadeUp(0.05)}
          className="inline-flex items-center gap-2 px-3 py-1 mb-8 border border-accent/40 bg-accent/[0.06] text-accent text-[11px] tracking-wider"
        >
          <span className="relative flex w-1.5 h-1.5">
            <span className="absolute inline-flex w-full h-full rounded-full bg-accent opacity-60 animate-ping" />
            <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-accent" />
          </span>
          STATUS: open_to_work
        </motion.div>

        <motion.h1
          {...fadeUp(0.1)}
          className="font-mono font-bold leading-[0.95] tracking-tight text-white text-5xl sm:text-7xl md:text-8xl lg:text-9xl"
        >
          VARUN
          <br />
          <span className="text-white/90">BHONSLAY</span>
          <span className="text-accent">.</span>
        </motion.h1>

        <motion.div
          {...fadeUp(0.2)}
          className="mt-8 max-w-2xl text-white/70 text-base md:text-lg leading-relaxed"
        >
          <span className="text-white/40">{'>'}</span> Freelance developer building robust full-stack
          architectures and AI-powered apps. Based in Mumbai, shipping at the edge.
        </motion.div>

        <motion.div {...fadeUp(0.3)} className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl">
          {specialties.map(({ icon: Icon, label, sub }) => (
            <div
              key={label}
              className="card group p-4 flex items-center gap-3 cursor-default"
            >
              <div className="w-9 h-9 flex items-center justify-center border border-border bg-bg text-accent group-hover:border-accent/40 transition-colors">
                <Icon size={16} />
              </div>
              <div className="min-w-0">
                <div className="text-[13px] text-white">{label}</div>
                <div className="text-[11px] text-white/40 truncate">{sub}</div>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div {...fadeUp(0.45)} className="mt-16 flex items-center gap-4 text-[12px] text-white/30">
          <span className="h-px w-12 bg-white/20" />
          <span>scroll for more</span>
          <FaArrowDown className="animate-bounce" size={10} />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
