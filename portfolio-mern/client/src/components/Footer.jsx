import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { linkedInUrl } from '../config';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border px-6 md:px-12 py-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-[12px] text-white/40 font-mono">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-accent pulse-dot" />
          <span>varunbhonslay.is-a.dev — © {year}</span>
        </div>
        <div className="flex items-center gap-2 text-white/30">
          <span>built with</span>
          <span className="text-white/60">react</span>
          <span>·</span>
          <span className="text-white/60">tailwind</span>
          <span>·</span>
          <span className="text-white/60">cloudflare workers</span>
          <span>·</span>
          <span className="text-white/60">d1</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/v4run3"
            target="_blank"
            rel="noreferrer"
            className="hover:text-accent transition-colors"
            aria-label="github"
          >
            <FaGithub size={14} />
          </a>
          <a
            href={linkedInUrl}
            target="_blank"
            rel="noreferrer"
            className="hover:text-accent transition-colors"
            aria-label="linkedin"
          >
            <FaLinkedin size={14} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
