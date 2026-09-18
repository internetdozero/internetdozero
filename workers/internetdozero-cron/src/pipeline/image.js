const OPENVERSE_URL = 'https://api.openverse.org/v1/images/';
const ALLOWED_LICENSES = new Set(['cc0', 'by', 'by-sa', 'pdm']);

const CATEGORY_FALLBACKS = {
  seguranca: 'cybersecurity server network lock privacy',
  privacidade: 'digital privacy encryption security code',
  tecnologia: 'technology hardware server computer code',
  desenvolvimento: 'software development programming code screen',
  internet: 'internet web fiber optic connection network',
  ferramentas: 'digital tools computer workspace minimal',
  geral: 'technology computer internet network modern'
};

const STOP_WORDS = new Set([
  'a', 'o', 'as', 'os', 'um', 'uma', 'uns', 'umas', 'de', 'do', 'da', 'dos', 'das',
  'em', 'no', 'na', 'nos', 'nas', 'por', 'pelo', 'pela', 'pelos', 'pelas', 'para',
  'com', 'sem', 'sob', 'sobre', 'como', 'que', 'qual', 'quando', 'onde', 'porque',
  'e', 'ou', 'mas', 'se', 'seu', 'sua', 'seus', 'suas', 'este', 'esta', 'esse', 'essa'
]);

function cleanKeywords(text) {
  if (!text) return '';
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word))
    .slice(0, 5)
    .join(' ');
}

function getCategoryFallback(category = '') {
  const norm = category.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  for (const [key, val] of Object.entries(CATEGORY_FALLBACKS)) {
    if (norm.includes(key)) return val;
  }
  return CATEGORY_FALLBACKS.geral;
}

function sanitizeAlt(itemTitle, fallbackTitle) {
  if (!itemTitle || /^IMG[_-]|^DSC[_-]|^\d+$|\.(jpg|jpeg|png|webp)$/i.test(itemTitle.trim())) {
    return fallbackTitle ? `Imagem ilustrativa sobre ${fallbackTitle}` : 'Imagem ilustrativa';
  }
  return itemTitle.trim();
}

async function fetchOpenverse(query, { wideOnly = true } = {}) {
  if (!query || !query.trim()) return [];
  const params = new URLSearchParams({
    q: query.trim(),
    license: 'cc0,by,by-sa,pdm',
    mature: 'false',
    category: 'photograph,illustration',
    page_size: '20'
  });

  if (wideOnly) {
    params.set('aspect_ratio', 'wide');
  }

  const url = `${OPENVERSE_URL}?${params.toString()}`;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'internetdozero-autopilot/1.0 (https://internetdozero.com.br)'
      },
      signal: AbortSignal.timeout(12000)
    });

    if (!response.ok) {
      console.warn(`Openverse API returned status ${response.status} for query "${query}"`);
      return [];
    }

    const data = await response.json();
    return Array.isArray(data?.results) ? data.results : [];
  } catch (error) {
    console.error(`Openverse request failed for query "${query}":`, error.message);
    return [];
  }
}

function filterCandidate(item) {
  if (!item || !item.url || !item.thumbnail) return false;
  if (!item.url.startsWith('https://') || !item.thumbnail.startsWith('https://')) return false;

  const license = String(item.license || '').toLowerCase();
  if (!ALLOWED_LICENSES.has(license)) return false;

  // Filter out tiny images if dimensions are reported
  if (item.width && item.width < 400) return false;
  if (item.height && item.height < 250) return false;

  return true;
}

export async function findLicensedImage(queryOrParams, legacyCategory) {
  let query = '';
  let title = '';
  let category = '';
  let tags = [];

  if (typeof queryOrParams === 'object' && queryOrParams !== null) {
    query = queryOrParams.query || queryOrParams.image_query || '';
    title = queryOrParams.title || queryOrParams.title_pt || '';
    category = queryOrParams.category || '';
    tags = Array.isArray(queryOrParams.tags) ? queryOrParams.tags : (queryOrParams.tags_pt || []);
  } else if (typeof queryOrParams === 'string') {
    title = queryOrParams;
    category = legacyCategory || '';
  }

  // Define fallback query candidates in order of precision
  const candidates = [];
  
  // 1. LLM visual search keywords (highest accuracy if English visual terms)
  if (query && query.trim()) {
    candidates.push(query.trim());
  }

  // 2. Cleaned tags + category
  const tagWords = tags.slice(0, 3).map((t) => cleanKeywords(t)).filter(Boolean).join(' ');
  if (tagWords) {
    candidates.push(`${tagWords} ${cleanKeywords(category)}`.trim());
  }

  // 3. Cleaned title keywords
  const titleWords = cleanKeywords(title);
  if (titleWords) {
    candidates.push(`${titleWords} ${cleanKeywords(category)}`.trim());
  }

  // 4. Default visual category keywords
  candidates.push(getCategoryFallback(category));

  for (const q of candidates) {
    if (!q) continue;

    // First attempt: wide aspect ratio for banner/cover fit
    let results = await fetchOpenverse(q, { wideOnly: true });
    let best = results.find(filterCandidate);

    // Second attempt: any safe aspect ratio if wide gave 0 results
    if (!best) {
      results = await fetchOpenverse(q, { wideOnly: false });
      best = results.find(filterCandidate);
    }

    if (best) {
      const license = String(best.license).toLowerCase();
      const licenseVersion = best.license_version ? ` ${best.license_version}` : '';
      return {
        image_url: best.url,
        image_alt: sanitizeAlt(best.title, title),
        image_source: best.source ? `Openverse (${best.source})` : 'Openverse',
        image_author: best.creator?.trim() || 'Autor sob licença aberta',
        image_license: `CC ${license.toUpperCase()}${licenseVersion}`,
        image_credit_url: best.foreign_landing_url || best.source || best.url
      };
    }
  }

  return null;
}
