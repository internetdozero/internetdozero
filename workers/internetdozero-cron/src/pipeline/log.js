export async function logExecution(db, { topic, slug, status, errorMessage, durationMs }) {
  try {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS cron_log (
        id TEXT PRIMARY KEY,
        ran_at TEXT NOT NULL,
        topic TEXT,
        slug TEXT,
        status TEXT NOT NULL,
        error_message TEXT,
        duration_ms INTEGER
      )
    `).run();

    const id = crypto.randomUUID();
    const ranAt = new Date().toISOString();

    await db.prepare(`
      INSERT INTO cron_log (id, ran_at, topic, slug, status, error_message, duration_ms)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      ranAt,
      topic || null,
      slug || null,
      status,
      errorMessage || null,
      durationMs || 0
    ).run();

    console.log('Execution logged to DB.');
  } catch (err) {
    console.error('Failed to log execution to DB:', err);
  }
}
