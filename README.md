# Portfolio

Personal portfolio — React SPA on Cloudflare Pages (`varunbhonslay.is-a.dev`), API on Cloudflare Workers + D1.

## CI/CD (two parts)

| What | How it deploys |
|------|----------------|
| **Frontend** (`varunbhonslay.is-a.dev`) | Cloudflare Pages — already connected to `v4run3/Portfolio` with automatic deployments on `main` |
| **API** (`portfolio-api.varun31201.workers.dev`) | GitHub Actions — [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) on push to `main` |

Pull requests only run lint + build checks. No duplicate Pages deploy from Actions (Cloudflare handles that).

### One-time: GitHub secrets (Worker API only)

Add these in [GitHub → Settings → Secrets → Actions](https://github.com/v4run3/Portfolio/settings/secrets/actions):

| Secret | Where to find it |
|--------|------------------|
| `CLOUDFLARE_API_TOKEN` | [Cloudflare API tokens](https://dash.cloudflare.com/profile/api-tokens) → **Edit Cloudflare Workers** template (Workers + D1 permissions) |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare dashboard → Workers & Pages → right sidebar |

### Cloudflare Pages build settings

In **Workers & Pages → portfolio-iio → Settings → Builds**, confirm:

| Setting | Value |
|---------|--------|
| Production branch | `main` |
| Root directory | `portfolio-mern/client` |
| Build command | `npm run build` |
| Build output directory | `dist` |

`VITE_API_URL` is set in `portfolio-mern/client/.env.production` (committed). Optionally add the same variable under **Settings → Environment variables** in Cloudflare for visibility.

Custom domain `varunbhonslay.is-a.dev` is already configured — no change needed.

## Local development

```bash
# API (http://localhost:8787)
cd portfolio-mern/worker && npm install && npm run dev

# Client (http://localhost:5173)
cd portfolio-mern/client && npm install && npm run dev
```

See `portfolio-mern/worker/README.md` for D1 setup and `portfolio-mern/client/.env.example` for API URL overrides.
