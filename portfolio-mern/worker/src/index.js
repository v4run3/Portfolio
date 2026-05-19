// Cloudflare Worker — Portfolio API on D1
// Mirrors the Express routes from server/index.js so the existing client works unchanged.

const jsonHeaders = { 'Content-Type': 'application/json' };

function corsHeaders(request, env) {
  const origin = request.headers.get('Origin') ?? '';
  const allowed = (env.ALLOWED_ORIGINS ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  const allowOrigin = allowed.includes(origin) ? origin : allowed[0] ?? '*';
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
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

      return json({ message: 'Not found' }, { status: 404 }, request, env);
    } catch (err) {
      return json({ message: err.message ?? 'Internal error' }, { status: 500 }, request, env);
    }
  },
};
