# Portfolio API — Cloudflare Worker + D1

Drop-in replacement for the Express + MongoDB backend in `../server/`.
Free tier, no cold starts, no sleeping cluster.

## Routes (unchanged from the Express server)

- `GET  /`              → `Portfolio API is running`
- `GET  /api/projects`  → list all projects, newest first
- `POST /api/projects`  → create a project (`title`, `description`, `image`, `link`, `tags[]`)
- `POST /api/messages`  → submit a contact message (`name`, `email`, `message`)

## One-time setup

```bash
cd portfolio-mern/worker
npm install
npx wrangler login        # opens browser, signs in to your Cloudflare account
npx wrangler d1 create portfolio
```

`wrangler d1 create` prints a `database_id`. Open `wrangler.toml` and replace
`REPLACE_WITH_DATABASE_ID` with it.

Then create the tables and seed your two projects on the remote D1:

```bash
npm run db:init      # creates projects + messages tables
npm run db:seed      # inserts the two sample projects
```

## Deploy

```bash
npm run deploy
```

Wrangler prints the live URL, e.g. `https://portfolio-api.<your-subdomain>.workers.dev`.
Verify:

```bash
curl https://portfolio-api.<your-subdomain>.workers.dev/api/projects
```

## Point the frontend at the Worker

Edit `../client/.env.production`:

```
VITE_API_URL=https://portfolio-api.<your-subdomain>.workers.dev
```

Rebuild and redeploy the Pages site (`npm run build` in `../client/`, then
push or upload the `dist/` output the same way you did before).

## Local development

```bash
npm run db:init:local
npm run db:seed:local
npm run dev          # serves at http://localhost:8787
```

Point the client at it by leaving `VITE_API_URL` unset in dev and changing
the default in `Projects.jsx` / `Contact.jsx` to `http://localhost:8787`,
or set `VITE_API_URL=http://localhost:8787` in `../client/.env.local`.

## Adding more allowed origins (CORS)

Edit `ALLOWED_ORIGINS` in `wrangler.toml` (comma-separated). For Pages
preview deploys, add the preview URL pattern you actually use, e.g.
`https://abc123.portfolio-iio.pages.dev`.

## Free tier limits (for reference)

- Workers: 100,000 requests/day, 10ms CPU each.
- D1: 5 GB storage, 5M row reads/day, 100k row writes/day.

A portfolio site uses a tiny fraction of any of these.
