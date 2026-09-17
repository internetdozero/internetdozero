import { json, serverError } from '../_lib/response';

export async function onRequestGet(context) {
 try {
  if (!context.env.DB) return json({ error: 'D1 não configurado' }, 503);
  const { results } = await context.env.DB.prepare('SELECT name FROM categories ORDER BY name').all();
  return json(results.map(({ name }) => name), 200, { 'Cache-Control': 'no-store' });
 } catch (error) { return serverError(error); }
}
