import { discoverTopics } from './pipeline/discover.js';
import { deduplicateTopics } from './pipeline/deduplicate.js';
import { generateArticle, validateArticleSources } from './pipeline/generate.js';
import { enrichArticle } from './pipeline/enrich.js';
import { publishArticle } from './pipeline/publish.js';
import { logExecution } from './pipeline/log.js';

async function runPipeline(env, requestedTopic = '', options = {}) {
  const startTime = Date.now();
  let topic = null;
  let slug = null;
  let status = 'skipped';
  let errorMessage = null;

  try {
    console.log('Starting execution pipeline');
    const topics = requestedTopic
      ? [{ title: requestedTopic, summary: `Pauta definida manualmente pelo administrador: ${requestedTopic}`, category: 'Geral', pillar: 'geral', suggestedTags: [] }]
      : await discoverTopics(env);
    if (!topics || topics.length === 0) {
      throw new Error('No topics discovered');
    }

    const candidateTopic = topics[0];
    topic = await deduplicateTopics(env.DB, topics);
    if (!topic) {
      topic = candidateTopic;
      console.log('All topics were duplicates. Skipping execution.');
      status = 'skipped';
    } else {
      console.log(`Generating article for topic: ${topic.title}`);
      const rawArticle = await generateArticle(env, topic, options);
      await validateArticleSources(rawArticle);
      
      console.log('Enriching article');
      const enrichedArticle = await enrichArticle(env.DB, rawArticle, env.SITE_URL);
      
      console.log('Publishing article');
      const result = await publishArticle(env.DB, enrichedArticle, env);
      slug = result.slug;
      status = 'success';
      console.log(`Article published/drafted successfully with slug: ${slug}`);
    }
  } catch (err) {
    console.error('Error during pipeline execution:', err);
    status = 'error';
    errorMessage = err.message || String(err);
  } finally {
    const durationMs = Date.now() - startTime;
    await logExecution(env.DB, { topic: topic?.title, slug, status, errorMessage, durationMs });
    console.log(`Pipeline finished in ${durationMs}ms with status: ${status}`);
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/trigger' && url.searchParams.get('secret') === env.CRON_SECRET) {
      const payload = request.method === 'POST'
        ? await request.json().catch(() => ({}))
        : {};
      await env.internetdozero_editorial.send({
        topic: typeof payload.topic === 'string' ? payload.topic.trim() : '',
        fallback: payload.fallback !== false
      });
      return new Response('Pipeline triggered', { status: 202 });
    }
    return new Response('Not Found', { status: 404 });
  },

  async scheduled(_event, env) {
    await env.internetdozero_editorial.send({ topic: '', fallback: true });
  },

  async queue(batch, env) {
    for (const message of batch.messages) {
      try {
        await runPipeline(env, message.body.topic || '', { fallback: message.body.fallback !== false });
        message.ack();
      } catch (error) {
        console.error('Queued pipeline execution failed:', error);
        message.retry();
      }
    }
  }
};
