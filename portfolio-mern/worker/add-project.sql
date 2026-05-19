-- Edit the values below, then run:  npm run db:add
-- (works against the live D1 — changes go live immediately)

INSERT INTO projects (id, title, description, image, link, tags, created_at) VALUES (
  lower(hex(randomblob(16))),
  'PromptOps',
  'PromptOps is an AI-powered prompt management system that helps you organize, optimize, and share your prompts.',
  '',
  'https://github.com/v4run3/PromptOps',
  '["Python","FastAPI","Javascript","MLOps", "DevOps","LLM"]',
  strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
);
