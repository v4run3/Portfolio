DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS messages;

CREATE TABLE projects (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT NOT NULL,
  image       TEXT NOT NULL,
  link        TEXT NOT NULL,
  tags        TEXT NOT NULL DEFAULT '[]',
  created_at  TEXT NOT NULL
);

CREATE INDEX idx_projects_created_at ON projects (created_at DESC);

CREATE TABLE messages (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  message    TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX idx_messages_created_at ON messages (created_at DESC);
