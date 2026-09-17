CREATE TABLE IF NOT EXISTS categories (
  name TEXT PRIMARY KEY CHECK (length(name) BETWEEN 1 AND 60)
);

CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'article' CHECK (type IN ('article', 'story', 'thought')),
  title_pt TEXT NOT NULL CHECK (length(title_pt) BETWEEN 1 AND 180),
  subtitle_pt TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'Eduardo S.',
  reading_time TEXT NOT NULL DEFAULT '5 min',
  tags_pt TEXT NOT NULL DEFAULT '[]',
  sections_pt TEXT NOT NULL DEFAULT '[]',
  comments TEXT NOT NULL DEFAULT '[]',
  likes INTEGER NOT NULL DEFAULT 0 CHECK (likes >= 0),
  created_at TEXT NOT NULL,
  published INTEGER NOT NULL DEFAULT 1 CHECK (published IN (0, 1)),
  UNIQUE(category, slug)
);

CREATE INDEX IF NOT EXISTS posts_publication_idx ON posts (published, created_at DESC);

INSERT OR IGNORE INTO categories (name) VALUES
  ('Tecnologia'), ('Fitness'), ('Inteligência Artificial'), ('Crônicas');
