// Cloudflare Worker — Portfolio API on D1
// Mirrors the Express routes from server/index.js so the existing client works unchanged.

const jsonHeaders = { 'Content-Type': 'application/json' };

function corsHeaders(request, env) {
  const origin = request.headers.get('Origin') ?? '';
  const allowed = (env.ALLOWED_ORIGINS ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  const allowOrigin = isAllowedOrigin(origin, allowed) ? origin : allowed[0] ?? '*';
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

function isAllowedOrigin(origin, allowed) {
  if (!origin) return false;

  return allowed.some((candidate) => {
    if (candidate === '*' || candidate === origin) return true;
    if (candidate.startsWith('*.')) {
      const suffix = candidate.slice(1);
      return origin.endsWith(suffix);
    }
    return false;
  });
}

function json(body, init = {}, request, env) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: { ...jsonHeaders, ...corsHeaders(request, env), ...(init.headers ?? {}) },
  });
}

function projectFromRow(row) {
  return {
    _id: row.id,
    title: row.title,
    description: row.description,
    image: row.image,
    link: row.link,
    tags: row.tags ? JSON.parse(row.tags) : [],
    createdAt: row.created_at,
  };
}

function messageFromRow(row) {
  return {
    _id: row.id,
    name: row.name,
    email: row.email,
    message: row.message,
    createdAt: row.created_at,
  };
}

async function listProjects(request, env) {
  const { results } = await env.DB.prepare(
    'SELECT id, title, description, image, link, tags, created_at FROM projects ORDER BY created_at DESC'
  ).all();
  return json(results.map(projectFromRow), {}, request, env);
}

async function createMessage(request, env) {
  const body = await request.json();
  const { name, email, message } = body ?? {};
  if (!name || !email || !message) {
    return json({ message: 'name, email, message are required' }, { status: 400 }, request, env);
  }
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  await env.DB.prepare(
    'INSERT INTO messages (id, name, email, message, created_at) VALUES (?, ?, ?, ?, ?)'
  )
    .bind(id, name, email, message, createdAt)
    .run();
  return json(
    messageFromRow({ id, name, email, message, created_at: createdAt }),
    { status: 201 },
    request,
    env
  );
}

const GH_USER = 'v4run3';

function ghHeaders(env) {
  const h = {
    'User-Agent': 'varunbhonslay-portfolio',
    Accept: 'application/vnd.github+json',
  };
  if (env.GITHUB_TOKEN) h.Authorization = `Bearer ${env.GITHUB_TOKEN}`;
  return h;
}

function ghShortRepo(fullName) {
  const [owner, repo] = fullName.split('/');
  return owner === GH_USER ? repo : fullName;
}

function ghMapEvent(e) {
  const base = { repo: ghShortRepo(e.repo.name), createdAt: e.created_at };
  switch (e.type) {
    case 'PushEvent': {
      const msg = e.payload.commits?.[e.payload.commits.length - 1]?.message?.split('\n')[0];
      return { ...base, kind: 'push', detail: msg ?? '' };
    }
    case 'WatchEvent': return { ...base, kind: 'star', detail: '' };
    case 'CreateEvent': return { ...base, kind: 'new', detail: e.payload.ref_type ?? '' };
    case 'PullRequestEvent': return { ...base, kind: 'pr', detail: e.payload.pull_request?.title ?? '' };
    case 'ForkEvent': return { ...base, kind: 'fork', detail: '' };
    case 'IssuesEvent': return { ...base, kind: 'issue', detail: e.payload.issue?.title ?? '' };
    default: return null;
  }
}

// Fetches + caches GitHub data so visitor IPs never hit GitHub's 60/hr limit.
async function fetchGitHubData(env) {
  const opts = { headers: ghHeaders(env), cf: { cacheTtl: 600, cacheEverything: true } };
  const base = `https://api.github.com/users/${GH_USER}`;

  const [userRes, reposRes, eventsRes] = await Promise.allSettled([
    fetch(base, opts).then((r) => (r.ok ? r.json() : Promise.reject(r.status))),
    fetch(`${base}/repos?per_page=100&sort=pushed`, opts).then((r) => (r.ok ? r.json() : Promise.reject(r.status))),
    fetch(`${base}/events/public?per_page=30`, opts).then((r) => (r.ok ? r.json() : Promise.reject(r.status))),
  ]);

  let stats = null;
  let recentRepos = [];
  if (userRes.status === 'fulfilled') {
    stats = { repos: userRes.value.public_repos, followers: userRes.value.followers, stars: null, topLang: null, topLangs: [] };
  }
  if (reposRes.status === 'fulfilled' && Array.isArray(reposRes.value)) {
    const repos = reposRes.value;
    const stars = repos.reduce((s, r) => s + (r.stargazers_count || 0), 0);
    const langs = {};
    repos.forEach((r) => { if (r.language) langs[r.language] = (langs[r.language] || 0) + 1; });
    const sorted = Object.entries(langs).sort((a, b) => b[1] - a[1]);
    stats = {
      repos: stats?.repos ?? repos.length,
      followers: stats?.followers ?? null,
      stars,
      topLang: sorted[0]?.[0] ?? '—',
      topLangs: sorted.slice(0, 4).map(([name, count]) => ({ name, count })),
    };
    recentRepos = repos
      .filter((r) => !r.fork)
      .slice(0, 8)
      .map((r) => ({
        name: r.name,
        description: r.description ?? '',
        language: r.language ?? '',
        pushedAt: r.pushed_at,
        url: r.html_url,
      }));
  }

  const allEvents =
    eventsRes.status === 'fulfilled' && Array.isArray(eventsRes.value)
      ? eventsRes.value.map(ghMapEvent).filter(Boolean)
      : [];

  return { stats, events: allEvents.slice(0, 6), recentRepos, allEvents };
}

async function github(request, env) {
  const { stats, events } = await fetchGitHubData(env);
  return json({ stats, events }, { headers: { 'cache-control': 'public, max-age=300' } }, request, env);
}

function formatGitHubContext({ recentRepos, allEvents }) {
  const lines = [];

  if (recentRepos.length) {
    lines.push('Recently active repositories (most recent push first):');
    for (const r of recentRepos.slice(0, 6)) {
      const lang = r.language ? ` [${r.language}]` : '';
      const desc = r.description ? ` — ${r.description}` : '';
      lines.push(`- ${r.name}${lang}${desc} (last push: ${r.pushedAt}, ${r.url})`);
    }
  }

  const pushes = allEvents.filter((e) => e.kind === 'push').slice(0, 8);
  if (pushes.length) {
    lines.push('');
    lines.push('Recent commits (from public GitHub activity):');
    for (const e of pushes) {
      const detail = e.detail ? ` — "${e.detail}"` : '';
      lines.push(`- push to ${e.repo}${detail} (${e.createdAt})`);
    }
  }

  return lines.length ? lines.join('\n') : '(GitHub activity unavailable)';
}

const CHAT_MODEL = '@cf/meta/llama-3.1-8b-instruct-fast';

async function buildSystemPrompt(env) {
  let projectContext = '(no projects listed)';
  try {
    const { results } = await env.DB.prepare(
      'SELECT title, description, tags FROM projects ORDER BY created_at DESC'
    ).all();
    if (results.length) {
      projectContext = results
        .map((p) => {
          let tags = '';
          try { tags = JSON.parse(p.tags).filter(Boolean).join(', '); } catch { /* ignore */ }
          return `- ${p.title}: ${p.description}${tags ? ` [${tags}]` : ''}`;
        })
        .join('\n');
    }
  } catch { /* projects optional */ }

  let githubContext = '(GitHub activity unavailable)';
  try {
    const gh = await fetchGitHubData(env);
    githubContext = formatGitHubContext(gh);
  } catch { /* github optional */ }

  return `You are the AI assistant embedded in Varun Bhonslay's developer portfolio website. You answer visitors' questions about Varun, referring to him as "Varun". Keep answers concise (2-4 sentences), friendly, and professional. ONLY answer questions about Varun, his skills, projects, and background. If a question is unrelated or you lack the information, politely say you can only help with questions about Varun and his work. Never invent facts.

ABOUT VARUN:
- First-year Master's student in Computer Engineering at K. J. Somaiya College of Engineering (2025-2027).
- Full-stack developer focused on AI/ML and the MERN stack. Based in Mumbai, India.
- Open to freelance work and research collaborations.
- Skills: React, TypeScript, Node.js, Express, MongoDB, Cloudflare Workers & D1, Python, LLMs, NLP, TensorFlow, Git.

PROJECTS (portfolio highlights):
${projectContext}

RECENT GITHUB ACTIVITY (live from github.com/${GH_USER}):
${githubContext}

When asked what Varun is working on, his current focus, latest repo, or recent coding activity, answer using RECENT GITHUB ACTIVITY above. Name the most recently pushed repository first and mention recent commits when available. Cross-reference PROJECTS when a repo matches a listed project.

This portfolio is built with React + Vite on Cloudflare Pages, backed by Cloudflare Workers + D1, and this chat runs on Cloudflare Workers AI.`;
}

async function chat(request, env) {
  if (!env.AI) {
    return json({ message: 'AI is not configured' }, { status: 503 }, request, env);
  }

  // Per-IP rate limit — protects the daily Workers AI quota from spam.
  if (env.CHAT_RATE_LIMITER) {
    const ip = request.headers.get('CF-Connecting-IP') || 'anonymous';
    const { success } = await env.CHAT_RATE_LIMITER.limit({ key: ip });
    if (!success) {
      return json(
        { message: 'Too many messages — please wait a minute before asking again.' },
        { status: 429 },
        request,
        env
      );
    }
  }

  let body;
  try {
    const contentType = request.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      body = await request.json();
    } else {
      body = JSON.parse(await request.text());
    }
  } catch {
    return json({ message: 'invalid JSON body' }, { status: 400 }, request, env);
  }

  const incoming = Array.isArray(body?.messages) ? body.messages : [];
  const messages = incoming
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-6)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 1000) }));

  if (messages.length === 0) {
    return json({ message: 'messages required' }, { status: 400 }, request, env);
  }

  const system = await buildSystemPrompt(env);

  const aiResponse = await env.AI.run(CHAT_MODEL, {
    messages: [{ role: 'system', content: system }, ...messages],
    max_tokens: 400,
  });

  const text = typeof aiResponse?.response === 'string' ? aiResponse.response : '';
  const payload =
    `data: ${JSON.stringify({ response: text })}\n\n` +
    'data: [DONE]\n\n';

  return new Response(payload, {
    headers: {
      'content-type': 'text/event-stream',
      'cache-control': 'no-cache',
      'x-content-type-options': 'nosniff',
      ...corsHeaders(request, env),
    },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;
    const method = request.method;

    if (method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(request, env) });
    }

    try {
      if (pathname === '/' && method === 'GET') {
        return new Response('Portfolio API is running', {
          headers: { 'Content-Type': 'text/plain', ...corsHeaders(request, env) },
        });
      }

      if (pathname === '/api/projects' && method === 'GET') return listProjects(request, env);
      if (pathname === '/api/messages' && method === 'POST') return createMessage(request, env);
      if (pathname === '/api/github' && method === 'GET') return github(request, env);
      if (pathname === '/api/chat' && method === 'POST') return chat(request, env);

      return json({ message: 'Not found' }, { status: 404 }, request, env);
    } catch (err) {
      return json({ message: err.message ?? 'Internal error' }, { status: 500 }, request, env);
    }
  },
};
