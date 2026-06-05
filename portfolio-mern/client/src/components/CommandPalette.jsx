import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { scroller } from 'react-scroll';
import {
  FaArrowRight, FaGithub, FaLinkedin, FaDownload,
  FaEnvelope, FaLink, FaCheck, FaWandMagicSparkles, FaChevronLeft,
} from 'react-icons/fa6';
import AiChat from './AiChat';
import { linkedInUrl } from '../config';

const NAV_OFFSET = -72;

const sections = [
  { id: 'profile', label: 'profile' },
  { id: 'stack', label: 'stack' },
  { id: 'projects', label: 'projects' },
  { id: 'contact', label: 'contact' },
];

function scrollTo(target) {
  scroller.scrollTo(target, { smooth: true, duration: 500, offset: NAV_OFFSET });
}

function focusContactName() {
  const el = document.querySelector('#contact input[name="name"]');
  if (el) el.focus({ preventScroll: true });
}

const CommandPalette = ({ open, onClose }) => {
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState('commands'); // 'commands' | 'chat'
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const commands = useMemo(() => {
    const close = () => onClose();
    return [
      {
        group: 'assistant',
        label: 'ask ai about Varun',
        hint: 'chat · llama-3.1',
        icon: FaWandMagicSparkles,
        run: () => setMode('chat'),
      },
      ...sections.map((s) => ({
        group: 'navigate',
        label: `go to ${s.label}`,
        hint: `#${s.id}`,
        icon: FaArrowRight,
        run: () => { scrollTo(s.id); close(); },
      })),
      {
        group: 'links',
        label: 'open github',
        hint: 'github.com/v4run3',
        icon: FaGithub,
        run: () => { window.open('https://github.com/v4run3', '_blank', 'noopener'); close(); },
      },
      {
        group: 'links',
        label: 'open linkedin',
        hint: 'linkedin.com',
        icon: FaLinkedin,
        run: () => { window.open(linkedInUrl, '_blank', 'noopener'); close(); },
      },
      {
        group: 'links',
        label: 'download cv',
        hint: 'pdf',
        icon: FaDownload,
        run: () => { window.open('/Varun-Bhonslay-CV.pdf', '_blank', 'noopener'); close(); },
      },
      {
        group: 'actions',
        label: 'send a message',
        hint: 'jump to form + focus',
        icon: FaEnvelope,
        run: () => { scrollTo('contact'); close(); setTimeout(focusContactName, 550); },
      },
      {
        group: 'actions',
        label: 'copy page url',
        hint: typeof window !== 'undefined' ? window.location.host : '',
        icon: FaLink,
        run: async () => {
          try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => { setCopied(false); close(); }, 700);
          } catch {
            close();
          }
        },
      },
    ];
  }, [onClose]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.hint?.toLowerCase().includes(q) ||
        c.group.includes(q)
    );
  }, [commands, query]);

  // Reset state when opening
  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIdx(0);
      setCopied(false);
      setMode('commands');
      const t = setTimeout(() => inputRef.current?.focus(), 20);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Keep activeIdx in range whenever filter changes
  useEffect(() => {
    setActiveIdx((i) => Math.min(i, Math.max(filtered.length - 1, 0)));
  }, [filtered.length]);

  // Scroll active item into view
  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector(`[data-cmd-idx="${activeIdx}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIdx, open]);

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // In-palette keys: Esc, arrows, enter
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (mode === 'chat') setMode('commands');
        else onClose();
        return;
      }
      if (mode !== 'commands') return; // chat handles its own keys
      if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, filtered.length - 1)); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, 0)); }
      else if (e.key === 'Enter') { e.preventDefault(); filtered[activeIdx]?.run(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose, filtered, activeIdx, mode]);

  // Build groups while preserving the global index for keyboard nav
  const grouped = useMemo(() => {
    const map = new Map();
    filtered.forEach((item, idx) => {
      if (!map.has(item.group)) map.set(item.group, []);
      map.get(item.group).push({ ...item, idx });
    });
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[14vh] px-4 bg-black/70 backdrop-blur-sm"
          onMouseDown={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="command palette"
        >
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.985 }}
            transition={{ duration: 0.14, ease: [0.22, 1, 0.36, 1] }}
            onMouseDown={(e) => e.stopPropagation()}
            className="w-full max-w-xl card overflow-hidden shadow-2xl shadow-black/60"
          >
            {mode === 'chat' ? (
              <>
                <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                  <button
                    type="button"
                    onClick={() => setMode('commands')}
                    className="inline-flex items-center gap-1.5 text-[12px] text-white/50 hover:text-accent transition-colors"
                  >
                    <FaChevronLeft size={10} /> back
                  </button>
                  <span className="flex-1 text-center text-[12px] text-white/40 inline-flex items-center justify-center gap-1.5">
                    <FaWandMagicSparkles size={10} className="text-accent" /> ask ai
                  </span>
                  <kbd className="px-1.5 py-0.5 text-[10px] text-white/40 border border-border bg-bg">
                    esc
                  </kbd>
                </div>
                <AiChat variant="modal" autoFocus />
              </>
            ) : (
            <>
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <span className="text-accent text-sm select-none">{`>`}</span>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="type a command or search..."
                className="flex-1 bg-transparent text-[14px] text-white placeholder:text-white/30 focus:outline-none"
                spellCheck={false}
                autoComplete="off"
              />
              <kbd className="px-1.5 py-0.5 text-[10px] text-white/40 border border-border bg-bg">
                esc
              </kbd>
            </div>

            <div ref={listRef} className="max-h-[55vh] overflow-y-auto py-1">
              {grouped.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-white/40">
                  <span className="text-accent">!</span> no matching command
                </div>
              ) : (
                grouped.map(([group, items]) => (
                  <div key={group}>
                    <div className="px-4 pt-3 pb-1.5 text-[10px] tracking-widest text-white/30 uppercase">
                      {group}
                    </div>
                    <ul>
                      {items.map((item) => {
                        const Icon = item.icon;
                        const isActive = item.idx === activeIdx;
                        const isCopyAction = item.label === 'copy page url' && copied;
                        return (
                          <li key={item.label}>
                            <button
                              type="button"
                              data-cmd-idx={item.idx}
                              onClick={() => item.run()}
                              onMouseEnter={() => setActiveIdx(item.idx)}
                              className={`w-full flex items-center gap-3 px-4 py-2 text-left transition-colors ${
                                isActive
                                  ? 'bg-surface2 text-accent'
                                  : 'text-white/85 hover:bg-surface2/60'
                              }`}
                            >
                              <Icon
                                size={12}
                                className={isActive ? 'text-accent' : 'text-white/50'}
                              />
                              <span className="text-[13px] flex-1">
                                {isCopyAction ? 'copied!' : item.label}
                              </span>
                              {isCopyAction ? (
                                <FaCheck size={10} className="text-accent" />
                              ) : (
                                <span className="text-[11px] text-white/30 truncate max-w-[180px]">
                                  {item.hint}
                                </span>
                              )}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))
              )}
            </div>

            <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-surface2/50 text-[11px] text-white/40">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1">
                  <kbd className="px-1 border border-border bg-bg">↑↓</kbd> navigate
                </span>
                <span className="inline-flex items-center gap-1">
                  <kbd className="px-1 border border-border bg-bg">↵</kbd> select
                </span>
              </div>
              <span className="inline-flex items-center gap-1">
                <kbd className="px-1 border border-border bg-bg">⌃K</kbd> toggle
              </span>
            </div>
            </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
