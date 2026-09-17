/* global Headers */
import { requestOriginAllowed } from './response.js';

/**
 * Reescreve Access-Control-Allow-Origin nas rotas protegidas,
 * impedindo o wildcard (*) que o Cloudflare Pages aplica por padrão.
 * Em dev local aceita a origin do proxy Vite; em produção, só same-origin.
 */
export async function restrictCors(context) {
  const response = await context.next();
  const origin = context.request.headers.get('Origin');
  const self = new URL(context.request.url).origin;
  const allowed = !origin || requestOriginAllowed(context.request) ? (origin || self) : 'null';
  const headers = new Headers(response.headers);
  headers.set('Access-Control-Allow-Origin', allowed);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
