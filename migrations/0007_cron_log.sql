CREATE TABLE IF NOT EXISTS cron_log (
  id TEXT PRIMARY KEY,
  ran_at TEXT NOT NULL,
  topic TEXT,
  slug TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  error_message TEXT,
  duration_ms INTEGER,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_cron_log_ran_at ON cron_log(ran_at);
CREATE INDEX idx_cron_log_status ON cron_log(status);
