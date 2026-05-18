import { motion } from 'framer-motion';
import {
  SiReact, SiTypescript, SiTailwindcss, SiVite,
  SiNodedotjs, SiExpress, SiCloudflare, SiMongodb,
  SiPython, SiOpenai, SiHuggingface, SiTensorflow,
  SiGit, SiGithub, SiLinux, SiPostman,
} from 'react-icons/si';

const groups = [
  {
    label: 'frontend',
    items: [
      { name: 'React', Icon: SiReact, color: '#61DAFB' },
      { name: 'TypeScript', Icon: SiTypescript, color: '#3178C6' },
      { name: 'Tailwind', Icon: SiTailwindcss, color: '#38BDF8' },
      { name: 'Vite', Icon: SiVite, color: '#BD34FE' },
    ],
  },
  {
    label: 'backend',
    items: [
      { name: 'Node.js', Icon: SiNodedotjs, color: '#5FA04E' },
      { name: 'Express', Icon: SiExpress, color: '#FFFFFF' },
      { name: 'Cloudflare', Icon: SiCloudflare, color: '#F38020' },
      { name: 'MongoDB', Icon: SiMongodb, color: '#47A248' },
    ],
  },
  {
    label: 'intelligence',
    items: [
      { name: 'Python', Icon: SiPython, color: '#3776AB' },
      { name: 'OpenAI', Icon: SiOpenai, color: '#FFFFFF' },
      { name: 'Hugging Face', Icon: SiHuggingface, color: '#FFD21E' },
      { name: 'TensorFlow', Icon: SiTensorflow, color: '#FF6F00' },
    ],
  },
  {
    label: 'tools',
    items: [
      { name: 'Git', Icon: SiGit, color: '#F05032' },
      { name: 'GitHub', Icon: SiGithub, color: '#FFFFFF' },
      { name: 'Linux', Icon: SiLinux, color: '#FFFFFF' },
      { name: 'Postman', Icon: SiPostman, color: '#FF6C37' },
    ],
  },
];

const SectionLabel = ({ children, num }) => (
  <div className="flex items-center gap-4 mb-12">
    <span className="text-accent text-sm tracking-wider">{num}</span>
    <h2 className="text-2xl md:text-3xl font-mono text-white">{children}</h2>
    <div className="flex-1 h-px bg-border" />
  </div>
);

const Stack = () => {
  return (
    <section id="stack" className="relative px-6 md:px-12 py-24 border-t border-border bg-bg">
      <div className="max-w-6xl mx-auto">
        <SectionLabel num="02 //">stack.config</SectionLabel>

        <div className="space-y-10">
          {groups.map((group, gIdx) => (
            <motion.div
              key={group.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: gIdx * 0.05 }}
            >
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-accent text-[12px]">{`>`}</span>
                <span className="text-white/70 text-[13px] tracking-wide">{group.label}</span>
                <span className="text-white/20 text-[12px]">
                  [ {group.items.length.toString().padStart(2, '0')} ]
                </span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <div className="flex flex-wrap gap-2">
                {group.items.map(({ name, Icon, color }) => (
                  <div
                    key={name}
                    className="group inline-flex items-center gap-2 px-3 py-1.5 border border-border bg-surface hover:bg-surface2 hover:border-borderHover transition-colors"
                  >
                    <Icon size={13} style={{ color }} className="shrink-0" />
                    <span className="text-[12.5px] text-white/85 whitespace-nowrap">{name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stack;
