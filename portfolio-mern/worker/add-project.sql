-- Edit the values below, then run:  npm run db:add
-- (works against the live D1 — changes go live immediately)

INSERT INTO projects (id, title, description, image, link, tags, created_at) VALUES (
  lower(hex(randomblob(16))),
  'CI-CD Failure Predictor',
  'CI-CD Failure Predictor is an AI-powered system that predicts failures in CI/CD pipelines.',
  '',
  'https://github.com/v4run3/ci-cd-failure-predictor',
  '["Python","React","Docker","MLOps","DevOps","LLM","Kubernetes","Github Actions"]',
  strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
);
