const OPENVERSE_URL = 'https://api.openverse.org/v1/images/';
const ALLOWED_LICENSES = new Set(['cc0', 'by', 'by-sa', 'pdm']);

export async function findLicensedImage(title, category) {
  const query = encodeURIComponent(`${title} ${category || ''}`.trim());
  const url = `${OPENVERSE_URL}?q=${query}&license=cc0,by,by-sa,pdm&page_size=10`;
  try {
    const response = await fetch(url, {
      headers: { Accept: 'application/json', 'User-Agent': 'internetdozero-autopilot/1.0' },
      signal: AbortSignal.timeout(15000)
    });
    if (!response.ok) throw new Error(`Openverse returned ${response.status}`);
    const data = await response.json();
    const result = (data.results || []).find((item) => (
      item.url && item.thumbnail && ALLOWED_LICENSES.has(String(item.license || '').toLowerCase())
    ));
    if (!result) return null;
    const license = String(result.license).toLowerCase();
    return {
      image_url: result.url,
      image_alt: result.alt || `Imagem relacionada a ${title}`,
      image_source: 'Openverse',
      image_author: result.creator || 'Autor não informado',
      image_license: `CC ${license.toUpperCase()}`,
      image_credit_url: result.foreign_landing_url || result.source || result.url
    };
  } catch (error) {
    console.error('Licensed image lookup failed:', error);
    return null;
  }
}
