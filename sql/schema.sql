-- Jalankan SEKALI di database Postgres kamu (Neon/Vercel Storage SQL editor, atau psql).
-- Aman dijalankan berkali-kali (IF NOT EXISTS).

CREATE TABLE IF NOT EXISTS bots (
  id              SERIAL PRIMARY KEY,
  name            TEXT UNIQUE NOT NULL,
  description     TEXT,
  owner           TEXT,
  language        TEXT,
  home            TEXT,
  help            TEXT,
  library_name    TEXT,
  library_public  TEXT,
  active          BOOLEAN NOT NULL DEFAULT false,
  uptime          INTEGER NOT NULL DEFAULT 0,
  tags            TEXT[] NOT NULL DEFAULT '{}',
  usage_prefix    TEXT[] NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS news (
  id          SERIAL PRIMARY KEY,
  date        TEXT,
  tag         TEXT,
  title       TEXT NOT NULL,
  body        TEXT,
  link        TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
