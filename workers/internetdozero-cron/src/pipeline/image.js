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

async function getRecentUsedUrls(db) {
  if (!db || typeof db.prepare !== 'function') return new Set();
  try {
    const res = await db.prepare(
      'SELECT image_url FROM posts WHERE image_url IS NOT NULL ORDER BY created_at DESC LIMIT 60'
    ).all();
    const rows = res?.results || [];
    return new Set(rows.map((r) => r.image_url).filter(Boolean));
  } catch (err) {
    console.warn('Failed to load recent image URLs for deduplication:', err.message);
    return new Set();
  }
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
  if (wideOnly) params.set('aspect_ratio', 'wide');

  try {
    const response = await fetch(`${OPENVERSE_URL}?${params.toString()}`, {
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
    return (Array.isArray(data?.results) ? data.results : []).filter((item) => {
      if (!item?.url || !item.thumbnail) return false;
      if (!item.url.startsWith('https://') || !item.thumbnail.startsWith('https://')) return false;
      const license = String(item.license || '').toLowerCase();
      if (!ALLOWED_LICENSES.has(license)) return false;
      if (item.width && item.width < 400) return false;
      if (item.height && item.height < 250) return false;
      return true;
    }).map((item) => ({
      url: item.url,
      thumbnail: item.thumbnail,
      title: item.title,
      license: item.license,
      license_version: item.license_version,
      creator: item.creator,
      source: item.source ? `Openverse (${item.source})` : 'Openverse',
      foreign_landing_url: item.foreign_landing_url || item.source || item.url
    }));
  } catch (error) {
    console.error(`Openverse request failed for query "${query}":`, error.message);
    return [];
  }
}

async function fetchWikimediaCommons(query) {
  if (!query || !query.trim()) return [];
  const params = new URLSearchParams({
    action: 'query',
    generator: 'search',
    gsrsearch: query.trim(),
    gsrlimit: '15',
    gsrnamespace: '6',
    prop: 'imageinfo',
    iiprop: 'url|size|extmetadata|mime',
    iiurlwidth: '1280',
    format: 'json',
    origin: '*'
  });

  try {
    const response = await fetch(`https://commons.wikimedia.org/w/api.php?${params.toString()}`, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'internetdozero-autopilot/1.0 (https://internetdozero.com.br; contato@internetdozero.com.br)'
      },
      signal: AbortSignal.timeout(12000)
    });
    if (!response.ok) return [];
    const data = await response.json();
    const pages = Object.values(data?.query?.pages || {});
    return pages.map((page) => {
      const info = page.imageinfo?.[0];
      if (!info) return null;
      const mime = (info.mime || '').toLowerCase();
      if (!['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(mime)) return null;

      const meta = info.extmetadata || {};
      const licenseShort = (meta.LicenseShortName?.value || meta.UsageTerms?.value || '').toLowerCase();
      const isAllowed = licenseShort.includes('cc') || licenseShort.includes('public domain') || licenseShort.includes('pd') || licenseShort.includes('pdm');
      if (!isAllowed) return null;

      const width = info.width || 0;
      const height = info.height || 0;
      if (width && width < 400) return null;
      if (height && height < 250) return null;

      const artistRaw = meta.Artist?.value || meta.Credit?.value || '';
      const artist = artistRaw.replace(/<[^>]*>/g, '').trim() || 'Wikimedia Commons';
      const licenseDisplay = meta.LicenseShortName?.value || 'Public Domain / CC';

      return {
        url: info.thumburl || info.url,
        thumbnail: info.thumburl || info.url,
        title: (page.title || '').replace(/^File:/i, ''),
        license: licenseDisplay,
        creator: artist,
        source: 'Wikimedia Commons',
        foreign_landing_url: info.descriptionurl || `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title || '')}`
      };
    }).filter(Boolean);
  } catch (error) {
    console.warn(`Wikimedia Commons search failed for "${query}":`, error.message);
    return [];
  }
}

async function fetchPexels(query, apiKey) {
  if (!apiKey || !query || !query.trim()) return [];
  try {
    const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=15&orientation=landscape`, {
      headers: { Authorization: apiKey, Accept: 'application/json' },
      signal: AbortSignal.timeout(10000)
    });
    if (!response.ok) return [];
    const data = await response.json();
    return (data?.photos || []).map((p) => ({
      url: p.src?.large2x || p.src?.large || p.src?.original,
      thumbnail: p.src?.medium || p.src?.tiny,
      title: p.alt || query,
      license: 'Pexels License',
      creator: p.photographer,
      source: 'Pexels',
      foreign_landing_url: p.url
    })).filter((item) => item.url && item.url.startsWith('https://'));
  } catch (err) {
    console.warn(`Pexels fetch failed for "${query}":`, err.message);
    return [];
  }
}

async function fetchUnsplash(query, accessKey) {
  if (!accessKey || !query || !query.trim()) return [];
  try {
    const response = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=15&orientation=landscape`, {
      headers: { Authorization: `Client-ID ${accessKey}`, Accept: 'application/json' },
      signal: AbortSignal.timeout(10000)
    });
    if (!response.ok) return [];
    const data = await response.json();
    return (data?.results || []).map((p) => ({
      url: p.urls?.regular || p.urls?.full,
      thumbnail: p.urls?.thumb || p.urls?.small,
      title: p.description || p.alt_description || query,
      license: 'Unsplash License',
      creator: p.user?.name || p.user?.username,
      source: 'Unsplash',
      foreign_landing_url: p.links?.html || `https://unsplash.com/photos/${p.id}`
    })).filter((item) => item.url && item.url.startsWith('https://'));
  } catch (err) {
    console.warn(`Unsplash fetch failed for "${query}":`, err.message);
    return [];
  }
}

async function fetchPixabay(query, apiKey) {
  if (!apiKey || !query || !query.trim()) return [];
  try {
    const response = await fetch(`https://pixabay.com/api/?key=${encodeURIComponent(apiKey)}&q=${encodeURIComponent(query)}&image_type=photo&orientation=horizontal&per_page=15&safesearch=true`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(10000)
    });
    if (!response.ok) return [];
    const data = await response.json();
    return (data?.hits || []).map((p) => ({
      url: p.largeImageURL || p.webformatURL,
      thumbnail: p.previewURL || p.webformatURL,
      title: p.tags || query,
      license: 'Pixabay License',
      creator: p.user,
      source: 'Pixabay',
      foreign_landing_url: p.pageURL
    })).filter((item) => item.url && item.url.startsWith('https://'));
  } catch (err) {
    console.warn(`Pixabay fetch failed for "${query}":`, err.message);
    return [];
  }
}

function pickRandomCandidate(candidates) {
  if (!candidates || candidates.length === 0) return null;
  const topPool = candidates.slice(0, Math.min(candidates.length, 5));
  return topPool[Math.floor(Math.random() * topPool.length)];
}

function formatResult(best, fallbackTitle) {
  if (!best) return null;
  const rawLic = String(best.license || '').trim();
  let licenseDisplay = rawLic;
  if (/^(cc0|by|by-sa|by-nc|by-nc-sa|pdm)$/i.test(rawLic)) {
    licenseDisplay = `CC ${rawLic.toUpperCase()}`;
  }
  const licenseVersion = best.license_version ? ` ${best.license_version}` : '';

  return {
    image_url: best.url,
    image_alt: sanitizeAlt(best.title, fallbackTitle),
    image_source: best.source || 'Openverse',
    image_author: best.creator?.trim() || 'Autor sob licença aberta',
    image_license: `${licenseDisplay}${licenseVersion}`.trim(),
    image_credit_url: best.foreign_landing_url || best.source || best.url
  };
}

export async function findLicensedImage(queryOrParams, optionsOrCategory = {}) {
  let query = '';
  let title = '';
  let category = '';
  let tags = [];
  const options = typeof optionsOrCategory === 'object' && optionsOrCategory !== null ? optionsOrCategory : {};
  const legacyCategory = typeof optionsOrCategory === 'string' ? optionsOrCategory : '';

  if (typeof queryOrParams === 'object' && queryOrParams !== null) {
    query = queryOrParams.query || queryOrParams.image_query || '';
    title = queryOrParams.title || queryOrParams.title_pt || '';
    category = queryOrParams.category || '';
    tags = Array.isArray(queryOrParams.tags) ? queryOrParams.tags : (queryOrParams.tags_pt || []);
  } else if (typeof queryOrParams === 'string') {
    title = queryOrParams;
    category = legacyCategory || '';
  }

  const db = options.db || options.env?.DB;
  const env = options.env || {};
  const usedUrls = await getRecentUsedUrls(db);

  const candidates = [];
  if (query && query.trim()) candidates.push(query.trim());
  const tagWords = tags.slice(0, 3).map((t) => cleanKeywords(t)).filter(Boolean).join(' ');
  if (tagWords) candidates.push(`${tagWords} ${cleanKeywords(category)}`.trim());
  const titleWords = cleanKeywords(title);
  if (titleWords) candidates.push(`${titleWords} ${cleanKeywords(category)}`.trim());
  candidates.push(getCategoryFallback(category));

  for (const q of candidates) {
    if (!q) continue;

    // 1. Premium free providers if keys are configured
    if (env.PEXELS_API_KEY) {
      const pexels = (await fetchPexels(q, env.PEXELS_API_KEY)).filter((c) => !usedUrls.has(c.url));
      const chosen = pickRandomCandidate(pexels);
      if (chosen) return formatResult(chosen, title);
    }

    if (env.UNSPLASH_ACCESS_KEY) {
      const unsplash = (await fetchUnsplash(q, env.UNSPLASH_ACCESS_KEY)).filter((c) => !usedUrls.has(c.url));
      const chosen = pickRandomCandidate(unsplash);
      if (chosen) return formatResult(chosen, title);
    }

    if (env.PIXABAY_API_KEY) {
      const pixabay = (await fetchPixabay(q, env.PIXABAY_API_KEY)).filter((c) => !usedUrls.has(c.url));
      const chosen = pickRandomCandidate(pixabay);
      if (chosen) return formatResult(chosen, title);
    }

    // 2. Open Commons: Wikimedia Commons (great for culture, TV, personalities, history, tech)
    const wikimedia = (await fetchWikimediaCommons(q)).filter((c) => !usedUrls.has(c.url));
    const chosenWiki = pickRandomCandidate(wikimedia);
    if (chosenWiki) return formatResult(chosenWiki, title);

    // 3. Openverse (Wide first, then any safe aspect ratio)
    let openverse = (await fetchOpenverse(q, { wideOnly: true })).filter((c) => !usedUrls.has(c.url));
    if (openverse.length === 0) {
      openverse = (await fetchOpenverse(q, { wideOnly: false })).filter((c) => !usedUrls.has(c.url));
    }
    const chosenOpenverse = pickRandomCandidate(openverse);
    if (chosenOpenverse) return formatResult(chosenOpenverse, title);
  }

  return null;
}
