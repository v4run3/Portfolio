import { useEffect, useState } from 'react';
import {
  FaGithub, FaCodeCommit, FaStar, FaCodeBranch,
  FaCodePullRequest, FaCodeFork, FaCircleDot,
} from 'react-icons/fa6';

const GITHUB_USER = 'v4run3';

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

function shortRepo(fullName) {
  const [owner, repo] = fullName.split('/');
  return owner === GITHUB_USER ? repo : fullName;
}

function describeEvent(e) {
  const repo = shortRepo(e.repo.name);
  const time = timeAgo(e.created_at);
  switch (e.type) {
    case 'PushEvent': {
      const msg = e.payload.commits?.[e.payload.commits.length - 1]?.message?.split('\n')[0];
      return { Icon: FaCodeCommit, label: 'push', repo, detail: msg ?? '', time };
    }
    case 'WatchEvent':
      return { Icon: FaStar, label: 'star', repo, detail: '', time };
    case 'CreateEvent':
      return { Icon: FaCodeBranch, label: 'new', repo, detail: e.payload.ref_type ?? '', time };
    case 'PullRequestEvent':
      return { Icon: FaCodePullRequest, label: 'pr', repo, detail: e.payload.pull_request?.title ?? '', time };
    case 'ForkEvent':
      return { Icon: FaCodeFork, label: 'fork', repo, detail: '', time };
    case 'IssuesEvent':
      return { Icon: FaCircleDot, label: 'issue', repo, detail: e.payload.issue?.title ?? '', time };
    default:
      return null;
  }
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
    const base = `https://api.github.com/users/${GITHUB_USER}`;
    const json = (url) => fetch(url).then((r) => (r.ok ? r.json() : Promise.reject(r.status)));

    Promise.allSettled([
      json(base),
      json(`${base}/repos?per_page=100&sort=pushed`),
      json(`${base}/events/public?per_page=30`),
    ]).then(([user, repos, evs]) => {
      if (cancelled) return;

      let nextStats = null;
      if (user.status === 'fulfilled') {
        nextStats = {
          repos: user.value.public_repos,
          followers: user.value.followers,
          stars: null,
          topLang: null,
        };
      }
      if (repos.status === 'fulfilled' && Array.isArray(repos.value)) {
        const stars = repos.value.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
        const langs = {};
        repos.value.forEach((r) => {
          if (r.language) langs[r.language] = (langs[r.language] || 0) + 1;
        });
        const sorted = Object.entries(langs).sort((a, b) => b[1] - a[1]);
        nextStats = {
          repos: nextStats?.repos ?? repos.value.length,
          followers: nextStats?.followers ?? null,
          stars,
          topLang: sorted[0]?.[0] ?? '—',
          topLangs: sorted.slice(0, 4).map(([name, count]) => ({ name, count })),
        };
      }

      const mapped =
        evs.status === 'fulfilled' && Array.isArray(evs.value)
          ? evs.value.map(describeEvent).filter(Boolean).slice(0, 6)
          : [];

      setStats(nextStats);
      setEvents(mapped);
      setStatus(nextStats || mapped.length ? 'ok' : 'error');
    });

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
              {events.map((e, i) => (
                <li key={i} className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <e.Icon size={11} className="text-accent shrink-0" />
                    <span className="text-white/50 w-10 shrink-0">{e.label}</span>
                    <span className="text-white/85 truncate flex-1">{e.repo}</span>
                    <span className="text-white/30 text-[10px] shrink-0">{e.time}</span>
                  </div>
                  {e.detail && (
                    <div className="pl-[48px] text-white/40 text-[11px] truncate">
                      {e.detail}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Now;
