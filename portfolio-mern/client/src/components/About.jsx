import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaDownload, FaGithub, FaLinkedin } from 'react-icons/fa';

const tags = [
  { label: 'Mumbai, IN', icon: FaMapMarkerAlt },
  { label: 'Web Development' },
  { label: 'Python' },
  { label: 'Artificial Intelligence' },
  { label: 'Machine Learning' },
  { label: 'Data Science' },
  { label: 'Natural Language Processing' },
  { label: 'Large Language Models' },
];

const education = [
  {
    school: "K. J. Somaiya College of Engineering",
    degree: "Master's, Computer Engineering",
    year: '2025 — 2027',
    current: true,
  },
  {
    school: 'Shah & Anchor Kutchhi Engineering College',
    degree: 'B.E., Electronics & Computer Science',
    year: '2021 — 2024',
  },
  {
    school: 'Babasaheb Gawde Institute of Technology',
    degree: 'Diploma, Computer Technology',
    year: '2018 — 2021',
  },
  {
    school: 'Army Public School',
    degree: 'High School',
    year: '2007 — 2017',
  },
];

const SectionLabel = ({ children, num }) => (
  <div className="flex items-center gap-4 mb-12">
    <span className="text-accent text-sm tracking-wider">{num}</span>
    <h2 className="text-2xl md:text-3xl font-mono text-white">{children}</h2>
    <div className="flex-1 h-px bg-border" />
  </div>
);

const About = () => {
  return (
    <section className="relative px-6 md:px-12 py-24 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <SectionLabel num="// about">about.me</SectionLabel>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Profile card — left */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <div className="card overflow-hidden">
              {/* window chrome */}
              <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-surface2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3a3a3a]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3a3a3a]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3a3a3a]" />
                </div>
                <span className="text-[11px] text-white/40">~/profile/varun.json</span>
                <span className="w-9" />
              </div>

              <div className="aspect-[4/5] bg-surface2 relative overflow-hidden">
                <img
                  src="https://placehold.co/600x750/181818/86efac?font=jetbrains+mono&text=VB"
                  alt="Varun Bhonslay"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                />
                {/* Bottom JSON overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                  <pre className="text-[11px] leading-relaxed text-white/80">
                    {`{
  "name":   "Varun Bhonslay",
  "role":   "Full-stack + AI",
  "lvl":    "Master's, year 1",
  "stack":  ["MERN","Python"]
}`}
                  </pre>
                </div>
              </div>

              <div className="flex border-t border-border">
                <a
                  href="https://github.com/v4run3"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 text-xs text-white/70 hover:text-accent hover:bg-surface2 transition-colors border-r border-border"
                >
                  <FaGithub size={14} /> github
                </a>
                <a
                  href="https://www.linkedin.com/in/varun-vinay-bhonslay/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 text-xs text-white/70 hover:text-accent hover:bg-surface2 transition-colors"
                >
                  <FaLinkedin size={14} /> linkedin
                </a>
              </div>
            </div>
          </motion.div>

          {/* Content — right */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-3 space-y-10"
          >
            <div>
              <div className="text-white/40 text-sm mb-2">{'// intro'}</div>
              <p className="text-white/80 text-base md:text-lg leading-relaxed">
                First-year Master&apos;s student in Computer Engineering at K. J. Somaiya, focused on
                Python and applied AI. I build full-stack apps end-to-end — from edge APIs to
                LLM-powered interfaces — and care about the small details that make software
                feel sharp.
              </p>
            </div>

            <div>
              <div className="text-white/40 text-sm mb-3">{'// interests'}</div>
              <div className="flex flex-wrap gap-2">
                {tags.map(({ label, icon: Icon }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[12px] border border-border bg-surface text-white/70 hover:border-accent/40 hover:text-white transition-colors"
                  >
                    {Icon && <Icon size={10} className="text-accent" />}
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="text-white/40 text-sm mb-4">{'// education'}</div>
              <div className="font-mono text-[13px] leading-relaxed">
                <div className="text-accent mb-2">education/</div>
                <ul className="space-y-3 pl-1">
                  {education.map((edu, i) => {
                    const isLast = i === education.length - 1;
                    return (
                      <li key={edu.school} className="flex gap-3">
                        <span className="text-white/30 select-none whitespace-pre">
                          {isLast ? '└─ ' : '├─ '}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-baseline gap-x-3">
                            <span className="text-white">{edu.school}</span>
                            <span className="text-white/40 text-[12px]">{edu.year}</span>
                            {edu.current && (
                              <span className="px-1.5 py-0.5 text-[10px] text-accent border border-accent/30 bg-accent/[0.06] tracking-wider">
                                CURRENT
                              </span>
                            )}
                          </div>
                          <div className="text-white/50 text-[12px] mt-0.5">{edu.degree}</div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            <div>
              <a
                href="#"
                className="inline-flex items-center gap-2 px-4 py-2.5 border border-accent text-accent text-sm hover:bg-accent hover:text-bg transition-colors"
              >
                <FaDownload size={12} /> download_cv.pdf
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
