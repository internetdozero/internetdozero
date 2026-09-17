CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author TEXT NOT NULL CHECK (length(author) BETWEEN 1 AND 80),
  content TEXT NOT NULL CHECK (length(content) BETWEEN 1 AND 2000),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS comments_post_status_date_idx ON comments (post_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS comments_status_date_idx ON comments (status, created_at DESC);
CREATE INDEX IF NOT EXISTS posts_category_date_idx ON posts (category, published, created_at DESC);
CREATE INDEX IF NOT EXISTS posts_slug_published_idx ON posts (slug, published);

PRAGMA foreign_keys = ON;

INSERT OR IGNORE INTO comments (id, post_id, author, content, status, created_at)
SELECT json_extract(value, '$.id'), p.id, substr(json_extract(value, '$.author'), 1, 80),
  substr(json_extract(value, '$.text'), 1, 2000), 'approved', json_extract(value, '$.createdAt')
FROM posts p, json_each(p.comments)
WHERE json_extract(value, '$.id') IS NOT NULL;
