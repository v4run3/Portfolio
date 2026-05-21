import { useEffect, useState } from 'react';
import {
  FaGithub, FaCodeCommit, FaStar, FaCodeBranch,
  FaCodePullRequest, FaCodeFork, FaCircleDot,
} from 'react-icons/fa6';

const GITHUB_USER = 'v4run3';
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const EVENT_META = {
  push: { Icon: FaCodeCommit, label: 'push' },
  star: { Icon: FaStar, label: 'star' },
  new: { Icon: FaCodeBranch, label: 'new' },
  pr: { Icon: FaCodePullRequest, label: 'pr' },
  fork: { Icon: FaCodeFork, label: 'fork' },
  issue: { Icon: FaCircleDot, label: 'issue' },
};

function timeAgo(iso) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d`;
  return `${Math.floor(d / 7)}w`;
}

const Stat = ({ label, value }) => (
  <div className="flex items-baseline gap-2">
    <span className="text-white/30 select-none">{'>'}</span>
    <span className="text-white/40 flex-1 truncate">{label}</span>
    <span className="text-white tabular-nums">{value}</span>
  </div>
);

const Now = () => {
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ok | error

  useEffect(() => {
    let cancelled = false;
    // Hits our Worker (cached) instead of GitHub directly, so visitor IPs
    // never run into GitHub's 60/hr unauthenticated rate limit.
    fetch(`${apiUrl}/api/github`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data) => {
        if (cancelled) return;
        setStats(data.stats ?? null);
        setEvents(Array.isArray(data.events) ? data.events : []);
        setStatus(data.stats || data.events?.length ? 'ok' : 'error');
      })
      .catch(() => !cancelled && setStatus('error'));

    return () => { cancelled = true; };
  }, []);

  return (
    <div className="card overflow-hidden">
      {/* window chrome */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-border bg-surface2">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#3a3a3a]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#3a3a3a]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#3a3a3a]" />
        </div>
        <span className="text-[11px] text-white/40">github.live</span>
        <FaGithub size={12} className="text-white/40" />
      </div>

      <div className="p-5 space-y-6 text-[13px] leading-relaxed">
        {/* stats */}
        <div>
          <div className="flex items-baseline justify-between mb-3">
            <span className="text-accent">[ stats ]</span>
            <a
              href={`https://github.com/${GITHUB_USER}`}
              target="_blank"
              rel="noreferrer"
              className="text-white/30 text-[10px] hover:text-accent transition-colors"
            >
              @{GITHUB_USER}
            </a>
          </div>

          {status === 'loading' && (
            <div className="text-white/40">
              loading<span className="cursor-blink" />
            </div>
          )}
          {status !== 'loading' && stats && (
            <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
              <Stat label="repos" value={stats.repos ?? '—'} />
              <Stat label="stars" value={stats.stars ?? '—'} />
              <Stat label="followers" value={stats.followers ?? '—'} />
              <Stat label="top_lang" value={stats.topLang ?? '—'} />
            </div>
          )}
          {status === 'error' && !stats && (
            <div className="text-white/40">— github unavailable —</div>
          )}
        </div>

        {/* languages */}
        {status !== 'loading' && stats?.topLangs?.length > 0 && (
          <>
            <div className="h-px bg-border" />
            <div>
              <div className="text-accent mb-3">[ languages ]</div>
              <div className="space-y-2">
                {stats.topLangs.map((lang) => {
                  const max = stats.topLangs[0].count || 1;
                  const pct = Math.max(8, Math.round((lang.count / max) * 100));
                  return (
                    <div key={lang.name} className="flex items-center gap-3">
                      <span className="text-white/70 w-24 shrink-0 truncate text-[12px]">
                        {lang.name}
                      </span>
                      <div className="flex-1 h-1.5 bg-bg border border-border overflow-hidden">
                        <div className="h-full bg-accent/70" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-white/40 text-[11px] w-5 text-right tabular-nums">
                        {lang.count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* divider */}
        <div className="h-px bg-border" />

        {/* recent activity */}
        <div>
          <div className="text-accent mb-3">[ recent.activity ]</div>

          {status === 'loading' && (
            <div className="text-white/40">
              fetching<span className="cursor-blink" />
            </div>
          )}
          {status !== 'loading' && events.length === 0 && (
            <div className="text-white/40">— no recent activity —</div>
          )}
          {events.length > 0 && (
            <ul className="space-y-2.5">
              {events.map((e, i) => {
                const meta = EVENT_META[e.kind] ?? { Icon: FaCodeCommit, label: e.kind };
                const Icon = meta.Icon;
                return (
                  <li key={i} className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <Icon size={11} className="text-accent shrink-0" />
                      <span className="text-white/50 w-10 shrink-0">{meta.label}</span>
                      <span className="text-white/85 truncate flex-1">{e.repo}</span>
                      <span className="text-white/30 text-[10px] shrink-0">{timeAgo(e.createdAt)}</span>
                    </div>
                    {e.detail && (
                      <div className="pl-[48px] text-white/40 text-[11px] truncate">
                        {e.detail}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Now;
