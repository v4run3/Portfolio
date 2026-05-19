import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaArrowUpRightFromSquare, FaGithub, FaCodeBranch } from 'react-icons/fa6';

const SectionLabel = ({ children, num, count }) => (
  <div className="flex items-center gap-4 mb-12">
    <span className="text-accent text-sm tracking-wider">{num}</span>
    <h2 className="text-2xl md:text-3xl font-mono text-white">{children}</h2>
    <div className="flex-1 h-px bg-border" />
    {count != null && (
      <span className="text-white/40 text-[12px] tracking-wider">
        TOTAL_ITEMS: {count.toString().padStart(2, '0')}
      </span>
    )}
  </div>
);

function parseRepo(link) {
  try {
    const url = new URL(link);
    if (url.hostname.endsWith('github.com')) {
      const [, owner, repo] = url.pathname.split('/');
      if (owner && repo) return { owner, repo: repo.replace(/\.git$/, '') };
    }
  } catch {
    /* ignore */
  }
  return null;
}

function slugify(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const ProjectCard = ({ project, index }) => {
  const repo = parseRepo(project.link);
  const filename = `${repo ? `${repo.owner}/${repo.repo}` : slugify(project.title)}.md`;

  return (
    <motion.a
      href={project.link}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      className="card group flex flex-col overflow-hidden no-underline relative"
    >
      {/* window chrome */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-surface2 shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#3a3a3a] group-hover:bg-[#ef4444]/70 transition-colors" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#3a3a3a] group-hover:bg-[#f59e0b]/70 transition-colors" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#3a3a3a] group-hover:bg-accent transition-colors" />
        </div>
        <span className="text-[11px] text-white/40 truncate px-3">{filename}</span>
        <FaGithub size={12} className="text-white/40 group-hover:text-accent transition-colors" />
      </div>

      {/* accent index bar */}
      <div className="absolute top-9 left-0 w-0.5 h-12 bg-accent/40 group-hover:bg-accent transition-colors" />

      {/* body */}
      <div className="p-5 flex flex-col gap-4 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-white/30 text-[11px] tracking-wider">
            #{String(index + 1).padStart(2, '0')}
          </span>
          {repo && (
            <span className="inline-flex items-center gap-1.5 text-[11px] text-white/35">
              <FaCodeBranch size={9} /> main
            </span>
          )}
        </div>

        <div>
          <h3 className="text-white text-lg leading-tight font-medium group-hover:text-accent transition-colors">
            {project.title}
          </h3>
          {repo && (
            <div className="text-[12px] text-white/40 mt-1">
              {repo.owner}<span className="text-white/25">/</span>{repo.repo}
            </div>
          )}
        </div>

        <p className="text-white/60 text-[13px] leading-relaxed line-clamp-4">
          {project.description}
        </p>

        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-[10px] tracking-wider text-white/60 border border-border bg-bg group-hover:border-borderHover transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-border text-[12px]">
          <span className="text-white/40 group-hover:text-accent transition-colors">
            view_project
          </span>
          <FaArrowUpRightFromSquare
            size={11}
            className="text-white/40 group-hover:text-accent group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all"
          />
        </div>
      </div>
    </motion.a>
  );
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    axios
      .get(`${apiUrl}/api/projects`)
      .then((res) => setProjects(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="projects" className="relative px-6 md:px-12 py-24 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <SectionLabel num="03 //" count={projects.length}>
          selected.works
        </SectionLabel>

        {loading && (
          <div className="text-white/40 text-sm font-mono">
            <span className="text-accent">$</span> fetching projects<span className="cursor-blink"></span>
          </div>
        )}

        {error && (
          <div className="card p-4 text-sm">
            <div className="text-red-400 mb-1">! error fetching projects</div>
            <div className="text-white/50 text-[12px]">{error}</div>
          </div>
        )}

        {!loading && !error && projects.length === 0 && (
          <div className="text-white/40 text-sm">No projects yet.</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project, i) => (
            <ProjectCard key={project._id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
