import { motion } from 'framer-motion';
import AiChat from './AiChat';

const SectionLabel = ({ children, num }) => (
  <div className="flex items-center gap-4 mb-12">
    <span className="text-accent text-sm tracking-wider">{num}</span>
    <h2 className="text-2xl md:text-3xl font-mono text-white">{children}</h2>
    <div className="flex-1 h-px bg-border" />
  </div>
);

const AskSection = () => {
  return (
    <section id="ask" className="relative px-6 md:px-12 py-24 border-t border-border">
      <div className="max-w-3xl mx-auto">
        <SectionLabel num="05 //">ask.ai</SectionLabel>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.45 }}
          className="text-white/60 text-sm mb-6 max-w-xl"
        >
          <span className="text-white/40">{'>'}</span> An AI assistant that knows my work, running
          on Cloudflare Workers AI. Ask it anything about my projects, stack, or background — or hit{' '}
          <kbd className="px-1 py-0.5 text-[11px] border border-border bg-surface">⌃K</kbd> from
          anywhere.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.45, delay: 0.08 }}
        >
          <AiChat variant="section" />
        </motion.div>
      </div>
    </section>
  );
};

export default AskSection;
