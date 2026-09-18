import { requireAdmin } from '../../_lib/auth';
import { json } from '../../_lib/response';

export async function onRequestPost(context) {
  const auth = await requireAdmin(context.request, context.env, { csrf: true });
  if (auth.response) return auth.response;

  const { CRON_WORKER_URL, CRON_SECRET } = context.env;

  if (!CRON_WORKER_URL || !CRON_SECRET) {
    return json(
      { error: 'CRON_WORKER_URL and CRON_SECRET environment variables must be configured' },
      500
    );
  }

  try {
    const triggerUrl = `${CRON_WORKER_URL}/trigger?secret=${encodeURIComponent(CRON_SECRET)}`;
    
    // Article generation can take a long time, use 90s timeout
    const response = await fetch(triggerUrl, {
      method: 'POST',
      signal: AbortSignal.timeout(90000),
    });

    const result = await response.json().catch(() => ({}));
    
    if (!response.ok) {
      return json(
        { error: result.error || 'Failed to trigger cron worker', details: result },
        response.status
      );
    }

    return json(result);
  } catch (err) {
    if (err.name === 'TimeoutError' || err.name === 'AbortError') {
      return json({ error: 'Trigger request timed out after 90 seconds' }, 504);
    }
    return json({ error: err.message }, 500);
  }
}
