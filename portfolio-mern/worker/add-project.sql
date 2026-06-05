-- Edit the values below, then run:  npm run db:add
-- (works against the live D1 — changes go live immediately)

INSERT INTO projects (id, title, description, image, link, tags, created_at) VALUES (
  lower(hex(randomblob(16))),
  'qwen3.5-from-scratch',
  'A project where I built a Qwen3.5-like LLM from scratch.',
  '',
  'https://github.com/v4run3/qwen35-from-scratch',
  '["Python","Machine Learning","NLP","LLM","Pytorch","Deep Learning"]',
  strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
);
